const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caseSchema = new Schema({
    patientNumber: {
        type:String,
        required: true
    },
    currentStatus: {
        type:String,
        required: true
    },
    stateCode: {
        type:String
    },
    statusChangeDate:{
        type: Date,
        required: true
    }
    
}, {timestamps: true})

const caseModel = mongoose.model('Case', caseSchema);
module.exports= caseModel;