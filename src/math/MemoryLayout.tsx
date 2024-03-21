import { WebGPUType } from "./Typtes";

export type LayoutEntry = {
    size: number;
    alignment: number;
};

export const memoryLayout: Record<WebGPUType, LayoutEntry> = {
    mat4: { size: 64, alignment: 16 },
    vec4: { size: 16, alignment: 16 },
    vec3: { size: 12, alignment: 16 },
    vec2: { size: 8, alignment: 8 },
    float: { size: 4, alignment: 4 },
    int: { size: 4, alignment: 4 },
    uint: { size: 4, alignment: 4 },
    bool: { size: 4, alignment: 4 },
}