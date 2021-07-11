const Case = require('../../models/Case');
const { GraphQLString, GraphQLObjectType, GraphQLNonNull } = require('graphql');

const CaseType = new GraphQLObjectType({
    name: 'CaseType',
    description: 'Case Information',
    fields: ()=>({
        _id: {
            type: new GraphQLNonNull(GraphQLString)
        },
        patientNumber: {
            type: GraphQLString
        },
        stateCode: {
            type: GraphQLString
        },
        statusChangeDate: {
            type: GraphQLString
        }
    })
})
module.exports = CaseType;