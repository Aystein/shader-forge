import React from "react";
import { initWebGPU } from "./math/util";
import { Renderer } from "./math/Renderer";
import * as T from './math/Uniform';

console.log(T)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function App() {
    const ref = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        initWebGPU(ref.current).then(({ device, adapter }) => {
            const renderer = new Renderer(ref.current.getContext("webgpu"), device, adapter);
        renderer.render();
        });
        
    }, []);

    return (
        <canvas width={800} height={600} ref={ref} />
    );
}
