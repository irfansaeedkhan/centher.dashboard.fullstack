import { Environment } from "@/models/common";

export const customLog = (message: string, environments: Environment[]) => {
  if (environments.includes(process.env.NEXT_PUBLIC_APP_ENV as Environment)) {
    console.log(message);
  }
};
