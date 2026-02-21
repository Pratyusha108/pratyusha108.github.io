// portfolio-embedded RAG chat interface
// lazy-initializes on first interaction so it doesn't slow down page load
// adapted to work alongside the existing chatbot without conflicts

export class ChatUI {
  constructor(container, pipeline, options = {}) {
    this.el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.el) return;
    this.pipeline = pipeline;
    this.suggestions = options.suggestions || [
      'What are your main technical skills?',
      'Tell me about your ML projects',
      'What is your education background?',
      'How does this RAG system work?'
    ];
    this.kbPath = options.kbPath || 'assets/js/rag/knowledge-base.json';
    this.initialized = false;
    this._build();
    this._bind();
  }

  _build() {
    this.el.innerHTML = `
      <div class="rag-chat">
        <div class="rag-messages" id="rag-messages">
          <div class="rag-welcome">
            <div class="rag-welcome-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
            <p class="rag-welcome-title">Ask my portfolio anything</p>
            <span class="rag-welcome-sub">Powered by in-browser vector search. No APIs, no server, no data leaves your device.</span>
          </div>
          <div class="rag-suggestions" id="rag-suggestions">
            ${this.suggestions.map(s => `<button class="rag-chip">${s}</button>`).join('')}
          </div>
        </div>
        <div class="rag-status" id="rag-status">
          <div class="rag-status-dot"></div>
          <span>Click input to initialize</span>
        </div>
        <div class="rag-input-row">
          <input type="text" class="rag-input" id="rag-input" placeholder="Ask about my skills, projects, experience..." autocomplete="off" />
          <button class="rag-send" id="rag-send" aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    this.messagesEl = this.el.querySelector('#rag-messages');
    this.inputEl = this.el.querySelector('#rag-input');
    this.sendBtn = this.el.querySelector('#rag-send');
    this.statusEl = this.el.querySelector('#rag-status');
    this.suggestionsEl = this.el.querySelector('#rag-suggestions');
  }

  _bind() {
    this.sendBtn.addEventListener('click', () => this._send());

    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._send();
      }
    });

    this.el.querySelectorAll('.rag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.inputEl.value = chip.textContent;
        this._send();
      });
    });

    // lazy init -- don't download models until someone interacts
    this.inputEl.addEventListener('focus', () => this._init(), { once: true });
  }

  async _init() {
    if (this.initialized) return;
    this._setStatus('Loading embedding model...', 'loading');

    try {
      const resp = await fetch(this.kbPath);
      if (!resp.ok) throw new Error('Failed to load knowledge base');
      const kb = await resp.json();

      await this.pipeline.init(kb, {
        onStatusChange: (status) => {
          const labels = {
            'loading-embedder': 'Loading embedding model...',
            'indexing': 'Building vector index...',
            'loading-generator': 'Checking WebGPU support...',
            'ready': 'Ready'
          };
          const label = labels[status] || status;
          this._setStatus(label, status === 'ready' ? 'ready' : 'loading');
        },
        onEmbedProgress: (progress) => {
          if (progress.status === 'progress' && progress.progress) {
            this._setStatus(`Downloading model... ${Math.round(progress.progress)}%`, 'loading');
          }
        }
      });

      this.initialized = true;
      const modeLabel = this.pipeline.generator.mode === 'llm'
        ? 'LLM generation active'
        : 'Semantic search active';
      this._setStatus(modeLabel, 'ready');
    } catch (err) {
      this._setStatus('Initialization failed -- refresh to retry', 'error');
      console.error('RAG init error:', err);
    }
  }

  async _send() {
    const q = this.inputEl.value.trim();
    if (!q) return;

    if (!this.initialized) {
      await this._init();
      if (!this.initialized) return;
    }

    if (this.suggestionsEl) {
      this.suggestionsEl.style.display = 'none';
    }

    this._addMsg(q, 'user');
    this.inputEl.value = '';
    this.inputEl.focus();

    const thinkId = this._addThinking();

    try {
      const result = await this.pipeline.ask(q);
      this._removeEl(thinkId);
      this._addMsg(result.answer, 'assistant', result);
    } catch (err) {
      this._removeEl(thinkId);
      this._addMsg('Something went wrong. Try rephrasing your question.', 'assistant');
      console.error('RAG query error:', err);
    }
  }

  _addMsg(text, role, result = null) {
    const welcome = this.messagesEl.querySelector('.rag-welcome');
    if (welcome) welcome.remove();

    const div = document.createElement('div');
    div.className = `rag-msg rag-msg-${role}`;

    let html = `<div class="rag-msg-text">${this._fmt(text)}</div>`;

    if (result && result.sources && result.sources.length > 0) {
      const timingParts = ['embed', 'retrieve', 'generate']
        .filter(k => result.timing[k] !== undefined)
        .map(k => `${k}: ${result.timing[k].toFixed(0)}ms`);

      const srcId = 'rsrc-' + Date.now();
      html += `
        <div class="rag-meta">
          <button class="rag-sources-btn" data-target="${srcId}">
            <i class="fas fa-layer-group"></i>
            Sources (${result.sources.length}) &middot; ${result.timing.total.toFixed(0)}ms
          </button>
          <div class="rag-sources-panel" id="${srcId}">
            <div class="rag-timing">${timingParts.join(' &middot; ')}</div>
            ${result.sources.map(s => `
              <div class="rag-source">
                <div class="rag-source-score">${(s.score * 100).toFixed(1)}%</div>
                <div class="rag-source-text">${this._truncate(s.content, 180)}</div>
              </div>
            `).join('')}
            <div class="rag-mode-tag">${result.mode === 'llm' ? 'Generated by local LLM (WebGPU)' : 'Retrieved from knowledge base'}</div>
          </div>
        </div>
      `;
    }

    div.innerHTML = html;

    const btn = div.querySelector('.rag-sources-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const panel = div.querySelector(`#${btn.dataset.target}`);
        if (panel) panel.classList.toggle('open');
      });
    }

    this.messagesEl.appendChild(div);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  _addThinking() {
    const id = 'rthink-' + Date.now();
    const div = document.createElement('div');
    div.className = 'rag-msg rag-msg-assistant rag-thinking';
    div.id = id;
    div.innerHTML = `
      <div class="rag-msg-text">
        <div class="rag-dots"><span></span><span></span><span></span></div>
      </div>
    `;
    this.messagesEl.appendChild(div);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    return id;
  }

  _removeEl(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  _setStatus(text, state) {
    const dot = this.statusEl.querySelector('.rag-status-dot');
    const span = this.statusEl.querySelector('span');
    span.textContent = text;
    dot.className = 'rag-status-dot ' + (state || '');
  }

  _fmt(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }

  _truncate(str, len) {
    if (str.length <= len) return str;
    return str.slice(0, len) + '...';
  }
}
