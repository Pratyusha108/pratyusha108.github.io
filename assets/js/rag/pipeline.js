// RAG pipeline: embed -> retrieve -> generate
// wraps the three stages into a single ask() call
// tracks timing for each stage so users can see where time goes

import { init as initEmbedder, embed } from './embedder.js';
import { VectorStore } from './vectorstore.js';
import { Generator } from './generator.js';

export class RAGPipeline {
  constructor(config = {}) {
    this.store = new VectorStore();
    this.generator = new Generator();
    this.topK = config.topK || 3;
    this.threshold = config.threshold || 0.10;
    this.ready = false;
    this.status = 'idle';
  }

  async init(knowledgeBase, callbacks = {}) {
    const { onEmbedProgress, onLLMProgress, onStatusChange } = callbacks;
    const emit = (s) => {
      this.status = s;
      if (onStatusChange) onStatusChange(s);
    };

    emit('loading-embedder');
    await initEmbedder(onEmbedProgress);

    emit('indexing');
    await this.store.index(knowledgeBase, embed, (done, total) => {
      emit(`indexing ${done}/${total}`);
    });

    emit('loading-generator');
    const mode = await this.generator.init(onLLMProgress);

    this.ready = true;
    emit('ready');
    return mode;
  }

  async ask(question) {
    if (!this.ready) throw new Error('pipeline not initialized');

    const timing = {};

    const t0 = performance.now();
    const queryVec = await embed(question);
    timing.embed = performance.now() - t0;

    const t1 = performance.now();
    const results = this.store.search(queryVec, this.topK, this.threshold);
    timing.retrieve = performance.now() - t1;

    const t2 = performance.now();
    const { answer, mode } = await this.generator.generate(question, results);
    timing.generate = performance.now() - t2;

    timing.total = timing.embed + timing.retrieve + timing.generate;

    return {
      answer,
      sources: results.map(r => ({
        id: r.document.id,
        content: r.document.content,
        score: Math.round(r.score * 1000) / 1000,
        metadata: r.document.metadata || {}
      })),
      timing,
      mode
    };
  }
}
