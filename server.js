const express= require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const appConfig = require('./appConfig.json');
const path = require('path');
const schema= require('./src/schema');
const databaseConfig = require('./config/databaseConfig');
const bodyParser = require('body-parser');
const isAuthenticated = require('./middleware/IsAuthenticated');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'CovidData');
// const csv = require('csv-parser')
// const results = [];
// const async = require('async');
const loadCsv = require('./loadCsv');
const cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect(databaseConfig.dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err=>{
    if(err) console.log('Error while connecting to database '+ err);
    else console.log('Database conection established');
})

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const app = express();
app.use(bodyParser.json());

//setting cors
app.use((req, res, next) => {
    req.setTimeout(100000); //10 secs
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Header', 'X-Requested-With, content-type, Authorization');
    res.setTimeout(300000, function () {
        res.status(408).json({ success: false, message: "Request has timed out." })
    });
    next();
});
app.use(cors());

app.use(isAuthenticated);
app.use(express.static('./src/static')); //serving static files if required from static folder

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true // to test api in browser
}))

//query if there are any entries in db. if no entry , then execute
loadCsv.initialise(directoryPath);

app.listen(appConfig.PORT, ()=>{
    console.log('Listening to port '+ appConfig.PORT)
})

