const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('../routes/user');
const vehicleRoutes = require('../routes/vehicle');
const requerimentsRoutes = require('../routes/requeriment');

let app;
const routeInitialText = '/chasky-project-api/v1';

/**
 * Initialize app routes
 */
const initializeRoutes = () => {
  app.use(`${routeInitialText}/users`, userRoutes);
  app.use(`${routeInitialText}/vehicles`, vehicleRoutes);
  app.use(`${routeInitialText}/requeriments`, requerimentsRoutes);
};

const initializeApp = () => {
  app = express();
  app.use(bodyParser.json());

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  initializeRoutes();

  const PORT = process.env.PORT || 3007;

  app.listen(PORT, () => console.log(`Chasky Project running in port: ${PORT}`));

  return app;
};

module.exports = {
  initializeApp,
  app
};
