import { IApolloProvider } from "@/live/types/apollo.provider";
import { QueryNames } from "./enum/query.name.enum";
import { getConnection } from "./lib/connection";
import { IProductLaunchpadConfig } from "./types/config.interface";
import { OptionalType } from "./types/general";
import { QueryFactory } from "./lib/query.factory";

export class ProductLaunchpad {
  private _connection: IApolloProvider = null;
  private _config: OptionalType<IProductLaunchpadConfig> = null;

  constructor(options?: IProductLaunchpadConfig) {
    this.initConnection(options?.subgraphUrl as string);
    this._config = options;
  }

  async getPresales(): Promise<any[]> {
    const query = QueryFactory.getQuery(QueryNames.GET_PRESALES);

    const result = await this._connection?.query({
      query,
      fetchPolicy: "no-cache",
    });
    if (result?.data.presales) {
      const finalResult = result?.data.presales.map((presale: any) => {
        return {
          ...presale,
          tokenPurchaseWithBNB: {
            ...presale.tokenPurchaseWithBNB,
            amount: presale.tokenPurchaseWithBNB.bnbAmount,
          },
          tokenPurchaseWithBUSD: {
            ...presale.tokenPurchaseWithBUSD,
            amount: presale.tokenPurchaseWithBUSD.busdAmount,
          },
        };
      });
      return finalResult;
    }
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
    if (result?.data.presales) {
      const finalResult = result?.data.presales.map((presale: any) => {
        const finalResult0 = {
          ...presale,
        };

        finalResult0.tokenPurchaseWithBNB =
          finalResult0.tokenPurchaseWithBNB.map((bnb: any) => {
            return {
              ...bnb,
              amount: bnb.bnbAmount,
            };
          });

        finalResult0.tokenPurchaseWithBUSD =
          finalResult0.tokenPurchaseWithBUSD.map((busd: any) => {
            return {
              ...busd,
              amount: busd.busdAmount,
            };
          });

        return finalResult0;
      });

      return finalResult[0];
    }
    return result?.data.presales[0];
  }

  async getRefRewards(token: string, referrer: string): Promise<any[]> {
    const query = QueryFactory.getQuery(QueryNames.GET_CLAIMABLE_REF_REWARDS);

    const result = await this._connection?.query({
      query,
      variables: {
        token: token,
        referrer: referrer,
      },
      fetchPolicy: "no-cache",
    });

    return result?.data.setRefRewards;
  }

  async getClaimedRefRewards(token: string, referrer: string): Promise<any[]> {
    const query = QueryFactory.getQuery(QueryNames.GET_CLAIMED_REF_REWARDS);

    const result = await this._connection?.query({
      query,
      variables: {
        token: token,
        referrer: referrer,
      },
      fetchPolicy: "no-cache",
    });

    return result?.data.refRewardClaims;
  }

  private initConnection(url: string): void {
    this._connection = getConnection(url);
  }
}
