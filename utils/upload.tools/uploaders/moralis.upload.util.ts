import Moralis from "moralis";
import { v1 as uuidv1 } from "uuid";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { customLog } from "@/utils/custom.log";
import { IUploader } from "../interfaces/file.uploader.interface";
import { IUploadParam } from "../interfaces/upload.param.interface";

type uploadResult = { path: string };
type uploaderFunc = (params: any) => Promise<{ result: uploadResult[] }>;

export class MoralisUploader implements IUploader<IUploadParam, string> {
  ipfs: IPFSHTTPClient;
  _moraliseBasePath: string;
  _moralisResponsePathKey: string;
  _instance: uploaderFunc | null = null;
  _nameLength: number = 32;

  constructor(
    moraliseBasePath: string = "centher",
    moralisResponsePathKey: string = "ipfs"
  ) {
    this._moraliseBasePath = moraliseBasePath;
    this._moralisResponsePathKey = moralisResponsePathKey;
    const auth = "Basic " + process.env.NEXT_PUBLIC_INFURA_AUTH;
    this.ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
      timeout: 10000000,
    });
  }

  makePath(extention?: string): string {
    const name = this.generateName();
    return `${this._moraliseBasePath}/${this.toSnakeCase(name)}${
      extention?.length ? "." + extention : ""
    }`;
  }

  async upload(input: IUploadParam): Promise<string> {
    try {
      const options = {
        wrapWithDirectory: true,
        progress: (prog: any) => {
          customLog(["development", "staging"], prog);
        },
      };

      const added = await this.ipfs.add(input, options);
      return added.cid.toString() + "/" + input.path;
    } catch (err: any) {
      customLog(["development", "staging"], err);
      typeof err == "string" ? (err = new Error(err)) : err;
      throw err;
    }
  }

  generateName() {
    return uuidv1();
  }

  private toSnakeCase(str: string): string {
    return str.replace(" ", "_");
  }
}
