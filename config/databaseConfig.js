const appConfig = require('../appConfig.json');
const mongoUrl = `mongodb://${appConfig.DATABASE_HOST}:${appConfig.DATABASE_PORT}/${appConfig.DATABASE_NAME}`;
// if(appConfig.DATABASE_USER && appConfig.DATABASE_PASS){
//     mongoUrl = `mongodb://${appConfig.DATABASE_USER}:${appConfig.DATABASE_PASS}@${appConfig.DATABASE_HOST}:${appConfig.DATABASE_PORT}/${appConfig.DATABASE_NAME}`;
// }

module.exports = {
    dbConnectionString : mongoUrl
}