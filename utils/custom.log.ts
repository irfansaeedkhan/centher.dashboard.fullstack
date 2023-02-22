import { AppEnvironment } from "@/models/common";

export const customLog = (
  data: string | Error,
  environments: AppEnvironment[]
) => {
  if (
    environments.includes(process.env.NEXT_PUBLIC_APP_ENV as AppEnvironment)
  ) {
    if (data instanceof Error) {
      console.dir(data);
    } else {
      console.log(data);
    }
  }
};
