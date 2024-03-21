struct Input {
    position: vec4f,
}

@group(0) @binding(0) var<storage, read_write> data: array<Input>;
 
@compute @workgroup_size(1) fn main(
  @builtin(global_invocation_id) id: vec3<u32>
) {
  let i = id.x;
  let k = data[0];
}