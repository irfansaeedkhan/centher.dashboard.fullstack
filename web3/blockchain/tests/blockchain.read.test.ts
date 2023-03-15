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

  it('should call "getReferrers" with params', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ data: { genealogies: [] } });
    const spy = jest.spyOn(ApolloProvider, "query");
    const result = await BlockchainRead.getReferrers("test", "1");
    expect(spy).toBeCalledWith(QueryNames.GENEALOGY_AT_LEVEL, {
      referrer: "test",
      level: 1,
    });
  });

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

  it('should call "getAllCollections" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getAllCollections(0, 10);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getAllCollections" and return data', async () => {
    const mockData = {
      id: "1",
      collection: "test",
      name: "test",
      symbol: "test",
      maxSupply: 1,
      totalSupply: 2,
      creator: "test",
      ipfs: "test",
      txTime: 1,
    };

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: [mockData],
      },
    });

    const result = await BlockchainRead.getAllCollections(10, 0);
    expect(result).toEqual([mockData]);
  });

  it('should call "getAllCollections" with params', async () => {
    const mockData = {
      id: "1",
      collection: "test",
      name: "test",
      symbol: "test",
      maxSupply: 1,
      totalSupply: 2,
      creator: "test",
      ipfs: "test",
      txTime: 1,
    };

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: [mockData],
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getAllCollections(10, 0);
    expect(spy).toBeCalledWith(QueryNames.ALL_COLLECTIONS, {
      first: 10,
      skip: 0,
    });
  });

  it('should call "getAccountCreatedNfts" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getAccountCreatedNfts("test", 10, 0);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getAccountCreatedNfts" and return data', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });
    const result = await BlockchainRead.getAccountCreatedNfts("test", 10, 0);
    expect(result).toEqual(data);
  });

  it('should call "getAccountCreatedNfts" with params', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });
    const spy = jest.spyOn(ApolloProvider, "query");
    await BlockchainRead.getAccountCreatedNfts("test", 10, 0);
    expect(spy).toBeCalledWith(QueryNames.ACCOUNT_CREATED_NFTS, {
      first: 10,
      skip: 0,
      creator: "test",
    });
  });

  it('should call "getHotNFT" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getHotNFT(10, 0);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getHotNFT" and return data', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });
    const result = await BlockchainRead.getHotNFT(10, 0);
    expect(result).toEqual(data);
  });

  it('should call "getHotNFT" with params', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getHotNFT(10, 0);
    expect(spy).toBeCalledWith(QueryNames.HOT_NFTS, { first: 10, skip: 0 });
  });

  it('should call "getCollectionsByCategory" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getCollectionsByCategory(10, 0, "test");
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getCollectionsByCategory" and return data', async () => {
    const data = [
      {
        id: "1",
        collection: "test",
        name: "test",
        symbol: "test",
        maxSupply: 1,
        totalSupply: 2,
        creator: "test",
        ipfs: "test",
        txTime: 1,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: data,
      },
    });
    const result = await BlockchainRead.getCollectionsByCategory(10, 0, "test");
    expect(result).toEqual(data);
  });

  it('should call "getCollectionsByCategory" with params', async () => {
    const data = [
      {
        id: "1",
        collection: "test",
        name: "test",
        symbol: "test",
        maxSupply: 1,
        totalSupply: 2,
        creator: "test",
        ipfs: "test",
        txTime: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getCollectionsByCategory(10, 0, "test");
    expect(spy).toBeCalledWith(QueryNames.COLLECTIONS_BY_CATEGORIES, {
      first: 10,
      skip: 0,
      category: "test",
    });
  });

  it('should call "getAllNfts" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getAllNfts(10, 0);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getAllNfts" and return data', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });
    const result = await BlockchainRead.getAllNfts(10, 0);
    expect(result).toEqual(data);
  });

  it('should call "getAllNfts" with params', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getAllNfts(10, 0);
    expect(spy).toBeCalledWith(QueryNames.ALL_NFTS, {
      first: 10,
      skip: 0,
    });
  });

  it('should call "getNftsByCategory" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getNftsByCategory(10, 0, "test");
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getNftsByCategory" and return data', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });
    const result = await BlockchainRead.getNftsByCategory(10, 0, "test");
    expect(result).toEqual(data);
  });

  it('should call "getNftsByCategory" with params', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getNftsByCategory(10, 0, "test");
    expect(spy).toBeCalledWith(QueryNames.NFTS_BY_CATEGORY, {
      first: 10,
      skip: 0,
      category: "test",
    });
  });

  it('should call "getNft" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getNft("test", 1);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getNft" and return data', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });
    const result = await BlockchainRead.getNft("test", 1);
    expect(result).toEqual(data[0]);
  });

  it('should call "getNft" with params', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getNft("test", 1);
    expect(spy).toBeCalledWith(QueryNames.NFT, {
      collection: "test",
      tokenId: 1,
    });
  });

  it('should call "getSaleHistory" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getSaleHistory("test", 1);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getSaleHistory" and return data', async () => {
    const data = [
      {
        type: "ListForSale",
        txTime: 1111,
        seller: "test",
        buyer: "test",
        price: 123456,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        marketplaceSaleHistories: data,
      },
    });
    const result = await BlockchainRead.getSaleHistory("test", 1);
    expect(result).toEqual(data);
  });

  it('should call "getSaleHistory" with params', async () => {
    const data = [
      {
        type: "ListForSale",
        txTime: 1111,
        seller: "test",
        buyer: "test",
        price: 123456,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getSaleHistory("test", 1);
    expect(spy).toBeCalledWith(QueryNames.SALE_HISTORY, {
      collection: "test",
      tokenId: 1,
    });
  });

  it('should call "getCollection" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getCollection("test");
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getCollection" and return data', async () => {
    const data = [
      {
        id: "1",
        collection: "test",
        name: "test",
        symbol: "test",
        maxSupply: 1,
        totalSupply: 2,
        creator: "test",
        ipfs: "test",
        txTime: 1,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: data,
      },
    });
    const result = await BlockchainRead.getCollection("test");
    expect(result).toEqual(data[0]);
  });

  it('should call "getCollection" with params', async () => {
    const data = [
      {
        id: "1",
        collection: "test",
        name: "test",
        symbol: "test",
        maxSupply: 1,
        totalSupply: 2,
        creator: "test",
        ipfs: "test",
        txTime: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getCollection("test");
    expect(spy).toBeCalledWith(QueryNames.COLLECTION, {
      collection: "test",
    });
  });

  it('should call "getCollectionNfts" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getCollectionNfts("test", "asc", 10, 0);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getCollectionNfts" and return data', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });
    const result = await BlockchainRead.getCollectionNfts("test", "asc", 10, 0);
    expect(result).toEqual(data);
  });

  it('should call "getCollectionNfts" with params', async () => {
    const data = [
      {
        id: "1",
        collection: "test",
        name: "test",
        symbol: "test",
        maxSupply: 1,
        totalSupply: 2,
        creator: "test",
        ipfs: "test",
        txTime: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getCollectionNfts("test", "asc", 10, 0);
    expect(spy).toBeCalledWith(QueryNames.COLLECTION_NFTS, {
      collection: "test",
      orderDirection: "asc",
      first: 10,
      skip: 0,
    });
  });

  it('should call "getNftsBySaleState" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getNftsBySaleState("test", "asc", "test", 10, 0);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getNftsBySaleState" and return data', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });
    const result = await BlockchainRead.getNftsBySaleState(
      "test",
      "asc",
      "test",
      10,
      0
    );
    expect(result).toEqual(data);
  });

  it('should call "getNftsBySaleState" with params', async () => {
    const data = [
      {
        id: "1",
        collection: "test",
        name: "test",
        symbol: "test",
        maxSupply: 1,
        totalSupply: 2,
        creator: "test",
        ipfs: "test",
        txTime: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getNftsBySaleState("test", "asc", "test", 10, 0);
    expect(spy).toBeCalledWith(QueryNames.NFT_BY_SALE_STATE, {
      collection: "test",
      orderDirection: "asc",
      saleState: "test",
      first: 10,
      skip: 0,
    });
  });

  it('should call "getAccountCollections" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getAccountCollections("test");
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getAccountCollections" and return data', async () => {
    const data = [
      {
        id: "1",
        collection: "test",
        name: "test",
        symbol: "test",
        maxSupply: 1,
        totalSupply: 2,
        creator: "test",
        ipfs: "test",
        txTime: 1,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: data,
      },
    });
    const result = await BlockchainRead.getAccountCollections("test");
    expect(result).toEqual(data);
  });

  it('should call "getAccountCollections" with params', async () => {
    const data = [
      {
        id: "1",
        collection: "test",
        name: "test",
        symbol: "test",
        maxSupply: 1,
        totalSupply: 2,
        creator: "test",
        ipfs: "test",
        txTime: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getAccountCollections("test");
    expect(spy).toBeCalledWith(QueryNames.COLLECTIONS_BY_ACCOUNT, {
      creator: "test",
    });
  });

  it('should call "getAccountListedNfts" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getAccountListedNfts(10, 0, "test");
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getAccountListedNfts" and return data', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });
    const result = await BlockchainRead.getAccountListedNfts(10, 0, "test");
    expect(result).toEqual(data);
  });

  it('should call "getAccountListedNfts" with params', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getAccountListedNfts(10, 0, "test");
    expect(spy).toBeCalledWith(QueryNames.LISTED_NFT_BY_ACCOUNT, {
      owner: "test",
      skip: 0,
      first: 10,
    });
  });

  it('should call "getUserListedNfts" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getUserListedNfts(10, 0, "test");
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getUserListedNfts" and return data', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });
    const result = await BlockchainRead.getUserListedNfts(10, 0, "test");
    expect(result).toEqual(data);
  });

  it('should call "getUserListedNfts" with params', async () => {
    const data = [
      {
        id: 1,
        collection: "test",
        tokenId: 5,
        creator: "test",
        createTime: 11,
        ipfs: "test",
        saleState: "sale",
        price: 10.0,
        owner: "test",
        endTime: 12345678,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        nfts: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getUserListedNfts(10, 0, "test");
    expect(spy).toBeCalledWith(QueryNames.LISTED_USER_NFT_BY_ACCOUNT, {
      owner: "test",
      skip: 0,
      first: 10,
    });
  });

  it('should call "getRegisteredCollections" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getRegisteredCollections();
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getRegisteredCollections" and return data', async () => {
    const data = [
      {
        id: "1",
        collection: "test",
        name: "test",
        symbol: "test",
        maxSupply: 1,
        totalSupply: 2,
        creator: "test",
        ipfs: "test",
        txTime: 1,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: data,
      },
    });
    const result = await BlockchainRead.getRegisteredCollections();
    expect(result).toEqual(data);
  });

  it('should call "getRegisteredCollections" with params', async () => {
    const data = [
      {
        id: "1",
        collection: "test",
        name: "test",
        symbol: "test",
        maxSupply: 1,
        totalSupply: 2,
        creator: "test",
        ipfs: "test",
        txTime: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getRegisteredCollections();
    expect(spy).toBeCalledWith(QueryNames.REGISTERED_COLLECTION);
  });

  it('should call "getCollectionByAccount" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getCollectionByAccount("test");
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getCollectionByAccount" and return data', async () => {
    const data = [
      {
        id: "1",
        collection: "test",
        name: "test",
        symbol: "test",
        maxSupply: 1,
        totalSupply: 2,
        creator: "test",
        ipfs: "test",
        txTime: 1,
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: data,
      },
    });
    const result = await BlockchainRead.getCollectionByAccount("test");
    expect(result).toEqual(data);
  });

  it('should call "getCollectionByAccount" with params', async () => {
    const data = [
      {
        id: "1",
        collection: "test",
        name: "test",
        symbol: "test",
        maxSupply: 1,
        totalSupply: 2,
        creator: "test",
        ipfs: "test",
        txTime: 1,
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        collections: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getCollectionByAccount("test");
    expect(spy).toBeCalledWith(QueryNames.COLLECTIONS_BY_ACCOUNT, {
      creator: "test",
    });
  });

  it('should call "getTopCreator" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getTopCreator(10, 0);
    } catch (err) {
      expect(err).toBe("error checking worked");
    }
  });

  it('should call "getTopCreator" and return data', async () => {
    const data = [
      {
        createCollectionCount: 10,
        createNFTCount: 5,
        publicKey: "test",
        __typename: "User",
      },
    ];
    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        users: data,
      },
    });
    const result = await BlockchainRead.getTopCreator(10, 0);
    expect(result).toEqual(data);
  });

  it('should call "getTopCreator" with params', async () => {
    const data = [
      {
        createCollectionCount: 10,
        createNFTCount: 5,
        publicKey: "test",
        __typename: "User",
      },
    ];

    ApolloProvider.query = jest.fn().mockResolvedValue({
      data: {
        users: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getTopCreator(10, 0);
    expect(spy).toBeCalledWith(QueryNames.TOP_CREATOR_QUERY, {
      first: 10,
      skip: 0,
    });
  });

  it('should call "getGenealogy" and throw error', async () => {
    ApolloProvider.query = jest
      .fn()
      .mockResolvedValue({ error: "error checking worked" });
    try {
      await BlockchainRead.getGenealogy("test");
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
        genealogies: data,
      },
    });
    const result = await BlockchainRead.getGenealogy("test");
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
        genealogies: data,
      },
    });

    const spy = jest.spyOn(ApolloProvider, "query");

    await BlockchainRead.getGenealogy("test");
    expect(spy).toBeCalledWith(QueryNames.GENEALOGY, {
      referrer: "test",
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
