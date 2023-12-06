import "@testing-library/jest-dom";
import { QueryNames } from "@/web3/blockchain/enum/query.names.enum";
import { ApolloProvider } from "@/web3/blockchain/providers/apollo.provider";
import { BlockchainRead } from "@/web3/blockchain";

jest.mock("@/web3/blockchain/providers/apollo.provider");

describe("BlockchainRead", () => {
  it('should call "getReferrers" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getReferrers("test", "1");
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getReferrers" and return empty array', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ data: { genealogies: [] } });
    const result = await BlockchainRead.getReferrers("test", "1");
    expect(result).toEqual([]);
  });

  it('should call "getReferrers" and return data', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ data: { genealogies: [] } });
    const result = await BlockchainRead.getReferrers("test", "1");
    expect(result).toEqual([]);
  });

  // it('should call "getReferrers" with params', async () => {
  //   ApolloProvider.query = jest
  //     .fn()
  //     .mockResolvedValue({ data: { genealogies: [] } });
  //   const spy = jest.spyOn(ApolloProvider, "query");
  //   const result = await BlockchainRead.getReferrers("test", "1");
  //   expect(spy).toBeCalledWith(QueryNames.GENEALOGY_AT_LEVEL, {
  //     referrer: "test",
  //     level: 1,
  //   });
  // });

  it('should call "getReferrers" and return data', async () => {
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        genealogies: [
          {
            user: {
              people: [1, 2],
              publicKey: "test_pub_key",
              generatedBUSD: [5],
              generatedNTR: [5],
            },
          },
        ],
      },
    });
    const result = await BlockchainRead.getReferrers("test", "1");
    expect(result).toEqual([
      {
        id: 1,
        address: "test_pub_key",
        level: "1",
        generatedBUSD: 5,
        generatedNTR: 5,
        people: 3,
      },
    ]);
  });

  it('should call "getGenealogy" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getGenealogy(["test"]);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getGenealogy" and return data', async () => {
    const data = [
      {
        id: 1,
        level: "1",
        percent: "2",
        people: 1,
        generatedBUSD: 1,
        generatedNTR: 1,
        generatedBNB: 1,
        children: [],
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        users: data,
      },
    });
    const result = await BlockchainRead.getGenealogy(["test"]);
    expect(result).toEqual(data);
  });

  it('should call "getGenealogy" with params', async () => {
    const data = [
      {
        id: 1,
        level: "1",
        percent: "2",
        people: 1,
        generatedBUSD: 1,
        generatedNTR: 1,
        generatedBNB: 1,
        children: [],
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        users: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getGenealogy(["test"]);
    expect(spy).toBeCalledWith(QueryNames.GENEALOGY, {
      referrer_in: ["test"],
    });
  });

  it('should call "getGenealogyAt" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getGenealogyAt("test", 2);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getGenealogyAt" and return data', async () => {
    const data = [
      {
        id: 1,
        level: "1",
        percent: "2",
        people: 1,
        generatedBUSD: 1,
        generatedNTR: 1,
        generatedBNB: 1,
        children: [],
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        genealogies: data,
      },
    });
    const result = await BlockchainRead.getGenealogyAt("test", 2);
    expect(result).toEqual(data);
  });

  it('should call "getGenealogyAt" with params', async () => {
    const data = [
      {
        id: 1,
        level: "1",
        percent: "2",
        people: 1,
        generatedBUSD: 1,
        generatedNTR: 1,
        generatedBNB: 1,
        children: [],
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        genealogies: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getGenealogyAt("test", 2);
    expect(spy).toBeCalledWith(QueryNames.GENEALOGY_AT_LEVEL, {
      referrer: "test",
      level: 2,
    });
  });

  it('should call "getReferralRewardInPresale" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getReferralRewardInPresale(10, 0, "test");
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getReferralRewardInPresale" and return data', async () => {
    const data = [
      {
        id: "1",
        createdAt: 1,
        user: "1",
        level: 1,
        round: 1,
        isBusd: true,
        amount: 1,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        presaleGenealogyHistories: data,
      },
    });
    const result = await BlockchainRead.getReferralRewardInPresale(
      10,
      0,
      "test"
    );
    expect(result).toEqual(data);
  });

  it('should call "getReferralRewardInPresale" with params', async () => {
    const data = [
      {
        id: "1",
        createdAt: 1,
        user: "1",
        level: 1,
        round: 1,
        isBusd: true,
        amount: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        presaleGenealogyHistories: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getReferralRewardInPresale(10, 0, "test");
    expect(spy).toBeCalledWith(QueryNames.REFERRAL_REWARD_IN_PRESALE, {
      referrer: "test",
      first: 10,
      skip: 0,
    });
  });

  it('should call "getReferrerClaimInPresale" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getReferrerClaimInPresale("test");
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getReferrerClaimInPresale" and return data', async () => {
    const data = [
      {
        id: "1",
        createdAt: 1,
        user: "1",
        level: 1,
        round: 1,
        isBusd: true,
        amount: 1,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        presaleGenalogyClaimHistories: data,
      },
    });
    const result = await BlockchainRead.getReferrerClaimInPresale("test");
    expect(result).toEqual(data);
  });

  it('should call "getReferrerClaimInPresale" with params', async () => {
    const data = [
      {
        id: "1",
        createdAt: 1,
        user: "1",
        level: 1,
        round: 1,
        isBusd: true,
        amount: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        presaleGenalogyClaimHistories: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getReferrerClaimInPresale("test");
    expect(spy).toBeCalledWith(QueryNames.REFERRER_CLAIM_PRESALE, {
      referrer: "test",
    });
  });

  it('should call "purchaseInBUSD" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.purchaseInBUSD(10, 0);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "purchaseInBUSD" and return data', async () => {
    const data = [
      {
        id: "1",
        createdAt: 1,
        user: "1",
        level: 1,
        round: 1,
        isBusd: true,
        amount: 1,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        presalePurchaseWithBusdHistories: data,
      },
    });
    const result = await BlockchainRead.purchaseInBUSD(10, 0);
    expect(result).toEqual(data);
  });

  it('should call "purchaseInBUSD" with params', async () => {
    const data = [
      {
        id: "1",
        createdAt: 1,
        user: "1",
        level: 1,
        round: 1,
        isBusd: true,
        amount: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        presalePurchaseWithBusdHistories: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.purchaseInBUSD(10, 0);
    expect(spy).toBeCalledWith(QueryNames.PURCHASE_WITH_BUSD, {
      first: 10,
      skip: 0,
    });
  });

  it('should call "purchaseInNTR" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.purchaseInNTR(10, 0);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "purchaseInNTR" and return data', async () => {
    const data = [
      {
        id: "1",
        createdAt: 1,
        user: "1",
        level: 1,
        round: 1,
        isBusd: true,
        amount: 1,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        presalePurchaseWithNtrHistories: data,
      },
    });
    const result = await BlockchainRead.purchaseInNTR(10, 0);
    expect(result).toEqual(data);
  });

  it('should call "purchaseInNTR" with params', async () => {
    const data = [
      {
        id: "1",
        createdAt: 1,
        user: "1",
        level: 1,
        round: 1,
        isBusd: true,
        amount: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        presalePurchaseWithNtrHistories: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.purchaseInNTR(10, 0);
    expect(spy).toBeCalledWith(QueryNames.PURCHASE_WITH_NTR, {
      first: 10,
      skip: 0,
    });
  });

  it('should call "getCentherClaimHistory" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getCentherClaimHistory(10, 0);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getCentherClaimHistory" and return data', async () => {
    const data = [
      {
        id: "1",
        createdAt: 1,
        user: "1",
        level: 1,
        round: 1,
        isBusd: true,
        amount: 1,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        presaleCentherClaimHistories: data,
      },
    });
    const result = await BlockchainRead.getCentherClaimHistory(10, 0);
    expect(result).toEqual(data);
  });

  it('should call "getCentherClaimHistory" with params', async () => {
    const data = [
      {
        id: "1",
        createdAt: 1,
        user: "1",
        level: 1,
        round: 1,
        isBusd: true,
        amount: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        presaleCentherClaimHistories: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getCentherClaimHistory(10, 0);
    expect(spy).toBeCalledWith(QueryNames.CLAIM_CENTHER_HISTORY, {
      first: 10,
      skip: 0,
    });
  });

  it('should call "getRegistrationHistory" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getRegistrationHistory(10, 0);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getRegistrationHistory" and return data', async () => {
    const data = [
      {
        publicKey: "test",
        referrer: "test",
        createdAt: "test",
        paidAmount: 1,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        users: data,
      },
    });
    const result = await BlockchainRead.getRegistrationHistory(10, 0);
    expect(result).toEqual(data);
  });

  it('should call "getRegistrationHistory" with params', async () => {
    const data = [
      {
        publicKey: "test",
        referrer: "test",
        createdAt: "test",
        paidAmount: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        users: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getRegistrationHistory(10, 0);
    expect(spy).toBeCalledWith(QueryNames.REGISTRATION_HISTORY, {
      first: 10,
      skip: 0,
    });
  });
});
