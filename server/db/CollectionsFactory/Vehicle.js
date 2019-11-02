class Vehicle {
  constructor(db) {
    this.collection = db.collection('vehicles');
    return this.collection;
  }

  /**
   * Setea un Vehiculo como si no estuviera usado
   * @param {*} _id
   */
  notUsedAnymore(_id) {
    const filter = { _id };
    const update = {
      $set: {
        used: false,
        socket: null,
        userUp: false,
        userUpSharesVehicle: true,
        notAllowedUsers: []
      }
    };

    const options = { returnOriginal: true };

    return this.collection.findOneAndUpdate(id, filter, update, options);
  }
}

module.exports = Vehicle;
