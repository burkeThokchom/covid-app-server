const { GraphQLObjectType, GraphQLSchema} = require('graphql');

const rootQuery = require('./graphql/queries/queryIndex.js');
const rootMutation = require('./graphql/mutations/mutationIndex.js');

const mainAppSchema = new GraphQLSchema({
    query: rootQuery,
    mutation: new GraphQLObjectType({
        name: 'mutation',
        fields: rootMutation
    })
})

module.exports = mainAppSchema;