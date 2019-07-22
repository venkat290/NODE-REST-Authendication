let mongoose = require('mongoose');
const server = 'venkat290113:venkat113@ds255889.mlab.com:55889'; // REPLACE WITH YOUR DB SERVER
const database = 'node-react';      // REPLACE WITH YOUR DB NAME

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {    
     mongoose.connect(`mongodb://${server}/${database}`)
       .then(() => {
         mongoose.set('debug', true);
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}
module.exports = new Database()
