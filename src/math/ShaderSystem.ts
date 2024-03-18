export class ShaderSystem {
  constructor(private device) {}

  async compileShaderModule(code: string) {
    const { device } = this;

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
