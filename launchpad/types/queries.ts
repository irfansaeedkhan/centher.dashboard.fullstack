import { QueryNames } from "../enum/query.name.enum";

export type Queries = Record<keyof typeof QueryNames, string>;
