let defaultPreferredCanvasFormat: GPUTextureFormat;

export async function initializeSystem() {
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    defaultPreferredCanvasFormat = navigator.gpu.getPreferredCanvasFormat();
}

export { defaultPreferredCanvasFormat };