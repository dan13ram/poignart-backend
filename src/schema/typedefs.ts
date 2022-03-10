import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Artist {
    _id: ID!
    name: String!
    bio: String!
    ethAddress: String!
    discordHandle: String!
    telegramHandle: String
    twitterHandle: String
    instagramHandle: String
    emailAddress: String
    ensName: String
    createdNFTs: [Token!]
    createdAt: String!
    updatedAt: String!
  }

  type Token {
    _id: ID!
    tokenID: Int!
    tokenURI: String!
    minPrice: String!
    createdBy: Artist!
    signature: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    artists: [Artist]
    tokens: [Token]

    artist(filters: ArtistFilter): Artist
    token(filters: TokenFilter): Token
  }

  input ArtistFilter {
    _id: String
    ethAddress: String
  }

  input TokenFilter {
    _id: String
    tokenID: Int
  }
`;
