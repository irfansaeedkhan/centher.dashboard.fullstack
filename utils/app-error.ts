import { AppEnvironment } from "@/models/common";

import { customLog } from "./custom.log";

export class AppError extends Error {
  constructor(
    public originalError: Error,
    message: string,
    public where: string = ""
  ) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AppError.prototype);
  }

  log(environment: AppEnvironment[] = ["development"]) {
    //  Log the error to the console only in development
    customLog(this, environment);
  }
}
