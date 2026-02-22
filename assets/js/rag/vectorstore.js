// in-memory vector store with cosine similarity
// works fine for <100 docs -- you'd want HNSW or similar for anything bigger
// caches embeddings in sessionStorage so repeat visits skip the heavy compute

const CACHE_KEY = 'rag0_kb_embeddings';

export class VectorStore {
  constructor() {
    this.documents = [];
    this.embeddings = [];
  }

  // cosine similarity -- normalized vectors simplify this to just dot product
  static cosine(a, b) {
    let dot = 0;
    for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
    return dot;
  }

  async index(documents, embedFn, onProgress) {
    this.documents = documents;

    // try sessionStorage cache first -- saves 5-10 seconds on reload
    const cached = this._loadCache(documents);
    if (cached) {
      this.embeddings = cached;
      if (onProgress) onProgress(documents.length, documents.length);
      return;
    }

    this.embeddings = [];
    for (let i = 0; i < documents.length; i++) {
      this.embeddings.push(await embedFn(documents[i].content));
      if (onProgress) onProgress(i + 1, documents.length);
    }

    this._saveCache(documents);
  }

  // top-K retrieval with similarity threshold
  // 0.10 cutoff keeps garbage out without being too aggressive for small KBs
  search(queryEmbedding, topK = 3, threshold = 0.10) {
    const scored = this.embeddings.map((emb, i) => ({
      document: this.documents[i],
      score: VectorStore.cosine(queryEmbedding, emb)
    }));

    return scored
      .filter(r => r.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  _hash(docs) {
    return docs.map(d => `${d.id}:${d.content.length}`).join('|');
  }

  _loadCache(docs) {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { hash, embeddings } = JSON.parse(raw);
      if (hash !== this._hash(docs)) return null;
      return embeddings;
    } catch { return null; }
  }

  _saveCache(docs) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        hash: this._hash(docs),
        embeddings: this.embeddings
      }));
    } catch { /* sessionStorage full -- not critical */ }
  }
}
