import gql from "graphql-tag";

function insertMessageToStream() {
  return gql`
    mutation insertMessageToStream($content: String!, $broadcastId: uuid!) {
      insert_messages_one(
        object: { content: $content, broadcastId: $broadcastId }
      ) {
        id
      }
    }
  `;
}

function updateUserVoiceStatus() {
  return gql`
    mutation updateUserVoiceStatus($userId: String!, $status: Boolean!) {
      update_user_broadcast(
        where: { user: { id: { _eq: $userId } } }
        _set: { isMuted: $status }
      ) {
        affected_rows
      }
    }
  `;
}

export { insertMessageToStream, updateUserVoiceStatus };
