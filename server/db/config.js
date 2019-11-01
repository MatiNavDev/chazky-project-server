const mongoDbConnectionOptions = { useNewUrlParser: true };

const dbName = process.env.APP_DATABASE_NAME;

const dbPass = process.env.MONGO_USER_PASS;

module.exports = {
  mongoDbConnectionOptions,
  dbName,
  dbPass
};
