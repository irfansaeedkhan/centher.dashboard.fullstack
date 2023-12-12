export const LaunchpadData: LaunchpadDataType[] = [
  {
    soft_cap: 30,
    lockup_time: 250,
    liquidity: 60,
    launchpad_title: "Galactic Harmony",
    status: "live",
    end_date: new Date("2023-12-31T23:59:59Z"),
  },
  {
    soft_cap: 20,
    lockup_time: 200,
    liquidity: 45,
    launchpad_title: "Cosmic Unity",
    status: "upcoming",
    start_date: new Date("2024-01-01T00:00:00Z"),
  },
  {
    soft_cap: 35,
    lockup_time: 280,
    liquidity: 75,
    launchpad_title: "Stellar Nexus",
    status: "ended",
  },
  {
    soft_cap: 28,
    lockup_time: 270,
    liquidity: 55,
    launchpad_title: "Interstellar Connection",
    status: "live",
    end_date: new Date("2023-12-31T23:59:59Z"),
  },
  {
    soft_cap: 22,
    lockup_time: 220,
    liquidity: 50,
    launchpad_title: "Celestial Bonds",
    status: "upcoming",
    start_date: new Date("2024-01-01T00:00:00Z"),
  },
  {
    soft_cap: 32,
    lockup_time: 290,
    liquidity: 70,
    launchpad_title: "Planetary Coalition",
    status: "ended",
  },
  {
    soft_cap: 30,
    lockup_time: 250,
    liquidity: 60,
    launchpad_title: "Galactic Harmony",
    status: "live",
    end_date: new Date("2023-12-31T23:59:59Z"),
  },
  {
    soft_cap: 20,
    lockup_time: 200,
    liquidity: 45,
    launchpad_title: "Cosmic Unity",
    status: "upcoming",
    start_date: new Date("2024-01-01T00:00:00Z"),
  },
  {
    soft_cap: 35,
    lockup_time: 280,
    liquidity: 75,
    launchpad_title: "Stellar Nexus",
    status: "ended",
  },
  {
    soft_cap: 28,
    lockup_time: 270,
    liquidity: 55,
    launchpad_title: "Interstellar Connection",
    status: "live",
    end_date: new Date("2023-12-31T23:59:59Z"),
  },
  {
    soft_cap: 22,
    lockup_time: 220,
    liquidity: 50,
    launchpad_title: "Celestial Bonds",
    status: "upcoming",
    start_date: new Date("2024-01-01T00:00:00Z"),
  },
  {
    soft_cap: 32,
    lockup_time: 290,
    liquidity: 70,
    launchpad_title: "Planetary Coalition",
    status: "ended",
  },
  {
    soft_cap: 25,
    lockup_time: 300,
    liquidity: 53,
    launchpad_title: "Solar Alliance",
    status: "live",
    end_date: new Date("2023-12-31T23:59:59Z"),
  },
  {
    soft_cap: 18,
    lockup_time: 180,
    liquidity: 48,
    launchpad_title: "Orbit Odyssey",
    status: "upcoming",
    start_date: new Date("2024-01-01T00:00:00Z"),
  },
  {
    soft_cap: 38,
    lockup_time: 260,
    liquidity: 80,
    launchpad_title: "Astro Ventures",
    status: "ended",
  },
  {
    soft_cap: 26,
    lockup_time: 310,
    liquidity: 58,
    launchpad_title: "Starlight Syndicate",
    status: "live",
    end_date: new Date("2023-12-31T23:59:59Z"),
  },
];

export type LaunchpadDataType = {
  start_date?: Date;
  end_date?: Date;
  status: string;
  launchpad_title: string;
  liquidity: number;
  lockup_time: number;
  soft_cap: number;
};
