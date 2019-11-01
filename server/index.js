const { initializeApp } = require('./helpers/app');
const { initDB } = require('./db/init');

let app;

const init = async function() {
  try {
    await initDB();
    app = initializeApp();
  } catch (error) {
    //TODO: handle error
    console.log(error);
  }
};

init();

module.exports = {
  app
};
