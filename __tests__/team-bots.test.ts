/**
 * Team bots auto-responder (2026-10-16): behavioral tests for the pure reply
 * generator. No DB, no network — generateBotReply is deterministic.
 */
import {
  generateBotReply,
  roleFromBio,
  type BotRole,
} from "@/lib/bots/responder";

const ALL_ROLES: BotRole[] = [
  "tech_lead",
  "pm",
  "po",
  "scrum_master",
  "frontend",
  "backend",
  "mobile",
  "designer",
  "qa",
  "tester",
  "devops",
  "teammate",
];

function ask(
  role: BotRole,
  humanMessage: string,
  recentBotBodies: string[] = []
) {
  return generateBotReply({
    role,
    botName: "Test Bot",
    humanName: "Alex Morgan",
    humanMessage,
    recentBotBodies,
  });
}

describe("roleFromBio", () => {
  it.each([
    ["Tech Lead · Full-stack", "tech_lead"],
    ["Project Manager · Agile delivery", "pm"],
    ["Product Owner · Roadmap & backlog", "po"],
    ["Scrum Master · Team flow", "scrum_master"],
    ["Frontend Developer · React/Next.js", "frontend"],
    ["Backend Developer · Node.js/Postgres", "backend"],
    ["Mobile Developer · React Native", "mobile"],
    ["UI/UX Designer · Product design", "designer"],
    ["QA Engineer · Test automation", "qa"],
    ["Tester · Manual QA", "tester"],
    ["DevOps Engineer · CI/CD & cloud", "devops"],
    ["Something completely different", "teammate"],
    ["", "teammate"],
  ])("maps %p -> %p", (bio, expected) => {
    expect(roleFromBio(bio)).toBe(expected);
  });
});

describe("generateBotReply triggers", () => {
  it("every role answers a greeting with non-empty text", () => {
    for (const role of ALL_ROLES) {
      const reply = ask(role, "hey!");
      expect(reply.length).toBeGreaterThan(0);
    }
  });

  it("every role answers a status request with non-empty text", () => {
    for (const role of ALL_ROLES) {
      const reply = ask(role, "what's the status on your side?");
      expect(reply.length).toBeGreaterThan(0);
    }
  });

  it("every role answers a bug report with non-empty, role-plausible text", () => {
    const expectations: [BotRole, RegExp][] = [
      ["qa", /repro|regression/i],
      ["tester", /repro/i],
      ["devops", /dashboard|metric|infra/i],
      ["designer", /screenshot|spec/i],
      ["pm", /triag|priorit/i],
    ];
    for (const [role, pattern] of expectations) {
      expect(ask(role, "found a bug, the page crashes")).toMatch(pattern);
    }
    for (const role of ALL_ROLES) {
      expect(ask(role, "there is an error on checkout").length).toBeGreaterThan(
        0
      );
    }
  });

  it("work requests get an acknowledgment, not a question", () => {
    for (const role of ALL_ROLES) {
      const reply = ask(role, "can you fix the login redirect?");
      expect(reply).toMatch(/on it|got it|noted|love it|already|handling/i);
    }
  });

  it("thanks and bye are handled gracefully", () => {
    expect(ask("frontend", "thanks a lot!")).toMatch(
      /anytime|of course|you got it/i
    );
    expect(ask("backend", "bye, see you tomorrow")).toMatch(
      /later|see you|catch/i
    );
  });

  it("deploy questions get ship-ready answers", () => {
    expect(ask("devops", "when are we deploying?")).toMatch(
      /deploy|ship|pipeline/i
    );
    expect(ask("qa", "is it safe to deploy?")).toMatch(/regression|test/i);
  });

  it("meeting requests get a scheduling answer", () => {
    expect(ask("scrum_master", "let's have a quick call")).toMatch(
      /standup|slot|invite|sync/i
    );
  });

  it("deadline questions get timeline answers", () => {
    expect(ask("pm", "what's the ETA on this?")).toMatch(
      /sprint|board|estimate|timeline/i
    );
  });

  it("review requests get review answers", () => {
    expect(ask("tech_lead", "can you review my PR?")).toMatch(
      /review|link|diff/i
    );
  });

  it("design questions reach the designer persona", () => {
    expect(ask("designer", "what do you think of the new design?")).toMatch(
      /figma|mock|design/i
    );
  });

  it("test questions reach the qa persona", () => {
    expect(ask("qa", "can you test the new flow?")).toMatch(
      /test|regression|suite/i
    );
  });

  it("fallback never returns empty and never leaks internals", () => {
    const weird = [
      "",
      "   ",
      "asdf qwer zxcv",
      "🚀🚀🚀",
      "supercalifragilistic",
    ];
    for (const role of ALL_ROLES) {
      for (const m of weird) {
        const reply = ask(role, m);
        expect(reply.length).toBeGreaterThan(0);
        expect(reply).not.toMatch(/undefined|null|NaN|\[object/);
      }
    }
  });

  it("greeting inside a longer word does not misfire", () => {
    // "this thing" contains "hi" — must not be treated as a greeting-only ping
    // that swallows the real intent; status should win.
    const reply = ask("backend", "hey, is this thing deployed?");
    expect(reply).toMatch(/deploy|ship|staging|merged/i);
  });
});

describe("deterministic variety", () => {
  it("never repeats the most recent bot body back-to-back", () => {
    const first = ask("frontend", "hey", []);
    const second = ask("frontend", "hey", [first]);
    expect(second).not.toBe(first);
    expect(second.length).toBeGreaterThan(0);
  });

  it("same input always yields the same output (deterministic)", () => {
    expect(ask("qa", "status?")).toBe(ask("qa", "status?"));
  });

  it("different messages can yield different variants", () => {
    const variants = new Set(
      ["hey", "hello!", "hi there", "yo", "good morning"].map((m) =>
        ask("frontend", m)
      )
    );
    expect(variants.size).toBeGreaterThan(1);
  });
});
