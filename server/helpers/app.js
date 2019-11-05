const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const userRoutes = require('../routes/user');
const vehicleRoutes = require('../routes/vehicle');
const requerimentsRoutes = require('../routes/requeriment');
const { initSocket } = require('../helpers/socket');

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
    const allowedOrigins = ['http://localhost:3000', 'https://chasky-app-front.herokuapp.com'];
    const origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  initializeRoutes();

  const PORT = process.env.PORT || 3007;

  let server = http.createServer(app);

  initSocket(server);

  server.listen(PORT, () => console.log(`Chasky Project running in port: ${PORT}`));

  return app;
};

module.exports = {
  initializeApp,
  app
};
