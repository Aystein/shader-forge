struct OurStruct {
  projectionMatrix: mat4x4f,
  screenCorrection: vec2f,
}

struct VertexInput {
  position: vec2f,
}

@group(0) @binding(0) var<uniform> ourStruct: OurStruct;
@group(0) @binding(1) var<storage, read> vertexInput: array<VertexInput>;

@vertex
fn main(
  @builtin(vertex_index) VertexIndex : u32,
  @builtin(instance_index) InstanceIndex : u32
) -> @builtin(position) vec4f {
  var quadVerts = array<vec2f, 6>(
    vec2f(-1.0, -1.0),
    vec2f(1.0, -1.0),
    vec2f(1.0, 1.0),
    vec2f(-1.0, -1.0),
    vec2f(1.0, 1.0),
    vec2f(-1.0, 1.0)
  );

  // domain space
  var newPos = vertexInput[InstanceIndex].position;

  // normal space
  let normalPos = vec4f(newPos, 0.0, 1.0) * ourStruct.projectionMatrix;
  var pixelPos = normalPos.xy * vec2f(800.0, 600.0);

  pixelPos.x = round(pixelPos.x);
  pixelPos.y = round(pixelPos.y);

  // 0.5 correction
  // pixelPos.x += 0.5;
  // pixelPos.y += 0.5;

  // back to normal space
  newPos.x = pixelPos.x / 800.0;
  newPos.y = pixelPos.y / 600.0;

  return vec4f(normalPos.x, normalPos.y, 0.0, 1.0) + (vec4f(quadVerts[VertexIndex] * vec2f(1.0 / 400.0, 1.0 / 300.0) * 10.0, 0.0, 1.0));
}