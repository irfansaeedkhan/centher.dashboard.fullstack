import { DocumentNode, gql } from "@apollo/client";
import { Queries } from "../types/queries";
import { QueryNames } from "../enums/query.names";

export class QueryFactory {
  static getQuery(name: QueryNames): DocumentNode {
    const query = queries[name];
    if (!query) {
      throw new Error(`query ${name} not found`);
    }

    return gql(query);
  }
}

const queries: Queries = {
  updateLatestSeen: `mutation MyMutation($_eq: String, $latest_update: timestamptz = "") {
    update_users(where: {address: {_ilike: $_eq}}, _set: {latest_update: $latest_update}) {
      returning {
        address
      }
    }
  }`,
  getNewNotifications: `subscription MySubscription($_eq: String = "") {
    notifications(where: {is_fetched: {_eq: false}, user_address: {_ilike: $_eq}}) {
      user_address
      topic
      title
      seen_date
      link
      is_sent
      is_seen
      is_fetched
      is_clicked
      is_clickable
      id
      data
      created_at
    }
  }`,
  updateNotificationFetch: `mutation MyMutation($_eq: uuid = "") {
    update_notifications(where: {id: {_eq: $_eq}}, _set: {is_fetched: true}) {
      returning {
        id
      }
    }
  }`,
  updateNotificationSeen: `mutation MyMutation($_eq: uuid = "") {
    update_notifications(where: {id: {_eq: $_eq}}, _set: {is_seen: true, seen_date: "now()"}) {
      returning {
        id
      }
    }
  }`,
  getNotificationsHistory: `query MyQuery($limit: Int = 10, $offset: Int = 10, $_ilike: String = "") {
    notifications(where: {user_address: {_ilike: $_eq}}, limit: $limit, offset: $offset, order_by: {created_at: desc}) {
      created_at
      data
      id
      is_clickable
      is_clicked
      is_fetched
      is_seen
      is_sent
      link
      seen_date
      title
      topic
      user_id
    }
  }  
  `,
  getConversations: `query MyQuery($_eq: String = "") {
    conversations(order_by: {updated_at: desc}, where: {user_conversations: {user_address: {_ilike: $_eq}}, is_active: {_eq: true}}) {
      updated_at
      is_public
      is_channel
      is_active
      id
      created_at
      channel_name
      channel_description
      cover_path
      user_conversations {
        is_typing
        is_recording
        is_owner
        id
        user_address
        messages(limit: 1, order_by: {created_at: desc}) {
          type
          replied_to
          id
          created_at
          content
          activities {
            type
            id
            user_address
          }
        }
      }
    }
  }
  
  `,
  getConversationMessages: `query MyQuery($_eq: uuid = "", $limit: Int = 10, $offset: Int = 10) {
    users_conversations(where: {conversation: {id: {_eq: $_eq}}}, limit: $limit, offset: $offset) {
      user_id
      messages {
        content
        content_path_id
        created_at
        id
        replied_to
        type
        user_conversation_id
        path {
          created_at
          id
          path
        }
        activities {
          type
          message_id
          created_at
          user {
            address
            id
          }
        }
      }
    }
  }
  `,
  subToConversations: `subscription MySubscription($_eq: String = "") {
    conversations(where: {user_conversations: {user_address: {_ilike: $_eq}}, is_active: {_eq: true}}) {
      updated_at
      is_public
      is_channel
      is_active
      id
      created_at
      channel_name
      channel_description
      cover_path
      user_conversations {
         is_owner
        id
        user_address
        is_pinned
        messages(order_by: {created_at: desc}, limit: 1, where: {isRemoved: {_eq: false}}) {
          type
          id
          created_at
          content
          activities {
            type
            user_address
          }
        }
        user {
          latest_update
        }
      }
    }
  }
  `,
  getUserId: `query MyQuery($_eq: String = "") {
    users(where: {address: {_eq: $_eq}}) {
      id
    }
  }`,
  sendMessage: `mutation MyMutation($content: String = "", $user_conversation_id: uuid = "", $replied_to: uuid = "") {
    insert_messages(objects: {content: $content, type: "text", replied_to: $replied_to, user_conversation_id: $user_conversation_id}) {
      returning {
        id
      }
    }
  }
  `,
  getUserConversationId: `query MyQuery($_eq: uuid = "", $_eq1: String = "") {
    user_conversations(where: {conversation_id: {_eq: $_eq}, user_address: {_ilike: $_eq1}}) {
      id
    }
  }`,
  seenMessage: `mutation MyMutation($user_address: String = "", $message_id: uuid = "") {
    insert_activities_one(object: {user_address: $user_address, type: "seen", message_id: $message_id}) {
      id
    }
  }`,
  fetchedMessage: `mutation MyMutation($user_address: String = "", $message_id: uuid = "") {
    insert_activities_one(object: {user_address: $user_address, type: "fetched", message_id: $message_id}) {
      id
    }
  }`,
  checkActivityExist: `query MyQuery($_ilike: String = "", $_message_id: uuid = "", $_type: String = "") {
    activities(where: {_and: {message_id: {_eq: $_message_id}, user_address: {_ilike: $_ilike}, type: {_eq: $_type}}}) {
      id
    }
  }`,
  createNewPrivateChat: `mutation MyMutation($user_address: String = "", $created_at: String = "") {
    insert_conversations(objects: {is_channel: false, is_active: true, is_public: false, user_conversations: {data: {is_owner: true, is_recording: false, is_typing: false, user_address: $user_address}}, created_at: $created_at}) {
      returning {
        id
      }
    }
  }`,
  createUserConversation: `mutation MyMutation($conversation_id: uuid = "", $user_address: String = "") {
    insert_user_conversations_one(object: {conversation_id: $conversation_id, is_owner: false, is_recording: false, is_typing: false, user_address: $user_address}) {
      id
    }
  }`,
  //TODO: if conversation exist, but isActive is false, update it to true
  findConversationByUsers: `query MyQuery($_eq: String = "", $_eq1: String = "") {
    user_conversations(where: {conversation: {user_conversations: {user_address: {_ilike: $_eq}}, is_active: {_eq: true}, is_channel: {_eq: false}, is_public: {_eq: false}}, user_address: {_eq: $_eq1}}) {
      conversation_id
    }
  }
  `,
  subscribeToMessages: `subscription MySubscription($_eq: uuid = "", $offset: Int = 0, $limit: Int = 0) {
    messages(order_by: {created_at: desc}, where: {user_conversation: {conversation_id: {_eq: $_eq}}, isRemoved: {_eq: false}}, offset: $offset, limit: $limit) {
      id
      activities {
        user_address
        type
        created_at
        code
      }
      content
      created_at
      type
      replied_to
      medias {
        type
        path
        id
        created_at
      }
      user_conversation {
        user_address
      }
      replied_to_message {
        content
        created_at
        id
        pin_to
        replied_to
        type
        user_conversation {
          user_address
        }
        medias {
          type
          path
          id
          created_at
        }
      }
    }
  }
  `,
  updateConversationlatestUpdateTime: `mutation MyMutation($_eq: uuid = "", $updated_at: timestamptz = "") {
    update_conversations(where: {id: {_eq: $_eq}}, _set: {updated_at: $updated_at}) {
      returning {
        id
      }
    }
  }`,
  userExists: `query MyQuery($_ilike: String = "") {
    users(where: {address: {_ilike: $_ilike}}) {
      address
    }
  }`,
  createUser: `mutation MyMutation($address: String = "") {
    insert_users_one(object: {address: $address}) {
      address
    }
  }`,
  subToAConversation: `subscription MySubscription($_eq: uuid = "") {
    conversations(where: {id: {_eq: $_eq}}) {
      channel_description
      channel_name
      cover_path
      created_at
      id
      is_channel
      is_public
      user_conversations {
        is_typing
        is_recording
        user_address
        user {
          latest_update
        }
      }
    }
  }
  `,
  updateIsTyping: `mutation MyMutation($is_typing: Boolean = false, $_eq: uuid = "", $_ilike: String = "") {
    update_user_conversations(where: {_and: {conversation_id: {_eq: $_eq}, user_address: {_ilike: $_ilike}}}, _set: {is_typing: $is_typing}) {
      returning {
        id
      }
    }
  }`,
  removeMessage: `mutation MyMutation($_eq: uuid = "") {
    update_messages(where: {id: {_eq: $_eq}}, _set: {isRemoved: true}) {
      returning {
        id
      }
    }
  }`,
  getChatPaticipants: `query MyQuery($_eq: uuid = "") {
    conversations(where: {id: {_eq: $_eq}}) {
      user_conversations {
        user_address
      }
    }
  }`,
  editMessage: `mutation MyMutation($_eq: uuid = "", $content: String = "") {
    update_messages(where: {id: {_eq: $_eq}}, _set: {content: $content}) {
      returning {
        id
      }
    }
  }`,
  addEmojiToMessage: `mutation MyMutation($message_id: uuid = "", $user_address: String = "", $code: String = "") {
    insert_activities(objects: {message_id: $message_id, type: "emoji", user_address: $user_address, code: $code}) {
      returning {
        id
      }
    }
  }`,
  checkUserAlreadySetEmojiForMessage: `query MyQuery($_eq: uuid = "", $_ilike: String = "") {
    activities(where: {_and: {message_id: {_eq: $_eq}, user_address: {_ilike: $_ilike}}, type: {_eq: "emoji"}}) {
      id
      code
    }
  }
  `,
  updateMessageEmoji: `mutation MyMutation($_eq: uuid = "", $_ilike: String = "", $_eq2: String = "", $code: String = "") {
    update_activities(where: {_and: {message_id: {_eq: $_eq}, user_address: {_ilike: $_ilike}, code: {_eq: $_eq2}}}, _set: {code: $code}) {
      returning {
        id
      }
    }
  }`,
  deleteMessageEmoji: `mutation MyMutation($_eq: String = "", $_eq1: uuid = "", $_ilike: String = "") {
    delete_activities(where: {_and: {code: {_eq: $_eq}, message_id: {_eq: $_eq1}, user_address: {_ilike: $_ilike}}}) {
      returning {
        id
      }
    }
  }
  `,
  getlastFetchedMessage: `query MyQuery($_ilike: String = "", $_eq: uuid = "") {
    users(where: {address: {_ilike: $_ilike}}) {
      activities(where: {_and: {type: {_eq: "fetched"}, message: {user_conversation: {conversation_id: {_eq: $_eq}}}}}, limit: 1, order_by: {created_at: desc}) {
        message {
          created_at
          id
        }
      }
    }
  }`,
  getAllConversationMessageToFetch: `query MyQuery($_nilike: String = "", $_eq: uuid = "") {
    messages(where: {user_conversation: {user_address: {_nilike: $_nilike}, conversation_id: {_eq: $_eq}}}) {
      id
    }
  }`,
  getMessagesToCreateFetchedActivity: `query MyQuery($_gt: timestamptz = "", $_eq: uuid = "", $_nilike: String = "") {
    messages(where: {_and: {created_at: {_gt: $_gt}, user_conversation: {conversation_id: {_eq: $_eq}, user_address: {_nilike: $_nilike}}}}) {
      id
    }
  }`,
  deleteConversation: `mutation MyMutation($_eq: uuid = "") {
    update_conversations(where: {id: {_eq: $_eq}}, _set: {is_active: false}) {
      returning {
        id
      }
    }
  }
  `,
  pinConversation: `mutation MyMutation($_eq: uuid = "", $_ilike: String = "") {
    update_user_conversations(where: {_and: {conversation_id: {_eq: $_eq}, user_address: {_ilike: $_ilike}}}, _set: {is_pinned: true}) {
      returning {
        id
      }
    }
  }
  `,
  unPinConversation: `mutation MyMutation($_eq: uuid = "", $_ilike: String = "") {
    update_user_conversations(where: {_and: {conversation_id: {_eq: $_eq}, user_address: {_ilike: $_ilike}}}, _set: {is_pinned: false}) {
      returning {
        id
      }
    }
  }`,
  getUnreadNotificationsCount: `subscription MySubscription($_ilike: String = "") {
    notifications(where: {_and: {is_seen: {_eq: false}, user_address: {_ilike: $_ilike}}}) {
      id
    }
  }`,
};
