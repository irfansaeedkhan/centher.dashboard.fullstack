import gql from "graphql-tag";

function getMessagesByBroadcastId() {
  return gql`
    query getMessagesByBroadcastId(
      $broadcastId: uuid!
      $limit: Int!
      $offset: Int!
    ) {
      messages(
        where: { broadcastId: { _eq: $broadcastId } }
        order_by: { createdAt: desc }
        limit: $limit
        offset: $offset
      ) {
        content
        createdAt
        id
        sender
      }
      aggregates: messages_aggregate(
        where: { broadcastId: { _eq: $broadcastId } }
      ) {
        aggregate {
          count
        }
      }
    }
  `;
}

function getParticipatorsByBroadcastId() {
  return gql`
    query getParticipatorsByBroadcastId(
      $broadcastId: uuid!
      $offset: Int!
      $limit: Int!
    ) {
      participators: user_broadcast(
        where: {
          broadcastId: { _eq: $broadcastId }
          type: { _nilike: "%HOST%" }
        }
        offset: $offset
        limit: $limit
      ) {
        id
        hasTalkRequest
        createdAt
        user {
          citizenshipEnd
          createdAt
          id
          lastSeen
        }
        type
        hasPermissionToMessage
        isMuted
      }
      aggregates: user_broadcast_aggregate(
        where: {
          broadcastId: { _eq: $broadcastId }
          type: { _nilike: "%HOST%" }
        }
      ) {
        aggregate {
          count
        }
      }
    }
  `;
}

function getInvitedUsersByBrooadcastId() {
  return gql`
    query getInvitedUsersByBrooadcastId($id: uuid!) {
      broadcast(where: { id: { _eq: $id } }) {
        invitedUsers
      }
    }
  `;
}

export {
  getMessagesByBroadcastId,
  getParticipatorsByBroadcastId,
  getInvitedUsersByBrooadcastId,
};
