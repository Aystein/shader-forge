import { expect, test } from 'vitest'
import { nextMultipleOfK } from '../math/util'
import { BufferSchema } from '../math/Uniform'
import { Matrix4 } from '../math/Matrix4'

test('next multiple of K', () => {
  expect(nextMultipleOfK(16, 12)).toBe(16)
})

test('test buffer alignment 1', () => {
    const schema = new BufferSchema({
        position: { type: 'vec3' },
        color: { type: 'vec3' },
        normal: { type: 'vec3' },
    })

    expect(schema.size).toBe(48)
    expect(schema.offsetLookup.position).toBe(0)
    expect(schema.offsetLookup.color).toBe(16)
    expect(schema.offsetLookup.normal).toBe(32)
})

test('test buffer alignment 2', () => {
    const schema = new BufferSchema({
        a: { type: 'mat4' },
        b: { type: 'vec3' },
        c: { type: 'mat4' },
    })

    expect(schema.size).toBe(64 + 16 + 64)
    expect(schema.offsetLookup.a).toBe(0)
    expect(schema.offsetLookup.b).toBe(16)
    expect(schema.offsetLookup.c).toBe(32)
})