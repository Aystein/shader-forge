import { defaultDevice, defaultPreferredCanvasFormat } from "./System";

let shaderModule: ShaderSystem;
let shaderCache: Map<string, GPUShaderModule> = new Map();

export class ShaderSystem {
  constructor() {}

  compileFragment(code: string, config?: { entryPoint: string, targets: GPUColorTargetState[] }) {
    return {
      module: shaderModule.compileShaderModule(code),
      entryPoint: config?.entryPoint || "main",
      targets: config?.targets || [
        {
          format: defaultPreferredCanvasFormat,
        },
      ],
    };
  }

  compileVertex(code: string, config?: { entryPoint }) {
    return {
      module: shaderModule.compileShaderModule(code),
      entryPoint: config?.entryPoint || "main",
    }
  }

  compileShaderModule(code: string) {
    if (shaderCache.has(code)) {
      return shaderCache.get(code);
    }

    const shaderModule = defaultDevice.createShaderModule({
      code,
    });

    shaderModule.getCompilationInfo().then((compilationInfo) => {
      for (const message of compilationInfo.messages) {
        let formattedMessage = "";
        if (message.lineNum) {
          formattedMessage += `Line ${message.lineNum}:${
            message.linePos
          } - ${code.substr(message.offset, message.length)}\n`;
        }
        formattedMessage += message.message;

        switch (message.type) {
          case "error":
            console.error(formattedMessage);
            break;
          case "warning":
            console.warn(formattedMessage);
            break;
          case "info":
            console.log(formattedMessage);
            break;
        }
      }
    });

    return shaderModule;
  }
}

shaderModule = new ShaderSystem();

export { shaderModule }
