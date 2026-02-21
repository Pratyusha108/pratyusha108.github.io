// sentence embeddings via all-MiniLM-L6-v2 (Transformers.js / ONNX runtime)
// first load pulls ~23MB from HuggingFace CDN, browser caches it after that
// surprisingly fast -- embedding a sentence takes ~50ms after warmup

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// skip local model check, always pull from CDN
env.allowLocalModels = false;

let model = null;

export async function init(progressCallback) {
  if (model) return;
  model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    progress_callback: progressCallback || (() => {})
  });
}

export async function embed(text) {
  if (!model) throw new Error('call init() first');
  const result = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(result.data);
}
