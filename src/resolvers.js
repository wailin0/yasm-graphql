const {PubSub} = require ("graphql-subscriptions");
const {UserInputError, AuthenticationError} = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'SECRET'
const mongoose = require('mongoose')

const Post = require('./models/post')
const User = require('./models/user')

const pubsub = new PubSub();



module.exports = {
    Query: {
        allPosts: async (root, {body}) => {
            if(!body){
                return Post.find().sort({createdAt: 'desc'}).populate('user');
            }
            return Post.find({body: {$regex: '.*' + body + '.*'}}).populate('user')
        },
        userPosts: async (root, args, {currentUser}) => {
            if (!currentUser) {
                throw new AuthenticationError("not authenticated")
            }
            return Post.find({user: currentUser._id}).populate('user')
        },
        me: (root, args, context) => {
            return context.currentUser
        }
    },
    Mutation: {
        addPost: async (root, {body, photoURL}, {currentUser}) => {
            if (!currentUser) {
                throw new AuthenticationError("not authenticated")
            }

            const createdAt = Date.now()

            let post = new Post({body, photoURL, createdAt})
            post.user = currentUser
            await post.save()

            await pubsub.publish('POST_ADDED', {postAdded: post})

            return post
        },
        updateUser: async (root, { name,password,email, photoURL,coverPhotoURL }, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError("not authenticated")
            }

            let user = await User.findById(currentUser._id)

            user.name = name ? name : user.name
            user.photoURL = photoURL ? photoURL : user.photoURL
            user.coverPhotoURL = coverPhotoURL ? coverPhotoURL : user.coverPhotoURL


            return user.save()
        },
        createUser: (root, {name, email, password}, args) => {

            const createdAt = Date.now()

            const user = new User({name, email,createdAt, password})

            return user.save()
                .catch(error => {
                    throw new UserInputError(error.message, {
                        invalidArgs: args,
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({email: args.email})

            if (!user) {
                throw new UserInputError("user not found")
            }

            if (user.password !== args.password) {
                throw new UserInputError("invalid email or password")
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return {value: jwt.sign(userForToken, JWT_SECRET)}
        }
    },
    Subscription: {
        postAdded: {
            subscribe: () => pubsub.asyncIterator(['POST_ADDED'])
        }
    }
}
