export enum CreateLaunchpadStepsEnum {
  preflight = "Preflight",
  launchpad_approval = "Wallet Approval(presale token)",
  examinate = "Examinate network",
  metadata = "Create Metadata",
  contract = "Call Contract",
  affiliate = "Setup Affiliate Setting",
  network_confirmation = "Waiting for network confirmation",
}

export enum ProgressStatus {
  pending,
  inProgress,
  done,
  failed,
}
