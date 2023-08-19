export enum CreatePoolStepsEnum {
  preflight = "Preflight",
  stake_approval = "Wallet Approval(staking token)",
  reward_approval = "Wallet Approval(reward token)",
  examinate = "Examinate network",
  banner = "Upload banner",
  logo = "Upload Logo",
  metadata = "Create Metadata",
  contract = "Call Contract",
  affiliate = "Setup Affiliate Setting",
}

export enum ProgressStatus {
  pending,
  inProgress,
  done,
  failed,
}
