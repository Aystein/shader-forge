import { Matrix4 } from "./Matrix4";
import { ShaderSystem } from "./ShaderSystem";
import { BufferSchema, TypedBuffer } from "./Uniform";
import regFragWGSL from "./reg.frag.wgsl?raw";
import triangleVertWGSL from "./triangle.vert.wgsl?raw";
import * as GPU from 'zustand/'
import computeShader from './scatter.compute.wgsl?raw';

const pointSchema = new BufferSchema({
  position: { type: 'vec2' },
});

export class Renderer {
  canvasFormat: GPUTextureFormat;
  pipeline: GPURenderPipeline;
  schema = new BufferSchema({
    projectionMatrix: { type: 'mat4' },
    screenCorrection: { type: 'vec2' }
  })
  buffer: GPUBuffer;
  bindGroup: GPUBindGroup;

  computePipeline: GPUComputePipeline;
  computebindGroup: GPUBindGroup;

  constructor(
    private context: GPUCanvasContext,
    private device: GPUDevice,
    private adapter: GPUAdapter
    ) {
    const mypointBuffer = new TypedBuffer(this.device, pointSchema, 6, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX);

    mypointBuffer.set(0, {
      position: new Float32Array([0.5, 0.5])
    })
    mypointBuffer.set(1, {
      position: new Float32Array([-0.5, -0.5]),
    })
    mypointBuffer.set(2, {
      position: new Float32Array([-1, 1.5])
    })
    mypointBuffer.set(3, {
      position: new Float32Array([0.5, -0.5])
    })
    mypointBuffer.set(4, {
      position: new Float32Array([0.5, 0.5])
    })
    mypointBuffer.set(5, {
      position: new Float32Array([-0.5, 0.5])
    })
    this.pointBuffer = mypointBuffer;
    console.log(pointSchema.size);

    mypointBuffer.flush();
    console.log(new Float32Array(mypointBuffer.localBuffer));

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

    this.computePipeline = device.createComputePipeline({
      compute: {
        module: device.createShaderModule({
          code: computeShader,
        }),
        entryPoint: "main",
      },
      layout: 'auto'
    });

    this.computebindGroup = device.createBindGroup({
      layout: this.computePipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.pointBuffer.buffer
          }
        },
      ]
    });

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

    this.buffer = device.createBuffer({
      size: 128,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    

    this.bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.buffer } },
        { binding: 1, resource: { buffer: this.pointBuffer.buffer } }
      ],
    });
    
    
    const arrayBuffer = new ArrayBuffer(16 * 8);
    this.schema.writeIntoBuffer(arrayBuffer, {
      projectionMatrix: new Matrix4(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ).makeOrthographic(-3, 3, 3, -3, 0, 1).transpose()
    });

    this.schema.writeIntoBuffer(arrayBuffer, {
      screenCorrection: new Float32Array([1 / 800, 1 / 600])
    });

    device.queue.writeBuffer(this.buffer, 0, arrayBuffer);
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


    /* const computeEncoder = commandEncoder.beginComputePass();
    computeEncoder.setPipeline(this.computePipeline);
    computeEncoder.setBindGroup(0, this.computebindGroup);
    computeEncoder.dispatchWorkgroups(3);
    computeEncoder.end();
*/

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    passEncoder.setBindGroup(0, this.bindGroup);

    passEncoder.setPipeline(pipeline);
    passEncoder.draw(6, 3);
    passEncoder.end();


    
    device.queue.submit([commandEncoder.finish()]);
  }
}
