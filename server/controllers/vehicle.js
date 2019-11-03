const { ObjectID } = require('mongodb');

const { CollectionsFactory, classes } = require('../db/CollectionsFactory');
const { handleCommonError, handleCommonResponse } = require('../helpers/responses');
const { socketDisconnectSpecificUser, socketSendMessage, channels } = require('../helpers/socket');

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

    socketSendMessage(null, channels.REFRESH_VEHICLES);
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

    const updateObj = {
      $set: {
        used: false,
        socket: null,
        userUp: [],
        notAllowedUsers: []
      }
    };

    const Vehicle = new CollectionsFactory(classes.VEHICLE);
    const { value: vehiclePreviousUpdate } = await Vehicle.notUsedAnymore(ObjectID(id), updateObj);

    if (!vehiclePreviousUpdate.usersUp.length) return handleCommonResponse(res, { ok: 'ok' });

    const User = new CollectionsFactory(classes.USER);

    const users = await Promise.all(
      vehiclePreviousUpdate.usersUp.map(userId =>
        User.update(true, { _id: userId }, { $set: { used: false } })
      )
    );
    users.forEach(user => socketDisconnectSpecificUser(user.socketId));

    handleCommonResponse(res, { ok: 'ok' });
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

    const [vehicleUpdateResp, userUpdatedResp] = await Promise.all([
      updateVehicleQuery,
      updateUserQuery
    ]);

    const { value: vehicleUpdated } = vehicleUpdateResp;
    const { value: userUpdated } = userUpdatedResp;

    const travelInfo = `Felicitaciones, el vehiculo "${vehicleUpdated.name}" ha aceptado tu viaje!!`;
    socketSendMessage(userSocketId, channels.USER_LISTENING_FOR_TRAVEL, travelInfo);
    socketSendMessage(null, channels.VEHICLE_REMOVE_TRAVELLING_USER, userId);

    handleCommonResponse(res, { shareVehicle: userUpdated.shareVehicle });
  } catch (error) {
    handleCommonError(res, error);
  }
};

/**
 * Maneja que el vehiculo rechaze un usuario agregandolo a la lista de usuarios no deseados
 * @param {*} req
 * @param {*} res
 */
const rejectUser = async (req, res) => {
  try {
    const { userId, vehicleId } = req.body;

    const Vehicle = new CollectionsFactory(classes.VEHICLE);

    const { value: vehicleUpdated } = await Vehicle.update(
      true,
      { _id: ObjectID(vehicleId) },
      { $push: { notAllowedUsers: ObjectID(userId) } },
      { returnOriginal: false }
    );

    handleCommonResponse(res, { vehicleUpdated });
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
  rejectUser,
  cleanAllVehicles
};
