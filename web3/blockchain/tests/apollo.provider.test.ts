import "@testing-library/jest-dom";
import { QueryNames } from "../enum/query.names.enum";
import { ApolloProvider } from "../providers/apollo.provider";

jest.mock("@apollo/client");

describe("apollo provider", () => {
  it("should call init", async () => {
    try {
      await ApolloProvider.query("" as any);
    } catch (error: any) {
      expect(error.message).toEqual("Query not found for ");
    }
  });
});
