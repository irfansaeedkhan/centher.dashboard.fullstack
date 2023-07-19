import Moralis from "moralis";
import { v1 as uuidv1 } from "uuid";
import { IUploader } from "../interfaces/file.uploader.interface";
import { safeNameType } from "../interfaces/safe.file.wrapper.interface";
import { IUploadParam } from "../interfaces/upload.param.interface";

import { create, IPFSHTTPClient } from "ipfs-http-client";

//Based on https://docs.moralis.io/web3-data-api/evm/how-t;o-upload-a-folder-to-ipfs
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
      try {
        const options = {
          wrapWithDirectory: true,
          progress: (prog: any) => console.log(`received: ${prog}`),
        };

        const added = await this.ipfs.add(input, options);
        return added.cid.toString() + "/" + input.path;
      } catch (err) {
        console.log(err);
        throw err;
      }
    } catch (err) {
      typeof err == "string" ? (err = new Error(err)) : err;
      throw err;
    }
  }

  generateName() {
    return uuidv1();
  }

  private async initInstance(): Promise<uploaderFunc> {
    if (!process.env.NEXT_PUBLIC_MORALIS_URL?.length) {
      throw new Error("Moralis apikey not found in environment variables.");
    }

    try {
      await Moralis.start({
        apiKey: process.env.NEXT_PUBLIC_MORALIS_URL,
      });
    } catch (err) {}

    return Moralis.EvmApi.ipfs.uploadFolder;
  }

  private toSnakeCase(str: string): string {
    return str.replace(" ", "_");
  }

  private extractUploadedFilePath(result: uploadResult): string {
    if (!result.path.length) {
      throw new Error("Moralis returned an invalid path.");
    }
    return this.getSplittedString(result.path, this._moralisResponsePathKey);
  }

  private getSplittedString(
    str: String,
    key: string,
    index: number = 2
  ): string {
    if (str.indexOf(key) == -1) {
      throw new Error(`string ${str} is not contains key ${key}.`);
    }
    const result = str.split(key);
    if (!result[index]) {
      throw new Error("invalid index to get path");
    }
    return result[index];
  }
}
