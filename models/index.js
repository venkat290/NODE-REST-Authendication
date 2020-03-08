let mongoose = require('mongoose');
const server = process.env.DB_SERVER;
const database = process.env.DATABASE;
console.log(`mongodb://${server}/${database}`)
class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true, useCreateIndex: true })
       .then(() => {
         mongoose.set('debug', true);
         console.log('Database connection successful')
       })
       .catch(err => {
         console.log(err);
         console.error('Database connection error')
       })
  }
}
module.exports = new Database()
