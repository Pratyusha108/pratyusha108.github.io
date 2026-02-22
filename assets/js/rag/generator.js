// two generation modes:
// 1. WebGPU available -> load SmolLM via WebLLM, generate real answers
// 2. no WebGPU -> construct answers from retrieved chunks directly
// template mode is honestly decent for a curated knowledge base

export class Generator {
  constructor() {
    this.engine = null;
    this.mode = 'template';
    this.ready = false;
  }

  async init(onProgress) {
    const hasWebGPU = await this._checkWebGPU();

    if (!hasWebGPU) {
      this.mode = 'template';
      this.ready = true;
      return 'template';
    }

    try {
      const { CreateMLCEngine } = await import(
        /* webpackIgnore: true */
        'https://esm.run/@mlc-ai/web-llm'
      );

      this.engine = await CreateMLCEngine('SmolLM2-135M-Instruct-q4f16_1-MLC', {
        initProgressCallback: onProgress || (() => {})
      });

      this.mode = 'llm';
      this.ready = true;
      return 'llm';
    } catch (err) {
      console.warn('WebLLM failed, using template mode:', err.message);
      this.mode = 'template';
      this.ready = true;
      return 'template';
    }
  }

  async generate(question, chunks) {
    if (chunks.length === 0) {
      return {
        answer: "I don't have information about that in my knowledge base. Try asking about my projects, skills, experience, or education.",
        mode: this.mode
      };
    }

    if (this.mode === 'llm' && this.engine) {
      return this._llmGenerate(question, chunks);
    }

    return this._templateGenerate(question, chunks);
  }

  async _llmGenerate(question, chunks) {
    const context = chunks
      .map((c, i) => `[${i + 1}] ${c.document.content}`)
      .join('\n\n');

    const resp = await this.engine.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are answering questions about a data scientist\'s portfolio. Use ONLY the provided context. Be concise and direct. Write in first person where appropriate.'
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`
        }
      ],
      max_tokens: 300,
      temperature: 0.3
    });

    return {
      answer: resp.choices[0].message.content.trim(),
      mode: 'llm'
    };
  }

  _templateGenerate(question, chunks) {
    // only return the single best match if there's just one
    if (chunks.length === 1) {
      return { answer: chunks[0].document.content, mode: 'template' };
    }

    // only merge chunks that share the same topic as the top result
    // this prevents "experience" from leaking into "projects" answers
    var topTopic = (chunks[0].document.metadata && chunks[0].document.metadata.topic) || '';
    var sameTopic = chunks.filter(function (c) {
      var t = (c.document.metadata && c.document.metadata.topic) || '';
      return t === topTopic;
    });

    // if only the top result matches this topic, just return it
    if (sameTopic.length === 1) {
      return { answer: sameTopic[0].document.content, mode: 'template' };
    }

    // merge same-topic chunks with a topic-aware intro
    var intros = {
      projects: 'Here are some of my key projects:\n\n',
      skills: 'Here is an overview of my technical skills:\n\n',
      experience: '',
      education: '',
      certifications: ''
    };
    var intro = intros[topTopic] || '';

    var merged = sameTopic
      .map(function (c) { return c.document.content; })
      .join('\n\n');

    return { answer: intro + merged, mode: 'template' };
  }

  async _checkWebGPU() {
    if (!navigator.gpu) return false;
    try {
      const adapter = await navigator.gpu.requestAdapter();
      return !!adapter;
    } catch { return false; }
  }
}
