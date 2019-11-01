class User {
  constructor(db) {
    return db.collection('users');
  }
}

module.exports = User;
