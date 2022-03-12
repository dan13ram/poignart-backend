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
    createdVouchers: [Voucher!]
    createdAt: String!
    updatedAt: String!
  }

  type Voucher {
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
    vouchers: [Voucher]

    artist(filters: ArtistFilter): Artist
    voucher(filters: VoucherFilter): Voucher
  }

  input ArtistFilter {
    _id: String
    ethAddress: String
  }

  input VoucherFilter {
    _id: String
    tokenID: Int
  }
`;
