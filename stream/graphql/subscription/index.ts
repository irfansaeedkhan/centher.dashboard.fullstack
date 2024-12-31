import gql from "graphql-tag";

function getStreams() {
  return gql`
    subscription streamAvatarCarousel($limit: Int!) {
      broadcast(limit: $limit) {
        accessMode
        createdAt
        deletedAt
        description
        id
        name
        image
        tokenAddress
        type
        hosts: user_broadcasts(where: { type: { _ilike: "%HOST%" } }) {
          type
          user {
            id
          }
        }
        latestParticipants: user_broadcasts(
          where: { type: { _nilike: "%HOST%" } }
          limit: 2
          offset: 0
          order_by: { createdAt: desc }
        ) {
          type
          user {
            id
          }
        }
        participatorsCount: user_broadcasts_aggregate(
          where: { type: { _nilike: "%HOST%" } }
        ) {
          aggregate {
            count
          }
        }
        speakersCount: user_broadcasts_aggregate(
          where: { type: { _ilike: "%SPEAKER%" } }
        ) {
          aggregate {
            count
          }
        }
      }
    }
  `;
}

function getCurrentStream() {
  return gql`
    subscription currentStream($limit: Int = 1, $broadcastId: uuid!) {
      broadcast(limit: $limit, where: { id: { _eq: $broadcastId } }) {
        accessMode
        createdAt
        deletedAt
        description
        id
        name
        image
        tokenAddress
        type
        hosts: user_broadcasts(where: { type: { _ilike: "%HOST%" } }) {
          type
          user {
            id
          }
        }
        latestParticipants: user_broadcasts(
          where: { type: { _nilike: "%HOST%" } }
          limit: 2
          offset: 0
          order_by: { createdAt: desc }
        ) {
          type
          user {
            id
          }
        }
        participatorsCount: user_broadcasts_aggregate(
          where: { type: { _nilike: "%HOST%" } }
        ) {
          aggregate {
            count
          }
        }
        speakersCount: user_broadcasts_aggregate(
          where: { type: { _ilike: "%SPEAKER%" } }
        ) {
          aggregate {
            count
          }
        }
      }
    }
  `;
}

function getStreamMessages() {
  return gql`
    subscription getBroadcastMessages($broadcastId: uuid!) {
      messages(
        where: { broadcastId: { _eq: $broadcastId } }
        offset: 0
        limit: 5
        order_by: { createdAt: desc }
      ) {
        id
        createdAt
        content
        sender
      }
    }
  `;
}

function getStreamSpeakers() {
  return gql`
    subscription getStreamSpeakers($broadcastId: uuid!) {
      speakers: user_broadcast(
        where: {
          broadcastId: { _eq: $broadcastId }
          type: { _ilike: "%SPEAKER%" }
        }
        order_by: { createdAt: asc }
      ) {
        user {
          id
        }
        type
        hasPermissionToMessage
      }
    }
  `;
}

function getCurrentStreamUser() {
  return gql`
    subscription getCurrentStreamUser($userId: String!, $broadcastId: uuid!) {
      users: user_broadcast(
        where: {
          user: { id: { _eq: $userId } }
          broadcastId: { _eq: $broadcastId }
        }
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
        broadcastId
        type
        hasPermissionToMessage
        isMuted
      }
    }
  `;
}

function getHasTalkRequestStreamUsers() {
  return gql`
    subscription getHasTalkRequestStreamUsers($broadcastId: uuid!) {
      users: user_broadcast(
        where: {
          broadcastId: { _eq: $broadcastId }
          hasTalkRequest: { _eq: true }
        }
      ) {
        user {
          id
        }
        hasTalkRequest
      }
    }
  `;
}

export {
  getStreams,
  getCurrentStream,
  getStreamMessages,
  getStreamSpeakers,
  getCurrentStreamUser,
  getHasTalkRequestStreamUsers,
};
