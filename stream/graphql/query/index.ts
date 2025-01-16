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

function getInvitedUsersByBrooadcastId() {
  return gql`
    query getInvitedUsersByBrooadcastId($id: uuid!) {
      broadcast(where: { id: { _eq: $id } }) {
        invitedUsers
      }
    }
  `;
}

function getCollections() {
  return gql`
    query findCollectionByAddress($collection: String!) {
      collections(where: { collection_contains: $collection }) {
        category
        collection
        creatorUser {
          publicKey
        }
        name
        symbol
      }
    }
  `;
}

function getCollectionsByName() {
  return gql`
    query findCollectionByAddress($collection: String!) {
      collections(where: { name_contains_nocase: $collection }) {
        category
        collection
        creatorUser {
          publicKey
        }
        name
        symbol
      }
    }
  `;
}

export {
  getMessagesByBroadcastId,
  getInvitedUsersByBrooadcastId,
  getCollections,
  getCollectionsByName,
};
