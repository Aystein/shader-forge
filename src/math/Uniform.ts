import { Matrix4 } from "./Matrix4";
import { memoryLayout } from "./MemoryLayout";
import { WebGPUType } from "./Typtes";
import { nextMultipleOfK } from "./util";



function sizeForType(type: WebGPUType) {
  return memoryLayout[type].size;
}



type InputSchema = { [k: string]: { type: WebGPUType } };
// type KeyPart = Array<{ name: string, type: WebGPUType }>;
type ValuePart<T extends InputSchema> = { [P in keyof T]: T[P]['type'] };

type ConvertedValuePart<T extends InputSchema> = { [P in keyof T]: Conversion<T[P]['type']> };

type Conversion<T extends WebGPUType> =
 (T extends 'mat4' ? Matrix4 : never) |
  (T extends 'vec2' ? Float32Array : never) |
  (T extends 'vec3' ? Float32Array : never) |
  (T extends 'vec4' ? Float32Array : never);

export class BufferSchema<T extends InputSchema, Keys extends keyof T>{
  size: number;
  keys: string[];
  offsetLookup: { [P in Keys]: number };

  constructor(public readonly schema: T) {
    this.keys = Object.keys(schema);

    // @ts-ignore
    this.offsetLookup = {};

    this.size = this.keys.reduce((acc, key) => {
      const entry = schema[key];
      const { size, alignment } = memoryLayout[entry.type];

      const alignedPosition = nextMultipleOfK(alignment, acc);
      this.offsetLookup[key] = alignedPosition;

      return alignedPosition + size;
    }, 0);

    // this.size = nextMultipleOfK(16, this.size);
  }

  writeIntoBuffer(data: ArrayBuffer, value: Partial<{ [P in keyof T]: Conversion<T[P]['type']> }>, index?: number) {
    Object.keys(value).forEach((key) => {
      const { type } = this.schema[key];
      const start = (index || 0) * this.size + this.offsetLookup[key];

      switch (type) {
        case 'mat4': {
          const view = new Float32Array(data, start, 16);
          view.set(value[key].elements);
          break;
        }
        case 'vec2': {
          const view = new Float32Array(data, start, 2);
          view.set(value[key]);
          break;
        }
      }
    })
  }
}

export class TypedBuffer<T extends InputSchema, Keys extends keyof T> {
  values: ValuePart<T> = null;
  buffer: GPUBuffer;
  localBuffer: ArrayBuffer;

  constructor(private device: GPUDevice, public schema: BufferSchema<T, Keys>, amount: number, usage: number) {
    this.buffer = device.createBuffer({
      size: schema.size * amount,
      usage,
    });

    this.localBuffer = new ArrayBuffer(schema.size * amount);
  }

  set(index: number, value: Partial<ConvertedValuePart<T>>) {
    this.schema.writeIntoBuffer(this.localBuffer, value, index);
  }

  flush() {
    this.device.queue.writeBuffer(this.buffer, 0, this.localBuffer);
  }
}