import { TopCreator } from "@/models/top-creator";
import { AppError } from "@/utils/app-error";
import { axiosCFS } from "@/utils/axios";

export const getTopCreators = async ({
  first = 10,
  skip = 0,
}: {
  first?: number;
  skip?: number;
}): Promise<TopCreator[]> => {
  try {
    const { data } = await axiosCFS.get<{ users: TopCreator[] }>(
      "/api/marketplace/collections/top-creators",
      {
        params: {
          first,
          skip,
        },
      }
    );
    return data.users ?? [];
  } catch (error: any) {
    throw new AppError(error, "Can not load Top Creators", "getTopCreators");
  }
};
