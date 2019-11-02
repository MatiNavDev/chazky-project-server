const { ObjectID } = require('mongodb');

const { CollectionsFactory, classes } = require('../db/CollectionsFactory');
const { handleCommonError, handleCommonResponse } = require('../helpers/responses');
const { socketSendMessage, channels } = require('../helpers/socket');

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

const setUserSearchingTravel = async (req, res) => {
  try {
    const {
      socketId,
      requerimentsSelecteds: requeriments,
      shareTravel: shareVehicle,
      user
    } = req.body;

    const User = new CollectionsFactory(classes.USER);
    const userUpdated = await User.update(
      true,
      { _id: ObjectID(user) },
      { $set: { socketId, requeriments, shareVehicle } },
      { returnOriginal: false }
    );
    const Vehicle = new CollectionsFactory(classes.VEHICLE);
    const vehiclesConditions = {
      used: true,
      notAllowedUsers: { $nin: [user] },
      userUpSharesVehicle: true
    };

    if (!shareVehicle) vehiclesConditions.userUp = false;

    const vehicles = await Vehicle.find(false, { vehiclesConditions });

    if (vehicles.length) {
      vehicles.forEach(v => {
        socketSendMessage(v.socketId, channels.VEHICLE_LISTENING, userUpdated);
      });
    }

    handleCommonResponse(res, { ok: 'ok' });
  } catch (error) {
    handleCommonError(error);
  }
};
module.exports = {
  getUsers,
  setUserSearchingTravel
};
