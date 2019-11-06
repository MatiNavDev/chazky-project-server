const { ObjectID } = require('mongodb');

const { CollectionsFactory, classes } = require('../db/CollectionsFactory');
const { handleCommonError, handleCommonResponse } = require('../helpers/responses');
const { socketSendMessage, restartConnections, channels } = require('../helpers/socket');

/**
 * Devuelve el listado de usuarios que no se encuentren utilizados
 * @param {*} req
 * @param {*} res
 */
const getUsers = async (req, res) => {
  try {
    const User = new CollectionsFactory(classes.USER);
    const users = await User.find(false, { used: false }, {}, { name: 1, shareVehicle: 1 });
    handleCommonResponse(res, { users });
  } catch (error) {
    handleCommonError(res, error);
  }
};

const setUserSearchingTravel = async (req, res) => {
  try {
    const {
      socketId,
      requerimentsSelecteds,
      shareTravel: shareVehicle,
      user,
      latitude,
      longitude,
      maxDistance
    } = req.body;

    const requeriments = requerimentsSelecteds.map(req => ObjectID(req));

    const User = new CollectionsFactory(classes.USER);
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    };
    const userUpdated = await User.update(
      true,
      { _id: ObjectID(user) },
      {
        $set: { socketId, requeriments, shareVehicle, used: true, location, maxDistance }
      },
      { returnOriginal: false }
    );

    const Vehicle = new CollectionsFactory(classes.VEHICLE);
    const vehiclesConditions = {
      used: true,
      notAllowedUsers: { $nin: [ObjectID(user)] },
      requeriments,
      userUpSharesVehicle: true
    };

    if (requeriments.length) vehiclesConditions.requeriments = { $all: requeriments };

    let matchForShareVehicle;
    if (shareVehicle) {
      // si desea compartir vehiculo
      matchForShareVehicle = {
        $or: [{ 'users.0': { $exists: false } }, { 'users.shareVehicle': true }]
      };
    } else {
      // si no desea compartir vehiculo
      matchForShareVehicle = { 'users.0': { $exists: false } };
    }

    // Busca vehiculos que esten conectados, esten cerca, y que si tienen usuarios arriba
    // los mismos compartan viaje
    const vehicles = await Vehicle.collection
      .aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            maxDistance: maxDistance || 1,
            query: {
              used: true,
              notAllowedUsers: { $nin: [ObjectID(user)] }
            },
            distanceField: 'locationDistance'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'usersUp',
            foreignField: '_id',
            as: 'users'
          }
        },
        { $match: matchForShareVehicle }
      ])
      .toArray();

    if (vehicles.length) {
      vehicles.forEach(v => {
        socketSendMessage(v.socketId, channels.VEHICLE_LISTENING_FOR_TRAVEL, userUpdated.value);
      });
    }

    socketSendMessage(null, channels.REFRESH_USERS);
    handleCommonResponse(res, { element: userUpdated.value });
  } catch (error) {
    handleCommonError(res, error);
  }
};

/**
 * Se encarga de setear que un usuario ya no esta disponible.
 * Si tiene vehiculo que lo tiene arriba, cancela el viaje.
 * @param {*} req
 * @param {*} res
 */
const notUsedAnymore = async (req, res) => {
  try {
    const { id } = req.body;

    const userObjectId = ObjectID(id);

    const User = new CollectionsFactory(classes.USER);
    const Vehicle = new CollectionsFactory(classes.VEHICLE);

    const updateObj = {
      $set: {
        avaible: true,
        used: false,
        socket: null,
        requeriments: []
      }
    };

    const updateUserQuery = User.notUsedAnymore(userObjectId, updateObj);
    const updateVehicleQuery = Vehicle.update(
      true,
      { usersUp: userObjectId },
      { $pull: { usersUp: userObjectId } }
    );

    const [userUpdatedResp] = await Promise.all([updateUserQuery, updateVehicleQuery]);

    const userUpdated = userUpdatedResp.value;
    socketSendMessage(userUpdated.socketId, channels.REFRESH_USERS, id);
    socketSendMessage(null, channels.VEHICLE_REMOVE_TRAVELLING_USER, id);
    handleCommonResponse(res, { ok: 'ok' });
  } catch (error) {
    handleCommonError(res, error);
  }
};

/**
 * Limpia todos los usuarios conectados.
 * Este controlador se encargara de limpiar las conexiones del socket
 * @param {*} req
 * @param {*} res
 */
const cleanAllUsers = async (req, res) => {
  try {
    //TODO: habria que cortar todas las conexiones de socket. A modo de simplificacion solo limpio los usuarios

    const User = new CollectionsFactory(classes.USER);

    await User.update(false, {}, { $set: { used: false, avaible: true, socketId: '' } });

    restartConnections();
    handleCommonResponse(res, { ok: 'ok' });
  } catch (error) {
    handleCommonError(res, error);
  }
};
module.exports = {
  getUsers,
  setUserSearchingTravel,
  notUsedAnymore,
  cleanAllUsers
};
