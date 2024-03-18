import { z } from "zod";
import { Matrix4 } from "./Matrix4";

const schema = z.array(z.number());

export type UniformData = z.infer<typeof schema>;

const test = z.object({
  projectionMatrix: z.custom<Matrix4>((data) => data instanceof Matrix4).
})

test.shape

const obj: z.infer<typeof test> = null;


function set<T>() {

}

export class Uniform<T> {
  constructor() {

  }

  public sample() {
    
  }

  
}