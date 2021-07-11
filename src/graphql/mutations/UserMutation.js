const User = require('../../models/User');
//const UserType = require('../queries/UserType');
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLID } = require('graphql');
const bcrypt = require('bcryptjs');
const appConfig = require('../../../appConfig');
//const LoginType = require('../queries/LoginType');
const jwt = require('jsonwebtoken');

//api methods

const addUser = {
    type: require('../queries/UserType'),
    args: {
        name: {
            name: 'name',
            type: new GraphQLNonNull(GraphQLString)
        },
        email: {
            name: 'email',
            type: new GraphQLNonNull(GraphQLString)
        },
        password: {
            name: 'password',
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: async function(root, args){
        const existingUser = await User.findOne({email: args.email});
        if(existingUser){
            throw new error('Email is already registered. Please try with another email')
        }
        const hash = await bcrypt.hash(args.password, appConfig.hashRounds);
        args.password = hash;
        const userInfo = new User(args);
        const userObject = await userInfo.save();
        if(!userObject){
            throw new Error('Error while creating user')
        }
        else{
            return userObject;
        }
    }
}

const updateUser = {
    type: require('../queries/UserType'),
    args: {
        _id: {
            name: '_id',
            type: new GraphQLNonNull(GraphQLString)
        },
        name: {
            name: 'name',
            type: GraphQLString
        }, 
        password: {
            name: 'password',
            type: GraphQLString
        }
    },
    resolve: async function(root, args){
        let updatedUser = {};
        if(args.name){
            updatedUser.name = args.name
        }
        if(args.password){
            updatedUser.password = args.password
        }

        const newUpdatedUser = await User.findByIdAndUpdate(args._id, updatedUser, {new:true});
        if(!newUpdatedUser) {
            throw new Error('Error while updating user')
        }
        return newUpdatedUser;
    }
}

const deleteUser = {
    type: require('../queries/UserType'),
    args: {
        _id: {
            name: '_id',
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: async function(root, args){
        const deletedUser = User.findByIdAndUpdate({_id: args._id}, {$set: {isDeleted: true}});
        if(!deletedUser){
            throw new Error('Error while deleting user');
        }
        return deletedUser;
    }
}
const login = {
    
    type: require('../queries/LoginType'),
    args: {
        email: {
            name: 'email',
            type: new GraphQLNonNull(GraphQLString)
        },
        password: {
            name: 'password',
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: async function(root, args){
        const currentUser = await User.findOne({email: args.email, isDeleted: false});
        if(!currentUser){
            throw new Error('User does not exist or inactive');
        }
        const isAuth = await bcrypt.compare(args.password, currentUser.password);
        if(!isAuth){
            throw new Error('Email and password does not match');
        }
        const token = jwt.sign({userId: currentUser.id, email: currentUser.email}, appConfig.privateKey, {expiresIn: appConfig.tokenExpiryTime});

        return {
            userId: currentUser.id,
            email: currentUser.email,
            token: token,
            tokenExpiryTime: appConfig.tokenExpiryTime,
            user: currentUser._doc
        }
    }
    
}


module.exports = { addUser, updateUser, deleteUser, login };