const { CollectionsFactory, classes } = require('../db/CollectionsFactory');
const { handleCommonError, handleCommonResponse } = require('../helpers/responses');

/**
 * Devuelve el listado de vehiculos que no se encuentren utilizados
 * @param {*} req
 * @param {*} res
 */
const getRequeriments = async (req, res) => {
  try {
    const Requeriment = new CollectionsFactory(classes.REQUERIMENT);
    const requeriments = await Requeriment.find();
    handleCommonResponse(res, { requeriments });
  } catch (error) {
    handleCommonError(res, error);
  }
};

module.exports = {
  getRequeriments
};
