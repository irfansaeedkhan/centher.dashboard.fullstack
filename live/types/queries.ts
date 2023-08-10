import { QueryNames } from "../enums/query.names";

export type Queries = Record<keyof typeof QueryNames, string>;
