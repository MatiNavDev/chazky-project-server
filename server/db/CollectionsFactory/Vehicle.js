class Vehicle {
  constructor(db) {
    return db.collection('vehicles');
  }
}

module.exports = Vehicle;
