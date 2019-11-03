const { ObjectID } = require('mongodb');

const { CollectionsFactory, classes } = require('../db/CollectionsFactory');
const { handleCommonError, handleCommonResponse } = require('../helpers/responses');
const {
  socketDisconnectSpecificClient,
  socketSendMessage,
  channels
} = require('../helpers/socket');

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
    //TODO: manejar si el vehiculo se encuentra utilizado (uno abrio la pestana y lo eligio antes del otro)
    const { socketId, vehicle } = req.body;

    const Vehicle = new CollectionsFactory(classes.VEHICLE);
    const User = new CollectionsFactory(classes.USER);

    const queryToUpdateVehicle = Vehicle.update(
      true,
      { _id: ObjectID(vehicle) },
      { $set: { socketId, used: true } },
      { returnOriginal: false }
    );
    const queryToFindWatingUsers = User.find(false, {
      used: true,
      avaible: true
    });

    const [vehicleUpdateResp, usersWating] = await Promise.all([
      queryToUpdateVehicle,
      queryToFindWatingUsers
    ]);

    const vehicleUpdated = vehicleUpdateResp.value;

    const usersToAccept = usersWating.filter(user =>
      user.requeriments.every(userReqObjId =>
        vehicleUpdated.requeriments.find(vehicleReqObjId => vehicleReqObjId.equals(userReqObjId))
      )
    );

    handleCommonResponse(res, { usersToAccept });
  } catch (error) {
    handleCommonError(res, error);
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
    handleCommonError(res, error);
  }
};

/**
 * Acepta al usuario para viajar
 * @param {*} req
 * @param {*} res
 */
const acceptUser = async (req, res) => {
  try {
    const { vehicleId, userId, userSocketId } = req.body;

    const userObjectId = ObjectID(userId);
    const vehicleObjectId = ObjectID(vehicleId);

    const Vehicle = new CollectionsFactory(classes.VEHICLE);
    const User = new CollectionsFactory(classes.USER);
    const updateVehicleQuery = Vehicle.update(
      true,
      { _id: vehicleObjectId },
      { $push: { usersUp: userObjectId } },
      { returnOriginal: false }
    );

    const updateUserQuery = User.update(true, { _id: userObjectId }, { $set: { avaible: false } });

    const [vehicleUpdateResp] = await Promise.all([updateVehicleQuery, updateUserQuery]);

    const { value: vehicleUpdated } = vehicleUpdateResp;

    const travelInfo = `Felicitaciones, el vehiculo "${vehicleUpdated.name}" ha aceptado tu viaje!!`;
    socketSendMessage(userSocketId, channels.USER_LISTENING_FOR_TRAVEL, travelInfo);
    handleCommonResponse(res, { ok: 'ok' });
  } catch (error) {
    handleCommonError(res, error);
  }
};

/**
 * Limpia todos los usuarios conectados
 * @param {*} req
 * @param {*} res
 */
const cleanAllVehicles = async (req, res) => {
  try {
    //TODO: habria que cortar todas las conexiones de socket. A modo de simplificacion solo limpio los usuarios

    const Vehicle = new CollectionsFactory(classes.VEHICLE);

    await Vehicle.update(
      false,
      {},
      { $set: { used: false, usersUp: [], socketId: '', notAllowedUsers: [] } }
    );

    handleCommonResponse(res, { ok: 'ok' });
  } catch (error) {
    handleCommonError(res, error);
  }
};

module.exports = {
  getVehicles,
  notUsedAnymore,
  setVehicleSearchingTravel,
  acceptUser,
  cleanAllVehicles
};
