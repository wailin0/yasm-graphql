const { gql } = require('apollo-server')


module.exports = gql`
  type User {
    name: String!
    email: String!
    photoURL: String!
    coverPhotoURL: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Post {
    body: String!
    photoURL: String!
    createdAt: String!
    user: User!
    id: ID!
  }

  type Query {
    allPosts(body: String): [Post!]!
    userPosts: [Post!]!
    me: User
  }

  type Mutation {
    addPost(
      body: String!
      photoURL: String
    ): Post

    updateUser(
      name: String
      email: String
      photoURL: String
      coverPhotoURL: String
      password: String
    ): User

    createUser(
      name: String!
      email: String!
      password: String!
    ): User

    login(
      email: String!
      password: String!
    ): Token
  }

  type Subscription {
    postAdded: Post!
  }   
`
