const { GraphQLString, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLBoolean, GraphQLID } = require('graphql');

const LoginType= new GraphQLObjectType({
    name: 'LoginType',
    decription: 'Login type information',
    fields: ()=>({
        userId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        email: {
            type: new GraphQLNonNull(GraphQLString)
        },
        token: {
            type: new GraphQLNonNull(GraphQLString)
        },
        tokenExpiryTime: {
            type: new GraphQLNonNull(GraphQLString)
        },
        user: {
            type: require('./UserType'),
            resolve: async function(user){
                return user.user;
            }
        }
    })
})

module.exports = LoginType;