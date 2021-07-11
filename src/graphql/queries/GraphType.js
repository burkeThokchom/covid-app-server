const Case = require('../../models/Case');
const {GraphQLObjectType, GraphQLInt } = require('graphql');

const GraphType = new GraphQLObjectType({
    name: 'GraphType',
    description: 'Graph data format',
    fields: ()=>({
        
        Hospitalized: {
            type: GraphQLInt
        },
        Recovered: {
            type: GraphQLInt
        },
        Deceased: {
            type: GraphQLInt
        }
    })
})
module.exports = GraphType;