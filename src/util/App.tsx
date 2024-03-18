import React, { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { initWebGPU } from "./math/util";
import { Renderer } from "./math/Renderer";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function App({ dani }: { dani: string }) {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    initWebGPU(ref.current).then(({ device, context, adapter }) => {
      const renderer = new Renderer(context, device, adapter);
      renderer.render();
    });
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <canvas width={800} height={600} ref={ref} />
    </>
  );
}
