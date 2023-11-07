import { AppEnvironment } from "@/models/common";

export const customLog = (environments: AppEnvironment[], ...data: any[]) => {
  if (
    environments.includes(process.env.NEXT_PUBLIC_APP_ENV as AppEnvironment)
  ) {
    data.forEach((d) => console.dir(d));
  }
};
