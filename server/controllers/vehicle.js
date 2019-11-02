const { ObjectID } = require('mongodb');

const { CollectionsFactory, classes } = require('../db/CollectionsFactory');
const { handleCommonError, handleCommonResponse } = require('../helpers/responses');
const { socketDisconnectSpecificClient } = require('../helpers/socket');

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

/**
 * Setea el vehiculo ya disponible para utilizar.
 * Devuelve lista de usuarios disponibles para aceptar
 * @param {*} req
 * @param {*} res
 */
const setVehicleSearchingTravel = async (req, res) => {
  try {
    const { socketId, requerimentsSelecteds: requeriments, vehicle } = req.body;

    const Vehicle = new CollectionsFactory(classes.VEHICLE);
    await Vehicle.update(
      true,
      { _id: ObjectID(vehicle) },
      { $set: { socketId, requeriments, used: true } },
      { returnOriginal: false }
    );

    const User = new CollectionsFactory(classes.USER);
    const userConditions = {
      used: true,
      requeriments: { $in: requeriments },
      avaible: true
    };

    const users = await User.find(false, userConditions);

    handleCommonResponse({ users });
  } catch (error) {
    handleCommonError(error);
  }
};

/**
 * Se encarga de setear que un vehiculo ya no esta disponible.
 * Si tiene usuarios arriba, los cancela.
 * @param {*} req
 * @param {*} res
 */
const notUsedAnymore = async (req, res) => {
  try {
    const { id } = req.body;

    const Vehicle = new CollectionsFactory(classes.VEHICLE);
    const vehiclePreviousUpdate = await Vehicle.notUsedAnymore(ObjectID(id));

    if (vehiclePreviousUpdate.usersUp.length) return handleCommonResponse({ ok: 'ok' });

    const User = new CollectionsFactory(classes.USER);

    users = await Promise.all(
      vehiclePreviousUpdate.usersUp.map(userId => User.find(true, { _id: ObjectID(userId) }))
    );
    users.forEach(user => socketDisconnectSpecificClient(user.socketId));

    handleCommonResponse({ ok: 'ok' });
  } catch (error) {
    handleCommonError(error);
  }
};

module.exports = {
  getVehicles,
  notUsedAnymore,
  setVehicleSearchingTravel
};
