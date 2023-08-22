import { customLog } from "@/utils/custom.log";
import { AsyncMethodDecorator } from "./async-method.decorator";

export function CatchError(bubble = true): AsyncMethodDecorator {
  return (
    target: any,
    _propertyKey: string | symbol,
    propertyDescriptor: PropertyDescriptor
  ) => {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args: any[]): Promise<any> {
      try {
        return await originalMethod.apply(this, args);
      } catch (error: any) {
        const targetName =
          typeof target === "function" ? target.name : target.constructor.name;
        error = typeof error === "string" ? new Error(error) : error;
        error.message = error.message;
        customLog(
          ["development", "staging"],
          `${targetName}: ${error.message}`
        );

        if (bubble) {
          throw error;
        }
      }
    };
  };
}
