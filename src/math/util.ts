export async function initWebGPU(canvas: HTMLCanvasElement) {
  const adapter = await navigator.gpu.requestAdapter();

  const device = await adapter.requestDevice();

  const context = canvas.getContext("webgpu") as GPUCanvasContext;

  return { device, context, adapter };
}
