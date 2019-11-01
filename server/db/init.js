const { MongoClient } = require('mongodb');
const { dbName, mongoDbConnectionOptions, dbPass } = require('./config');

let db;

const initDB = async () => {
  const url = `mongodb+srv://matioDEV:${dbPass}@clusterchasky-e1rdj.mongodb.net/test?retryWrites=true&w=majority`;

  const client = new MongoClient(url, mongoDbConnectionOptions);
  await client.connect();
  db = client.db(dbName);
};

function getDB() {
  return db;
}

module.exports = {
  initDB,
  getDB
};
