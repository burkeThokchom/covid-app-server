const fs = require('fs');
const csv = require('csv-parser')
let results = [];
//const async = require('async');
const Case = require('./src/models/Case');
//const mongoose = require('mongoose');


module.exports.initialise = function (fileDirectory) { 
    var i = 0
    function readFiles(fileDirectory){
        console.log(fileDirectory); 
        fs.readdir(fileDirectory, function (err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
          
            files.forEach((file,index)=>{
                parsecsvObj(file);
                //if(index == results.length -1) results = [];
                
            })
        });
    }

    function parsecsvObj(file){
       
        fs.createReadStream(fileDirectory+'/'+ file)
        .pipe(csv())
        .on('data', (data) => {
            //results.push(data))
           
            var formatedTime = data['Date Announced'] ? data['Date Announced'].split('/').reverse().join(', ') : data['Status Change Date'].split('/').reverse().join(', ');
            console.log('formatedTime', formatedTime, typeof formatedTime);
            var dateOnlyString, desiredFormattedTime;
            if(formatedTime.length> 5){
                dateOnlyString = new Date(formatedTime).toISOString();
                desiredFormattedTime = new Date(dateOnlyString);
                if( data['Patient Number']){
                    var caseData = {
                        patientNumber: data['Patient Number'],
                        currentStatus: data['Current Status'],
                        stateCode: data['State code'],
                        statusChangeDate: formatedTime ? desiredFormattedTime : new Date(new Date().toISOString())
                    }
                    console.log(caseData);
                    saveEachDocument(caseData);
                }
            }      
        })
        .on('end', () => {
           
            // results.forEach(eachCase=>{
              
            //     var formatedTime = eachCase['Status Change Date'].split('/').reverse().join(', ');
            //     var caseData = {
            //         patientNumber: eachCase['Patient Number'],
            //         currentStatus: eachCase['Current Status'],
            //         stateCode: eachCase['State code'],
            //         statusChangeDate: formatedTime ? new Date(formatedTime).toISOString() : new Date().toISOString()
            //     }
            //     saveEachDocument(caseData);
            // })
        });
    }

    async function saveEachDocument(caseData){
       // console.log('test: ',caseData)
        const caseInfo = new Case(caseData);
        const result = await caseInfo.save();
        console.log('after: ', result);
        if(!result){
            console.log('Error while adding case')
        }
        else{
            console.log('done: ', result.id);
        }


    }
    async function checkIfDataAdded(){
        const res = await Case.find();
        if(res.length ===0){
            readFiles(fileDirectory);
        }
        else{{
            console.log('cases aready added', res.length);
        }}
    }
    checkIfDataAdded();
    
};








