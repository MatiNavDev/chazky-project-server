const { getDB } = require('../init');

const RegisteredCollections = require('./registeredCollections');

class CollectionsFactory {
  /**
   * @param {string} type
   */
  constructor(type) {
    this.collection = new RegisteredCollections[type](getDB());
  }

  /**
   *
   * @param {boolean} one
   * @param {object} filters
   * @param {object} options
   */
  find(one, filters, options) {
    filters = filters || {};
    options = options || {};

    return one
      ? this.collection.findOne(filters, options)
      : this.collection.find(filters, options).toArray();
  }
}

const classes = {
  USER: 'user',
  VEHICLE: 'vehicle',
  REQUERIMENT: 'requeriment'
};

module.exports = { CollectionsFactory, classes };
