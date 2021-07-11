const Case = require('../../models/Case');
//const UserType = require('../queries/UserType');
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLID } = require('graphql');
const bcrypt = require('bcryptjs');
const appConfig = require('../../../appConfig');
//const LoginType = require('../queries/LoginType');
const jwt = require('jsonwebtoken');

//api methods

const addCase = {
    type: require('../queries/CaseType'),
    args: {
        patientNumber: {
            name: 'patientNumber',
            type: new GraphQLNonNull(GraphQLString)
        },
        currentStatus: {
            name: 'currentStatus',
            type: new GraphQLNonNull(GraphQLString)
        },
        stateCode: {
            name: 'stateCode',
            type: new GraphQLNonNull(GraphQLString)
        },
        statusChangeDate: {
            name: 'statusChangeDate',
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: async function(root, args){
        const caseInfo = new Case(args);
        const caseObject = await userInfo.save();
        if(!caseObject){
            throw new Error('Error while adding case')
        }
        else{
            return caseObject;
        }
    }
}


module.exports = { addCase };