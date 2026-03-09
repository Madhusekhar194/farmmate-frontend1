let pipeline;

async function getPipeline() {
    if (!pipeline) {
        const { pipeline: transformerPipeline } = await import('@xenova/transformers');
        pipeline = await transformerPipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return pipeline;
}

async function generateEmbedding(text) {
    const extractor = await getPipeline();
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
    }
    return dotProduct;
}

module.exports = { generateEmbedding, cosineSimilarity };
