/**
 * Seed 20 software-house team members + starter DMs with the demo user.
 *
 * Idempotent: auth users are skipped when the email exists, profiles use
 * onConflictDoNothing, conversations are keyed by title, members and
 * messages are checked before insert. Safe to run repeatedly.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { and, eq } from "drizzle-orm";
import { auth } from "../lib/auth/better-auth";
import { db } from "../db";
import {
  conversationMembers,
  conversations,
  messages,
  profiles,
  user,
} from "../db/schema";

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@centher.io";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "Demo1234!";

const TEAM_MEMBERS = [
  {
    email: "daniel.reyes@centher.io",
    name: "Daniel Reyes",
    username: "daniel_reyes",
    bio: "Tech Lead · Full-stack",
    membership: "verified",
  },
  {
    email: "emily.carter@centher.io",
    name: "Emily Carter",
    username: "emily_carter",
    bio: "Project Manager · Agile delivery",
    membership: "citizen",
  },
  {
    email: "jonas.weber@centher.io",
    name: "Jonas Weber",
    username: "jonas_weber",
    bio: "Product Owner · Roadmap & backlog",
    membership: "citizen",
  },
  {
    email: "sofia.marino@centher.io",
    name: "Sofia Marino",
    username: "sofia_marino",
    bio: "Scrum Master · Team flow",
    membership: "citizen",
  },
  {
    email: "alex.novak@centher.io",
    name: "Alex Novak",
    username: "alex_novak",
    bio: "Frontend Developer · React/Next.js",
    membership: "citizen",
  },
  {
    email: "mia.tanaka@centher.io",
    name: "Mia Tanaka",
    username: "mia_tanaka",
    bio: "Frontend Developer · React/TypeScript",
    membership: "citizen",
  },
  {
    email: "lucas.silva@centher.io",
    name: "Lucas Silva",
    username: "lucas_silva",
    bio: "Frontend Developer · UI engineering",
    membership: "citizen",
  },
  {
    email: "emma.larsen@centher.io",
    name: "Emma Larsen",
    username: "emma_larsen",
    bio: "Frontend Developer · Design systems",
    membership: "citizen",
  },
  {
    email: "james.connor@centher.io",
    name: "James Connor",
    username: "james_connor",
    bio: "Backend Developer · Node.js/Postgres",
    membership: "citizen",
  },
  {
    email: "yuki.sato@centher.io",
    name: "Yuki Sato",
    username: "yuki_sato",
    bio: "Backend Developer · APIs & services",
    membership: "citizen",
  },
  {
    email: "marco.rossi@centher.io",
    name: "Marco Rossi",
    username: "marco_rossi",
    bio: "Backend Developer · Distributed systems",
    membership: "citizen",
  },
  {
    email: "anna.kowalski@centher.io",
    name: "Anna Kowalski",
    username: "anna_kowalski",
    bio: "Backend Developer · Data pipelines",
    membership: "citizen",
  },
  {
    email: "david.kim@centher.io",
    name: "David Kim",
    username: "david_kim",
    bio: "Mobile Developer · React Native",
    membership: "citizen",
  },
  {
    email: "olivia.bennett@centher.io",
    name: "Olivia Bennett",
    username: "olivia_bennett",
    bio: "UI/UX Designer · Product design",
    membership: "citizen",
  },
  {
    email: "hugo.laurent@centher.io",
    name: "Hugo Laurent",
    username: "hugo_laurent",
    bio: "UI/UX Designer · Interaction design",
    membership: "citizen",
  },
  {
    email: "natalia.petrova@centher.io",
    name: "Natalia Petrova",
    username: "natalia_petrova",
    bio: "QA Engineer · Test automation",
    membership: "citizen",
  },
  {
    email: "tom.becker@centher.io",
    name: "Tom Becker",
    username: "tom_becker",
    bio: "QA Engineer · E2E testing",
    membership: "citizen",
  },
  {
    email: "grace.osei@centher.io",
    name: "Grace Osei",
    username: "grace_osei",
    bio: "Tester · Manual QA",
    membership: "citizen",
  },
  {
    email: "ivan.petrov@centher.io",
    name: "Ivan Petrov",
    username: "ivan_petrov",
    bio: "Tester · Exploratory QA",
    membership: "citizen",
  },
  {
    email: "ryan.mitchell@centher.io",
    name: "Ryan Mitchell",
    username: "ryan_mitchell",
    bio: "DevOps Engineer · CI/CD & cloud",
    membership: "verified",
  },
] as const;

async function ensureAuthUser(email: string, name: string, password: string) {
  const existing = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  if (!result?.user?.id) {
    throw new Error(`Failed to create user ${email}`);
  }

  return result.user;
}

const STARTER_DMS: {
  title: string;
  members: string[]; // usernames
  messages: { from: string; body: string }[]; // from = username ("demo" = demo user)
}[] = [
  {
    title: "DM emily_carter",
    members: ["emily_carter"],
    messages: [
      {
        from: "demo",
        body: "Hey Emily! Can you share the sprint board for this week?",
      },
      {
        from: "emily_carter",
        body: "On it — I'll drop the link here in a bit.",
      },
      { from: "demo", body: "Perfect, thanks!" },
    ],
  },
  {
    title: "DM daniel_reyes",
    members: ["daniel_reyes"],
    messages: [
      {
        from: "demo",
        body: "Hey Daniel, quick question on the feed API pagination.",
      },
      {
        from: "daniel_reyes",
        body: "Sure — cursor-based, 20 per page. Ping me the endpoint you're hitting.",
      },
    ],
  },
  {
    title: "DM alex_novak",
    members: ["alex_novak"],
    messages: [
      {
        from: "demo",
        body: "Alex, the chat reply preview looks great in dark mode now.",
      },
      { from: "alex_novak", body: "Thanks! Still polishing the hover states." },
      { from: "demo", body: "Ship it when ready." },
    ],
  },
  {
    title: "DM natalia_petrova",
    members: ["natalia_petrova"],
    messages: [
      {
        from: "demo",
        body: "Natalia, can you run the regression suite on the chat fixes?",
      },
      {
        from: "natalia_petrova",
        body: "Already on it — will report back today.",
      },
    ],
  },
  {
    title: "Team Standup",
    members: ["emily_carter", "daniel_reyes", "alex_novak"],
    messages: [
      {
        from: "emily_carter",
        body: "Morning all — standup in 10. Drop your updates here.",
      },
      {
        from: "daniel_reyes",
        body: "Backend: auth hardening done, moving to rate limits.",
      },
      {
        from: "alex_novak",
        body: "Frontend: chat polish, then the marketplace cards.",
      },
    ],
  },
];

async function ensureConversation(title: string) {
  const existing = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(eq(conversations.title, title))
    .limit(1);
  if (existing[0]) return existing[0].id;
  const [row] = await db
    .insert(conversations)
    .values({ title })
    .returning({ id: conversations.id });
  return row.id;
}

async function ensureMember(conversationId: string, userId: string) {
  const existing = await db
    .select({ conversationId: conversationMembers.conversationId })
    .from(conversationMembers)
    .where(
      and(
        eq(conversationMembers.conversationId, conversationId),
        eq(conversationMembers.userId, userId)
      )
    )
    .limit(1);
  if (!existing[0]) {
    await db.insert(conversationMembers).values({ conversationId, userId });
  }
}

async function ensureMessage(
  conversationId: string,
  senderId: string,
  body: string
) {
  const existing = await db
    .select({ id: messages.id })
    .from(messages)
    .where(
      and(
        eq(messages.conversationId, conversationId),
        eq(messages.senderId, senderId),
        eq(messages.body, body)
      )
    )
    .limit(1);
  if (!existing[0]) {
    await db.insert(messages).values({ conversationId, senderId, body });
  }
}

async function main() {
  const demoUser = await ensureAuthUser(
    DEMO_EMAIL,
    "Centher Demo",
    DEMO_PASSWORD
  );
  const idsByUsername: Record<string, string> = { demo: demoUser.id };

  let created = 0;
  for (const member of TEAM_MEMBERS) {
    const authUser = await ensureAuthUser(
      member.email,
      member.name,
      DEMO_PASSWORD
    );
    await db
      .insert(profiles)
      .values({
        userId: authUser.id,
        displayName: member.name,
        username: member.username,
        bio: member.bio,
        membership: member.membership,
        avatarUrl: "/images/centher.logo.favicon.png",
        isBot: true,
      })
      .onConflictDoNothing();
    // Idempotent flagging: the insert is skipped when the profile already
    // exists, so always enforce is_bot=true for team members.
    await db
      .update(profiles)
      .set({ isBot: true })
      .where(eq(profiles.userId, authUser.id));
    idsByUsername[member.username] = authUser.id;
    created++;
  }

  let convoCount = 0;
  let msgCount = 0;
  for (const dm of STARTER_DMS) {
    const convoId = await ensureConversation(dm.title);
    convoCount++;
    await ensureMember(convoId, demoUser.id);
    for (const username of dm.members) {
      await ensureMember(convoId, idsByUsername[username]);
    }
    for (const msg of dm.messages) {
      await ensureMessage(convoId, idsByUsername[msg.from], msg.body);
      msgCount++;
    }
  }

  console.error(`Team seed done. Members touched: ${created}.`);
  console.error(
    `Conversations touched: ${convoCount}, messages touched: ${msgCount}.`
  );
  console.error(`Usernames: ${TEAM_MEMBERS.map((m) => m.username).join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
