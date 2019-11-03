class User {
  constructor(db) {
    return db.collection('users');
  }

  /**
   * Devuelve las variables para actualizar cuando no se utiliza mas
   */
  getNotUsedAnymoreUpdateObject() {
    return {
      $set: {
        avaible: true,
        used: false,
        socket: null,
        requeriments: []
      }
    };
  }
}

module.exports = User;
