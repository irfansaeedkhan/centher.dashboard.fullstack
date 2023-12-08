export type UploadToIPFSResponse = {
  cid: string;
  ipfs_url: string;
  gateway_url: string;
};

type ValidJSONValue = string | number | boolean | null;

export type ValidJSON =
  | ValidJSONValue[]
  | Record<string, ValidJSONValue>
  | ValidJSON[];
