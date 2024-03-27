import { defaultPreferredCanvasFormat } from "./System";

export class ShaderSystem {
  constructor() {}

  compileFragment(device: GPUDevice, code: string, config?: { entryPoint: string, targets: GPUColorTargetState[] }) {
    return {
      module: shaderModule.compileShaderModule(device, code),
      entryPoint: config?.entryPoint || "main",
      targets: config?.targets || [
        {
          format: defaultPreferredCanvasFormat,
        },
      ],
    };
  }

  compileVertex(device: GPUDevice, code: string, config?: { entryPoint }) {
    return {
      module: shaderModule.compileShaderModule(device, code),
      entryPoint: config?.entryPoint || "main",
    }
  }

  compileShaderModule(device: GPUDevice, code: string) {
    const shaderModule = device.createShaderModule({
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

const shaderModule = new ShaderSystem();

export { shaderModule }
