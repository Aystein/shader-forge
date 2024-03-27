import React from "react";
import { initWebGPU } from "./math/util";
import { Renderer } from "./math/Renderer";
import * as T from './math/Uniform';
import { defaultAdapter, defaultDevice } from "./math/System";

console.log(T)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function App() {
    const ref = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        const renderer = new Renderer(ref.current.getContext("webgpu"), defaultDevice, defaultAdapter);
        renderer.render();
    }, []);

    return (
        <canvas width={800} height={600} ref={ref} />
    );
}
