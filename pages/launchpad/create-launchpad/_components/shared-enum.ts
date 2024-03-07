export enum CreateLaunchpadStepsEnum {
  preflight = "Preflight",
  launchpad_allowance = "Check Allowance for launchpad contract",
  launchpad_approval = "Wallet Approval(presale token)",
  examinate = "Examinate network",
  metadata = "Create Metadata",
  contract = "Call Contract",
  affiliate = "Setup Affiliate Setting",
  network_confirmation = "Waiting for network confirmation",
}

export enum LaunchpadListEnum {
  referrer_claim = "Claiming referrer rewards",
  claim_amounts = "Claiming Amounts",
  buy_tokens = "Buying Presale Token",
}

export enum ProgressStatus {
  pending,
  inProgress,
  done,
  failed,
}
