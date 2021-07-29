const {ApolloServer} = require("apollo-server")
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const User = require('./models/user')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
 const MONGODB_URI = 'mongodb://wailin:wailinhtet@cluster0-shard-00-00.ksv8j.mongodb.net:27017,cluster0-shard-00-01.ksv8j.mongodb.net:27017,cluster0-shard-00-02.ksv8j.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-bbpd7o-shard-0&authSource=admin&retryWrites=true&w=majority'
// const MONGODB_URI = 'mongodb://127.0.0.1:27017'

const JWT_SECRET = 'SECRET'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
        console.log('aborted starting apollo server')
    })

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), JWT_SECRET
            )

            const currentUser = await User
                .findById(decodedToken.id)

            return { currentUser }
        }
    }
})

const port = process.env.PORT || 4000;


server.listen(port).then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
