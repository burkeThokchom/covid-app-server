const { GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID , GraphQLInt} = require('graphql');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appConfig = require('../../../appConfig');
const Case = require('../../models/Case');
var moment = require('moment');
moment().format();

const rootQuery = new GraphQLObjectType({
    name: 'rootQuery',
    description: 'All queries',
    fields: ()=>({
        //query for all users
        users: {
            type: new GraphQLList(require('./UserType')),
            description: 'List of all users',
            resolve: async function(){
                return await User.find({isDeleted: false})
            }
        },
        //query for single user by id
        getUserById: {
            type: require('./UserType'),
            description: 'Fetch user with _id or email',
            args: {
                _id: {
                    name: '_id',
                    type: GraphQLString
                },
                email: {
                    name: 'email',
                    type: GraphQLString
                }
            }, 
            resolve: async function(root, args, req){
                if(args._id){
                    return await User.findOne({_id: args._id, isDeleted: false})
                }
                if(args.email){
                    return await User.findOne({email: args.email, isDeleted: false})
                }
            }
        },
        cases: {
            type: new GraphQLList(require('./CaseType')),
            description: 'List of all cases',
            resolve: async function(){
                return await Case.find({isDeleted: false})
            }
        },
        getCaseCount: {
            type: GraphQLInt,
            description: 'Number of requested cases cases',
            args: {
                fromDate: {
                    name: 'fromDate',
                    type: GraphQLString
                },
                toDate: {
                    name: 'toDate',
                    type: GraphQLString
                },
                stateCode: {
                    name: 'stateCode',
                    type: GraphQLString
                },
                status: {
                    name: 'status',
                    type: GraphQLString
                }
            }, 

           // db.getCollection('hola').find({"created":{"$gte":"2016-01-01T00:00:00.000Z","$lte":"2016-10-10T06:28:37.146Z"}})
            resolve: async function(root, args, req){
                let queryObj = {};
             //   {"$gte": new Date("2015-10-01T00:00:00.000Z") , "$lt": new Date("2017-03-13T16:17:36.470Z") }});
                if(args.fromDate && args.toDate){
                    
                    // var from_year = new Date(args.fromDate).getFullYear();
                    // var from_month = new Date(args.fromDate).getMonth() + 1;
                    // var from_date = new Date(args.fromDate).getDate();

                    // var to_year = new Date(args.toDate).getFullYear();
                    // var to_month = new Date(args.toDate).getMonth();
                    // var to_day = new Date(args.toDate).getDate();
                    console.log("both dates", args.fromDate, args.toDate)
                    queryObj['statusChangeDate'] = {
                        $lte: args.toDate,
                        $gte: args.fromDate
                        
                    };
                }

                if(args.stateCode){
                    queryObj['stateCode'] = args.stateCode;
                }
                // if(args.status){
                //     queryObj['currentStatus'] = args.status;
                // }
                console.log('queryObj:', queryObj)
                const result = await Case.find(queryObj);
                console.log('ressss:', result.length)
               
                if(!result){
                    throw new Error('Error while fetching patient data')
                }
                return result.length
            }

        },
        getCasesForGraph: {
            type: new GraphQLList(GraphQLInt),
            description: 'Number of requested cases cases',
            args: {
                fromDate: {
                    name: 'fromDate',
                    type: GraphQLString
                },
                toDate: {
                    name: 'toDate',
                    type: GraphQLString
                }
            }, 
            resolve: async function(root, args, req){
                let queryObj = {
                    statusChangeDate: {
                        $lte: args.toDate,
                        $gte: args.fromDate
                        
                    }
                };

                console.log("HEre Here ");
                const hospitalized = await Case.find({...queryObj, currentStatus: 'Hospitalized'});
                const recovered = await Case.find({...queryObj, currentStatus: 'Recovered'});
                const deceased = await Case.find({...queryObj, currentStatus: 'Deceased'});
                
                
                const responseData = [
                    hospitalized.length,
                    recovered.length,
                    deceased.length
                ]
                

                // const result =   await Case.find();
                // if(!result){
                //     throw new Error('Error while fetching patient data')
                // }
                return responseData;
            }
        }
    })
})
module.exports = rootQuery;