/**
 * Team bots auto-responder (2026-10-16).
 *
 * Pure, deterministic reply generator for the 20 seeded software-house team
 * members. No network calls, no secrets, no side effects — given the bot's
 * role and the human's message it returns 1-3 sentences in a natural
 * teammate tone.
 *
 * Variety is deterministic: the variant is picked by hashing the incoming
 * message, and any variant matching a recent bot reply in the same
 * conversation is skipped, so the bot never repeats itself back-to-back.
 */

export type BotRole =
  | "tech_lead"
  | "pm"
  | "po"
  | "scrum_master"
  | "frontend"
  | "backend"
  | "mobile"
  | "designer"
  | "qa"
  | "tester"
  | "devops"
  | "teammate";

export interface BotReplyInput {
  role: BotRole;
  /** Bot's display name, e.g. "Alex Novak". */
  botName: string;
  /** Human's display name, e.g. "Centher Demo". */
  humanName: string;
  /** Raw incoming message body. */
  humanMessage: string;
  /** Bodies of the bot's most recent replies in this conversation. */
  recentBotBodies?: string[];
  /**
   * Chat-grill Q23: rotation counter — the caller passes the number of bot
   * replies already in the conversation. Advances variant selection so
   * repeated human messages can't get the identical reply twice in a row.
   */
  rotation?: number;
}

/** Map a seed-team bio ("Frontend Developer · React/Next.js") to a role. */
export function roleFromBio(bio: string): BotRole {
  const b = (bio || "").toLowerCase();
  if (b.includes("tech lead")) return "tech_lead";
  if (b.includes("project manager")) return "pm";
  if (b.includes("product owner")) return "po";
  if (b.includes("scrum master")) return "scrum_master";
  if (b.includes("frontend")) return "frontend";
  if (b.includes("backend")) return "backend";
  if (b.includes("mobile")) return "mobile";
  if (b.includes("designer") || b.includes("ui/ux")) return "designer";
  if (b.includes("qa engineer")) return "qa";
  if (b.includes("tester")) return "tester";
  if (b.includes("devops")) return "devops";
  return "teammate";
}

function firstName(full: string): string {
  const n = (full || "").trim().split(/\s+/)[0];
  return n || "there";
}

/** djb2 — deterministic variant selection without any randomness. */
function hashStr(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick(
  variants: string[],
  seed: string,
  exclude: string[],
  rotation = 0
): string {
  const pool = variants.filter((v) => !exclude.includes(v));
  const usable = pool.length > 0 ? pool : variants;
  // Chat-grill Q23: rotation advances with every bot reply in the
  // conversation, so a repeated human message ("hi", "hi", "hi") can never
  // pick the same variant back-to-back — the old hash-only pick did.
  return usable[(hashStr(seed) + rotation) % usable.length];
}

function fill(template: string, human: string): string {
  return template.replaceAll("{human}", firstName(human));
}

type Trigger = {
  test: (msg: string) => boolean;
  /** Either a shared pool or per-role pools. */
  replies: Record<BotRole, string[]> | string[];
};

const GENERIC_THANKS = [
  "Anytime, {human}! 🙌",
  "Of course — happy to help!",
  "You got it! 👍",
];

const GENERIC_BYE = [
  "Later, {human}! 👋",
  "See you! 👋",
  "Catch you later, {human}!",
];

const GENERIC_DEADLINE: Record<BotRole, string[]> = {
  tech_lead: [
    "Should be wrapped by end of sprint — I'll flag it early if anything slips.",
    "Targeting end of week. I'll keep you posted on progress.",
  ],
  pm: [
    "Current estimate is end of sprint — I'll confirm after standup and update the board.",
    "It's on the timeline for this sprint. I'll ping you the moment that changes.",
  ],
  po: [
    "It's prioritized for this sprint — I'll confirm scope in refinement.",
    "Aiming for end of sprint, assuming the acceptance criteria stay stable.",
  ],
  scrum_master: [
    "The team committed to it this sprint — I'll surface any risk in standup.",
    "On the sprint plan. I'll let you know immediately if it slips.",
  ],
  frontend: [
    "Should have it done in a couple of days — I'll ping you for review.",
    "Aiming for mid-week. I'll update you if anything comes up.",
  ],
  backend: [
    "Couple of days, tops — the groundwork is already in place.",
    "Should be merged by Thursday. I'll keep you posted.",
  ],
  mobile: [
    "Should make the next build cut — I'll confirm after testing on device.",
    "Aiming for the next TestFlight build. Will keep you posted.",
  ],
  designer: [
    "Designs will be ready for handoff tomorrow morning.",
    "I'll have the explorations ready by end of day tomorrow.",
  ],
  qa: [
    "I'll have the test report ready before the release cut.",
    "Give me a day of testing after the build lands and I'll sign off.",
  ],
  tester: [
    "I'll finish the test pass by tomorrow and report back.",
    "Should be done verifying by end of day tomorrow.",
  ],
  devops: [
    "Rolling out in tonight's window — I'll confirm once it's live.",
    "Scheduled for the next deploy. I'll monitor it closely.",
  ],
  teammate: [
    "Let me check and get back to you with a solid date.",
    "I'll confirm the timing and update you shortly.",
  ],
};

const GENERIC_MEETING: Record<BotRole, string[]> = {
  tech_lead: [
    "Sure — send me an invite, I'm generally free after standup.",
    "Works for me. Drop the agenda in the invite so I can prep.",
  ],
  pm: [
    "Let's do it — I'll send a slot that works for everyone.",
    "Sure! I'll set it up and share the agenda beforehand.",
  ],
  po: [
    "Happy to — let's align on the backlog items first. Send me a slot?",
    "Sure, let's sync. I'll bring the latest priorities.",
  ],
  scrum_master: [
    "Absolutely — want me to fold it into standup, or separate?",
    "Sure! I'll find a slot that doesn't clash with the ceremonies.",
  ],
  frontend: [
    "Sure — this afternoon works for me. Send the invite?",
    "Yeah, let's sync. I can walk through the UI progress.",
  ],
  backend: [
    "Sure, I'm free this afternoon — send me an invite.",
    "Works for me. I'll bring the API notes.",
  ],
  mobile: [
    "Sure! I can demo the latest build on the call too.",
    "Yeah — afternoons are best for me. Send the invite?",
  ],
  designer: [
    "Yes please! I'll share my screen and walk through the flows.",
    "Sure — I'll bring the latest Figma prototype.",
  ],
  qa: [
    "Sure — I can walk through the test results on the call.",
    "Let's do it. I'll bring the bug triage list.",
  ],
  tester: [
    "Sure! I can demo the repro steps live.",
    "Yeah — I'll bring my test notes.",
  ],
  devops: [
    "Sure — I can screenshare the dashboards if it's infra-related.",
    "Works for me. Send the invite over.",
  ],
  teammate: ["Sure — send me an invite?", "Sounds good, let's sync!"],
};

const GENERIC_HELP: Record<BotRole, string[]> = {
  tech_lead: [
    "Of course — walk me through what's stuck and we'll figure it out together.",
    "Always. Describe the problem and I'll help you untangle it.",
  ],
  pm: [
    "Of course — what's the blocker? I'll help clear it.",
    "Tell me what's stuck and I'll get the right people looped in.",
  ],
  po: [
    "Sure — is it a requirements thing? Let's clarify it.",
    "Happy to help — walk me through what's unclear.",
  ],
  scrum_master: [
    "That's what I'm here for — what's blocking you, {human}?",
    "Always! Tell me the blocker and I'll help remove it.",
  ],
  frontend: [
    "Sure thing — is it a component thing? Share the code and I'll take a look.",
    "Happy to help! What's the UI doing (or not doing)?",
  ],
  backend: [
    "Sure — paste the error or the endpoint and I'll dig in.",
    "Of course. What are the symptoms?",
  ],
  mobile: [
    "Sure! Which device and OS version? I'll try to reproduce it.",
    "Happy to help — what are you seeing on device?",
  ],
  designer: [
    "Of course! Send the file or a screenshot and we'll sort it out.",
    "Always happy to help — what's the design puzzle?",
  ],
  qa: [
    "Sure — describe the scenario and I'll help you cover it.",
    "Of course! What's the tricky part?",
  ],
  tester: [
    "Sure! Walk me through the steps and I'll try it here.",
    "Happy to help — what are you stuck on?",
  ],
  devops: [
    "Sure — is it pipeline or infra? Point me at the failing run.",
    "Of course. What's broken?",
  ],
  teammate: ["Sure thing — what do you need?", "Of course! What's up?"],
};

const GENERIC_WORK: Record<BotRole, string[]> = {
  tech_lead: [
    "On it — I'll scope it out and get it moving.",
    "Got it. I'll take point on this one.",
  ],
  pm: [
    "Noted — I'll slot it into the plan and keep you posted.",
    "Got it, adding it to the board now.",
  ],
  po: [
    "Got it — I'll write up the acceptance criteria.",
    "Got it — I'll prioritize it in the backlog.",
  ],
  scrum_master: [
    "On it — I'll make sure it gets picked up in planning.",
    "On the radar — I'll track it through the sprint.",
  ],
  frontend: ["On it — I'll get that built.", "Got it, working on it now."],
  backend: ["On it — spinning it up now.", "Got it. I'll wire that up."],
  mobile: [
    "On it — I'll get it into the next build.",
    "Got it, adding it to the build.",
  ],
  designer: [
    "Love it — I'll mock it up and share soon.",
    "On it — designs incoming. 🎨",
  ],
  qa: [
    "On it — I'll cover it with test cases.",
    "On it — adding it to the test plan.",
  ],
  tester: [
    "On it — I'll verify it once it's ready.",
    "Got it — I'll test that flow.",
  ],
  devops: [
    "On it — I'll get it sorted on the infra side.",
    "Got it, handling it.",
  ],
  teammate: ["On it!", "Got it — I'll take care of it."],
};

const GENERIC_SMALLTALK = [
  "Pretty chill — probably catching up on some reading. You?",
  "Nothing crazy — might check out that new place downtown. Wbu?",
  "Just recharging 😄 Got anything fun lined up, {human}?",
];

const GENERIC_GREETING: Record<BotRole, string[]> = {
  tech_lead: [
    "Hey {human}! What's on your mind?",
    "Hey {human} — how can I help?",
  ],
  pm: ["Hi {human}! What's up?", "Hey {human}! What do you need?"],
  po: [
    "Hey {human}! Got something for the backlog?",
    "Hi {human}! What's on your mind?",
  ],
  scrum_master: [
    "Hey {human}! How's your day going?",
    "Hi {human}! Anything blocking you?",
  ],
  frontend: ["Hey {human}! 👋", "Hii {human}! What's up?"],
  backend: ["Hey {human}.", "Hi {human}, what's up?"],
  mobile: ["Hey {human}! 📱", "Hi {human}! What's going on?"],
  designer: ["Hey {human}! ✨", "Hii {human}! What's up?"],
  qa: ["Hey {human}! 🧪", "Hi {human}! What's up?"],
  tester: ["Hey {human}!", "Hi {human}! What's up?"],
  devops: ["Hey {human}! ⚙️", "Hi {human}! What's up?"],
  teammate: ["Hey {human}!", "Hi! What's up?"],
};

const GENERIC_STATUS: Record<BotRole, string[]> = {
  tech_lead: [
    "Good progress — the auth refactor is nearly done and the API contracts are holding up. Anything you need from my side?",
    "On track. Finished the architecture review, now unblocking the backend work. How's your side?",
  ],
  pm: [
    "On track — sprint burndown looks healthy, two tickets left. Want a quick rundown?",
    "Going well! Stakeholders are happy with the velocity. Anything you want reprioritized?",
  ],
  po: [
    "Backlog's groomed and next sprint is shaping up nicely. Anything you want prioritized?",
    "Good — the top items are all refined with acceptance criteria. Want a walkthrough?",
  ],
  scrum_master: [
    "Flow looks good — no blockers flagged today. How's your side looking?",
    "Team's in a good rhythm. Retro actions are all closed out. Anything on your mind?",
  ],
  frontend: [
    "Wrapping up the dashboard components — just polishing responsive states. Ready for review soon!",
    "Good! Finished the new forms, now wiring up the empty states. Should be demoable tomorrow.",
  ],
  backend: [
    "New endpoints are on staging and passing tests. Working on query optimization next.",
    "Solid — the migration ran clean and latency is down. What's next on your list?",
  ],
  mobile: [
    "Latest build is on TestFlight — fixing a couple of layout quirks on smaller screens.",
    "Going well! The offline sync is working smoothly now. Testing the push flows next.",
  ],
  designer: [
    "Finalizing the new flows in Figma — prototype link coming by end of day.",
    "Good! Wrapped the homepage explorations, now on the settings screens.",
  ],
  qa: [
    "Regression suite is green — 340 cases passing. Now covering the new feature.",
    "All good — automation caught two regressions this morning, both already fixed.",
  ],
  tester: [
    "Working through the test cases for the latest build — found one flaky scenario I'm re-checking.",
    "Good — most cases pass, documenting the edge cases as I go.",
  ],
  devops: [
    "Pipeline's healthy — deploys are green and costs are flat. Rolling out the caching update tonight.",
    "All quiet on the infra front. Uptime's at 99.99% this month. 🎯",
  ],
  teammate: [
    "Going well — making steady progress. How about you?",
    "Pretty good! Keeping busy. What's new on your end?",
  ],
};

const GENERIC_BUG: Record<BotRole, string[]> = {
  tech_lead: [
    "Send me the repro steps and I'll dig in — sounds like it could be a race in the session handling.",
    "On it. Drop the error details and I'll trace it through the stack.",
  ],
  pm: [
    "Noted — I'll get it triaged and prioritized. How bad is the impact?",
    "Thanks for flagging! I'll make sure it gets the right priority. Is anyone blocked?",
  ],
  po: [
    "Thanks for flagging — I'll check how it affects the acceptance criteria.",
    "Noted. I'll verify the expected behavior and update the ticket.",
  ],
  scrum_master: [
    "I'll make sure it gets visibility in standup. Is it blocking anyone?",
    "Thanks for raising it — I'll track it as an impediment.",
  ],
  frontend: [
    "Ugh, let me look — probably a state update racing the render. What did you click?",
    "On it! Can you share the steps? I'll reproduce it locally.",
  ],
  backend: [
    "Checking the logs now — smells like a query timing out. Which endpoint were you hitting?",
    "Looking into it. Send me the request details and I'll trace it.",
  ],
  mobile: [
    "Can you tell me the device and OS version? I'll try to reproduce it here.",
    "On it — I'll run it on device and see if I can catch it.",
  ],
  designer: [
    "Is it visual or interaction? Send a screenshot and I'll check the specs.",
    "Hmm — send me a screenshot and I'll compare against the design.",
  ],
  qa: [
    "Logging it now — I'll write up repro steps and add a regression test.",
    "On it! I'll reproduce, document, and get it into the suite.",
  ],
  tester: [
    "On it — I'll reproduce it and document the exact steps.",
    "I'll dig in and confirm the repro steps, then file it properly.",
  ],
  devops: [
    "Checking the dashboards — might be infra-related. When did it start?",
    "Looking at the metrics now. Was there a deploy around the time it broke?",
  ],
  teammate: [
    "Oh no — let me take a look.",
    "Thanks for flagging! I'll check it out.",
  ],
};

const GENERIC_DEPLOY: Record<BotRole, string[]> = {
  tech_lead: [
    "Changes are reviewed and merged — good to ship whenever we're ready.",
    "All clear from my side. Let's make sure QA signs off first.",
  ],
  pm: [
    "Release is on the calendar — I'll confirm the checklist with everyone.",
    "Lining up the release notes now. I'll announce the window shortly.",
  ],
  po: [
    "Let's confirm the acceptance criteria are met, then ship it.",
    "Ready when the must-haves are verified — I'll do a final check.",
  ],
  scrum_master: [
    "Let's make sure nothing's half-done before we ship.",
    "Ship it — the board is clean and blockers are cleared.",
  ],
  frontend: [
    "My changes are merged and ready whenever you want to ship. 🚀",
    "All merged — the build is green. Ship it!",
  ],
  backend: [
    "Endpoints are merged and migration-tested. Ready to deploy.",
    "Good to ship from the backend — migrations are backward compatible.",
  ],
  mobile: [
    "Build is ready — just waiting on store review after we cut it.",
    "I'll cut the release build once we give the word. 📱",
  ],
  designer: [
    "Designs are finalized and handed off — ship it! 🚀",
    "All specs are in Figma. Ready when you are!",
  ],
  qa: [
    "I'd like one more regression pass before prod — almost done.",
    "Nearly signed off — finishing the last test batch now.",
  ],
  tester: [
    "Almost done verifying — I'll give the go-ahead shortly.",
    "One more pass and I'll sign off on the release.",
  ],
  devops: [
    "Last deploy went out clean — all health checks green. Want me to cut another one?",
    "Pipeline's ready. Say the word and I'll ship it. 🚀",
  ],
  teammate: ["Ready when you are! 🚀", "Let's ship it!"],
};

const GENERIC_REVIEW: Record<BotRole, string[]> = {
  tech_lead: [
    "Drop the link — I'll review it today. Keep the diff small if you can 😉",
    "Send it over — I'll review the architecture and edge cases.",
  ],
  pm: [
    "I'll take a look — mostly checking it matches the requirements.",
    "Sure! I'll review it against the acceptance criteria.",
  ],
  po: [
    "I'll review it — checking the user value and acceptance criteria.",
    "Send the link, I'll verify it against the spec.",
  ],
  scrum_master: [
    "I'll take a peek — process-wise, is it linked to the ticket?",
    "Sure! Make sure the ticket's updated and I'll review.",
  ],
  frontend: [
    "Send it over — I'll take a look this afternoon.",
    "On my review list! I'll check the component structure.",
  ],
  backend: [
    "Drop the link — I'll review the API changes.",
    "I'll review it today, focusing on the data layer.",
  ],
  mobile: [
    "Send it over — I'll check it on device too.",
    "I'll review it and run the build locally.",
  ],
  designer: [
    "I'll check it against the Figma specs. 👀",
    "Send the preview link — I'll do a visual pass.",
  ],
  qa: [
    "I'll pull it down and run the test suite against it.",
    "On it — I'll verify the test coverage on that PR.",
  ],
  tester: [
    "I'll test the changes manually once it's up.",
    "I'll run through the affected flows.",
  ],
  devops: [
    "I'll check the pipeline and infra changes.",
    "Send it over — I'll review the config changes.",
  ],
  teammate: ["Happy to review — share the link?", "Send it over!"],
};

const GENERIC_DESIGN: Record<BotRole, string[]> = {
  tech_lead: [
    "Let's make sure the design maps cleanly to the architecture — loop me into the review.",
    "Good — I'll sanity-check the technical feasibility alongside.",
  ],
  pm: [
    "Let's align on requirements first — then design can run with it.",
    "I'll sync with design on the scope. Anything specific you need?",
  ],
  po: [
    "Let's lock the user stories first, then design can explore freely.",
    "I'll clarify the requirements so design has a clear target.",
  ],
  scrum_master: [
    "I'll make sure design has what they need for the sprint.",
    "Let's get design into the refinement session.",
  ],
  frontend: [
    "If you've got the Figma link I'll start breaking it into components.",
    "Share the designs and I'll estimate the build effort.",
  ],
  backend: [
    "I'll check what API support the designs need.",
    "Let me know what data the new screens need and I'll spec the endpoints.",
  ],
  mobile: [
    "I'll check the designs against mobile patterns — some things need adapting.",
    "Share the Figma — I'll flag anything tricky on mobile.",
  ],
  designer: [
    "Ooh, my favorite topic — what are we designing? Send the brief! ✨",
    "Love the brief — I'll start exploring in Figma. 🎨",
  ],
  qa: [
    "I'll review the designs for testability — edge cases love hiding in UI.",
    "Share the flows and I'll start thinking about test scenarios.",
  ],
  tester: [
    "I'll keep the designs handy while testing the flows.",
    "Good — I'll validate the build against the mockups.",
  ],
  devops: [
    "Just tell me if the designs need any new assets or infra.",
    "I'll make sure the asset pipeline handles whatever design throws at it.",
  ],
  teammate: [
    "Loop in the designers on this one — want me to tag them?",
    "Nice! Let's get some mockups going.",
  ],
};

const GENERIC_TEST: Record<BotRole, string[]> = {
  tech_lead: [
    "Good call — let's make sure coverage is meaningful, not just high.",
    "Agreed. I'll review the critical paths for test gaps.",
  ],
  pm: [
    "QA's on it — I'll make sure testing has room in the schedule.",
    "I'll confirm the test plan covers the release criteria.",
  ],
  po: [
    "Let's verify against the acceptance criteria — I'll join the test review.",
    "Good — I'll confirm the must-haves are covered.",
  ],
  scrum_master: [
    "I'll make sure testing isn't squeezed at sprint end.",
    "Let's protect time for it in the sprint plan.",
  ],
  frontend: [
    "Tests are in the PR — flag anything I missed.",
    "I've got component tests covering the new UI. Let me know if you spot gaps.",
  ],
  backend: [
    "Integration tests are covering the new endpoints.",
    "Tested locally and in CI — all green.",
  ],
  mobile: [
    "Tested on both platforms — I'll run the device lab pass too.",
    "Manual pass done, automated suite is green.",
  ],
  designer: [
    "I'll join the UI review to catch visual regressions.",
    "Let me know when it's testable — I'll do a design QA pass.",
  ],
  qa: [
    "Already on it — I'll add cases to the regression suite. 🧪",
    "Covering it now. I'll update the test plan.",
  ],
  tester: [
    "I'll run through it manually and report back.",
    "On my test list — I'll document everything I find.",
  ],
  devops: [
    "CI is running the full suite on every push.",
    "The pipeline gates on test results — nothing ships red.",
  ],
  teammate: ["Good call — let's make sure it's covered.", "Testing it now!"],
};

const GENERIC_FALLBACK: Record<BotRole, string[]> = {
  tech_lead: [
    "Interesting — tell me more and I'll help figure out the right approach.",
    "Hmm, let me think about that. What's the goal here?",
  ],
  pm: [
    "Got it — can you give me a bit more context so I prioritize it right?",
    "Noted! What's the timeline looking like on this?",
  ],
  po: [
    "Tell me more — how does this fit what we're building?",
    "Interesting idea. What problem is it solving?",
  ],
  scrum_master: [
    "Tell me more — is anything blocking you on it?",
    "Got it. Want to bring it up in standup?",
  ],
  frontend: [
    "Hmm, interesting — let me look into it and get back to you.",
    "Tell me more — I want to make sure I build the right thing.",
  ],
  backend: [
    "Let me dig into that and I'll update you.",
    "Interesting — I'll check the implementation details.",
  ],
  mobile: [
    "Let me check on device and get back to you.",
    "Hmm — I'll look into it.",
  ],
  designer: [
    "Ooh, tell me more — I want to get the UX right. ✨",
    "Interesting! Let me sketch some ideas.",
  ],
  qa: [
    "Noted — I'll keep an eye on that in testing.",
    "Tell me more so I can cover it in the test plan.",
  ],
  tester: [
    "Noted — I'll watch for that while testing.",
    "Got me curious — tell me more.",
  ],
  devops: [
    "Let me check the infra side and report back.",
    "Hmm — I'll investigate.",
  ],
  teammate: ["Tell me more!", "Interesting — go on."],
};

/**
 * Triggers, ordered most-specific → most-generic. The first match wins.
 * Word boundaries keep "hi" from firing inside "this", etc.
 */
const TRIGGERS: Trigger[] = [
  {
    test: (m) =>
      /\b(bye|goodbye|good\s?night|see\syou|talk\s(later|tomorrow)|cya)\b/.test(
        m
      ),
    replies: GENERIC_BYE,
  },
  {
    test: (m) => /\b(thanks|thank\syou|thx|tyvm|appreciated)\b/.test(m),
    replies: GENERIC_THANKS,
  },
  {
    test: (m) =>
      /\b(meeting|meet\s?(up|ing)?|call|sync(\s?up)?|zoom|schedule|calendar|appointment)\b/.test(
        m
      ),
    replies: GENERIC_MEETING,
  },
  {
    test: (m) =>
      /\b(deadline|eta|timeline|asap|urgent|when\s(will|can|do)|how\s(long|soon)|by\s(monday|tuesday|wednesday|thursday|friday|tomorrow|eod|friday))\b/.test(
        m
      ),
    replies: GENERIC_DEADLINE,
  },
  {
    test: (m) =>
      // Chat-grill Q22: added broke/breaks — "hey, this broke" used to fall
      // through to GREETING.
      /\b(bug|issue|broke|break(\w*)?|broken|error|crash(\w*)?|fail(\w*)?|not\sworking|doesn'?t\swork|exception|stack\s?trace|500|404)\b/.test(
        m
      ),
    replies: GENERIC_BUG,
  },
  {
    test: (m) =>
      /\b(deploy(\w*)?|release|ship(\w*)?|production|\bprod\b|staging|rollback|go\s?live)\b/.test(
        m
      ),
    replies: GENERIC_DEPLOY,
  },
  {
    test: (m) =>
      /\b(pr\b|pull\srequest|code\sreview|review\s(my|this|the)|merge(\srequest)?)\b/.test(
        m
      ),
    replies: GENERIC_REVIEW,
  },
  {
    test: (m) =>
      /\b(design|figma|mockup|wireframe|prototype|\bux\b|\bui\b|redesign)\b/.test(
        m
      ),
    replies: GENERIC_DESIGN,
  },
  {
    test: (m) =>
      /\b(test(\w*)?|testing|\bqa\b|coverage|regression|automation)\b/.test(m),
    replies: GENERIC_TEST,
  },
  {
    test: (m) =>
      /\b(status|update|standup|progress|how'?s\s(it|things|everything|the\s\w+\sgoing)|what'?s\s(new|the\sstatus)|daily)\b/.test(
        m
      ),
    replies: GENERIC_STATUS,
  },
  {
    // Chat-grill Q22: stronger anchors. The old version fired on any bare
    // imperative ("make money fast" → "On it — I'll get that built.").
    // Now it needs a direct request to the bot (can you / need you to) or a
    // work-specific imperative verb at the start of the message.
    test: (m) => {
      const t = m.trim();
      if (
        /^(please\s+|pls\s+|plz\s+)?(can\syou|could\syou|would\syou)\b/.test(t)
      )
        return true;
      if (/^(please|pls|plz)\s+\w+/.test(t)) return true;
      if (
        /^(fix|build|add|create|implement|refactor|deploy|check|handle|write|update|look\sinto|take\s(care\sof|this))\b/.test(
          t
        )
      )
        return true;
      return /\b(can\syou|could\syou|would\syou|need\syou\sto|want\syou\sto)\b/.test(
        t
      );
    },
    replies: GENERIC_WORK,
  },
  {
    test: (m) =>
      /\b(help|stuck|how\sdo\si|how\sto|how\scan\si|confused|don'?t\s(understand|get\sit))\b/.test(
        m
      ),
    replies: GENERIC_HELP,
  },
  {
    test: (m) =>
      /\b(weekend|vacation|holiday|plans|trip|lunch|coffee|party)\b/.test(m),
    replies: GENERIC_SMALLTALK,
  },
  {
    test: (m) =>
      /^(hi|hii+|hello|hey|yo|yo+|good\s(morning|afternoon|evening)|salam|salaam|assalam)/.test(
        m.trim()
      ) || /\b(hi|hello|hey)\b/.test(m),
    replies: GENERIC_GREETING,
  },
];

export function generateBotReply(input: BotReplyInput): string {
  const msg = (input.humanMessage || "").toLowerCase();
  const role = input.role || "teammate";
  const exclude = input.recentBotBodies ?? [];
  const rotation = input.rotation ?? 0;

  for (const trigger of TRIGGERS) {
    let matched = false;
    try {
      matched = trigger.test(msg);
    } catch {
      matched = false;
    }
    if (!matched) continue;
    const rawPool = Array.isArray(trigger.replies)
      ? trigger.replies
      : trigger.replies[role] ?? trigger.replies.teammate;
    // Fill placeholders BEFORE the no-repeat check: recentBotBodies holds
    // rendered bodies, so templates must be rendered to compare correctly.
    const pool = rawPool.map((t) => fill(t, input.humanName));
    return pick(pool, msg, exclude, rotation);
  }

  // Fallback: role-flavored acknowledgment + follow-up question.
  const fallbackPool = (
    GENERIC_FALLBACK[role] ?? GENERIC_FALLBACK.teammate
  ).map((t) => fill(t, input.humanName));
  return pick(fallbackPool, msg || "fallback", exclude, rotation);
}
