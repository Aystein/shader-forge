export class RenderPass {
    constructor() {
    }

    begin(encoder: GPUCommandEncoder) {
        encoder.beginRenderPass({
            colorAttachments: [
                {
                    view: context.swapChain.getCurrentTexture().createView(),
                    loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
                    storeOp: 'store',
                }
            ],
        });
    }

    end() {

    }

    encode(encoder: GPUCommandEncoder) {
        const renderPass = encoder.beginRenderPass()


        
        renderPass.end();
    }
}

export function renderPass(commandEncoder: GPUCommandEncoder) {
    return {
      encode: (callback: (encoder: GPURenderPassEncoder) => void) => {
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        
        callback(passEncoder);

        passEncoder.end();
      }
    }
  }