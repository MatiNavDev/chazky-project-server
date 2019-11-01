const { CollectionsFactory, classes } = require('../db/CollectionsFactory');
const { handleCommonError, handleCommonResponse } = require('../helpers/responses');

/**
 * Devuelve el listado de vehiculos que no se encuentren utilizados
 * @param {*} req
 * @param {*} res
 */
const getVehicles = async (req, res) => {
  try {
    const Vehicle = new CollectionsFactory(classes.VEHICLE);
    const vehicles = await Vehicle.find(false, { used: false });
    handleCommonResponse(res, { vehicles });
  } catch (error) {
    handleCommonError(res, error);
  }
};

module.exports = {
  getVehicles
};
