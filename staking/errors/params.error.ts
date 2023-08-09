export class CreatePoolParamsError<T> extends Error {
  constructor(field: keyof T, message: string) {
    super(message);
    this.field = field;
  }

  field: keyof T;
}

export class CreatePoolCallStaticError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CreatePoolCallContractError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CreatePoolUploadBannerError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CreatePoolUploadLogoError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CreatePoolUploadMetadataError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InsufficientFundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class WalletApprovalError extends Error {
  constructor(message: string) {
    super(message);
  }
}
