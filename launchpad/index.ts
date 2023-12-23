import { IApolloProvider } from "@/live/types/apollo.provider";
import { QueryNames } from "./enum/query.name.enum";
import { getConnection } from "./lib/connection";
import { ICentherLaunchpadConfig } from "./types/config.interface";
import { OptionalType } from "./types/general";
import { QueryFactory } from "./lib/query.factory";

export class CentherLaunchpad {
  private _connection: IApolloProvider = null;
  private _config: OptionalType<ICentherLaunchpadConfig> = null;

  constructor(options?: ICentherLaunchpadConfig) {
    this.initConnection(options?.subgraphUrl as string);
    this._config = options;
  }

  async getPresales(): Promise<any[]> {
    const query = QueryFactory.getQuery(QueryNames.GET_PRESALES);

    const result = await this._connection?.query({
      query,
      fetchPolicy: "no-cache",
    });

    return result?.data.presales;
  }

  async getPresale(token: string): Promise<any> {
    const query = QueryFactory.getQuery(QueryNames.GET_PRESALE);
    const result = await this._connection?.query({
      query,
      variables: {
        token: token,
      },
      fetchPolicy: "no-cache",
    });

    return result?.data.presales[0];
  }

  private initConnection(url: string): void {
    this._connection = getConnection(url);
  }
}
