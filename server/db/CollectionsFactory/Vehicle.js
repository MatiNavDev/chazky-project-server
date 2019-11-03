class Vehicle {
  constructor(db) {
    this.collection = db.collection('vehicles');
    return this.collection;
  }
}

module.exports = Vehicle;
