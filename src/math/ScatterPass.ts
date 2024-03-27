import { BufferSchema } from "./Uniform";

const pointSchema = new BufferSchema({
    position: { type: 'vec2' },
});

export class ScatterPass {
    constructor(private bufferSchema) {

    }
}