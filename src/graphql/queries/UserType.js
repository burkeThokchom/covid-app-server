const User = require('../../models/User');
const { GraphQLString, GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLBoolean, GraphQLList, graphQLID } = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'UserType',
    description: 'User Information',
    fields: ()=>({
        _id: {
            type: new GraphQLNonNull(GraphQLString)
        },
        name: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        }
    })
})
module.exports = UserType;