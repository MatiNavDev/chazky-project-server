const { CollectionsFactory, classes } = require('../db/CollectionsFactory');
const { handleCommonError, handleCommonResponse } = require('../helpers/responses');

/**
 * Devuelve el listado de usuarios que no se encuentren utilizados
 * @param {*} req
 * @param {*} res
 */
const getUsers = async (req, res) => {
  try {
    const User = new CollectionsFactory(classes.USER);
    const users = await User.find(false, { used: false });
    handleCommonResponse(res, { users });
  } catch (error) {
    handleCommonError(res, error);
  }
};

module.exports = {
  getUsers
};
