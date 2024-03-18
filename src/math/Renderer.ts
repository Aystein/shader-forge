import { ShaderSystem } from "./ShaderSystem";
import regFragWGSL from "./reg.frag.wgsl?raw";
import triangleVertWGSL from "./triangle.vert.wgsl?raw";

export class Renderer {
  canvasFormat: GPUTextureFormat;
  pipeline: GPURenderPipeline;

  constructor(
    private context: GPUCanvasContext,
    private device: GPUDevice,
    private adapter: GPUAdapter
  ) {
    this.configureContext();
    this.createDefaultPipeline();
  }

  configureContext() {
    const { device } = this;
    this.canvasFormat = navigator.gpu.getPreferredCanvasFormat();

    this.context.configure({
      device,
      format: this.canvasFormat,
      alphaMode: "premultiplied",
    });
  }

  createDefaultPipeline() {
    const { device } = this;

    const shaderSystem = new ShaderSystem(device);

    shaderSystem.compileShaderModule(triangleVertWGSL);
    shaderSystem.compileShaderModule(regFragWGSL);



    this.pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: device.createShaderModule({
          code: triangleVertWGSL,
        }),
        entryPoint: "main",
      },
      fragment: {
        module: device.createShaderModule({
          code: regFragWGSL,
        }),
        entryPoint: "main",
        targets: [
          {
            format: this.canvasFormat,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
    });
  }

  render() {
    const { device, context, pipeline } = this;

    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.5, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.draw(3);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
  }
}
