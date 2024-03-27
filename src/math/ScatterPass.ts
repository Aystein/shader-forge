import { BaseRenderPass } from "./BaseRenderPass";
import { BufferSchema } from "./Uniform";

const pointSchema = new BufferSchema({
    position: { type: 'vec2' },
});

export class ScatterPass extends BaseRenderPass {
    constructor() {

    }
}