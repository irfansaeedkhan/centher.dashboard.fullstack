import { eqAddress } from "./address.utils";

export function findActivityByType(activities: any[], type: string): any[] {
  const result = activities.filter((activity) => activity.type === type);
  return result;
}

export function mapReply(model: any): any {
  if (model) {
    return {
      content: model.content,
      created_at: model.created_at,
      id: model.id,
      pin_to: model.pin_to,
      replied_to: model.replied_to,
      type: model.type,
      user_address: model.user_conversation.user_address,
      medias: model.medias,
    };
  } else return null;
}

export function findEmojies(activities: any[]): any[] {
  const emojies = findActivityByType(activities, "emoji");
  return emojies.map((e: any) => {
    return {
      code: e.code,
      sender: e.user_address,
    };
  });
}

export function mapMessages(messages: any[], account: string): any[] {
  return messages.map((m: any) => {
    const seen = findActivityByType(m.activities, "seen");
    const fetched = findActivityByType(m.activities, "fetched");
    const isMine = eqAddress(m.user_conversation.user_address, account);

    return {
      repliedTo: mapReply(m.replied_to_message),
      create_at: new Date(m.created_at),
      id: m.id,
      sender: m.user_conversation.user_address,
      content: m.content,
      type: m.type,
      medias: m.medias,
      isMine,
      isSeen: isMine && seen?.length,
      isFetched: isMine && fetched?.length,
      isSent: true,
      reactions: findEmojies(m.activities),
      activities: m.activities,
    };
  });
}

export function findUnSeenMessages(messages: any[], account: string): string[] {
  return messages
    .map((e) => {
      const seenByMe = e.activities.some(
        (e: any) => e.type == "seen" && eqAddress(e.user_address, account)
      );
      if (!e.isMine && !seenByMe) return e.id;
    })
    .filter(Boolean);
}

export function findUnFetchedMessages(
  messages: any[],
  account: string
): string[] {
  return messages
    .map((e) => {
      const seenByMe = e.activities.some(
        (e: any) => e.type == "fetched" && eqAddress(e.user_address, account)
      );
      if (!e.isMine && !seenByMe) return e.id;
    })
    .filter(Boolean);
}

export function findOnlineUsers(userConversation: any[]): any[] {
  return userConversation.filter((e: any) => {
    const different = +new Date() - +new Date(e.user.latest_update);
    if (different > 0 && different < 10000) {
      return e;
    }
  });
}
