class Requirements {
  constructor(db) {
    return db.collection('requeriments');
  }
}

module.exports = Requirements;
