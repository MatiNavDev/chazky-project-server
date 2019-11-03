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

  update(one, filters, update, options) {
    update = update || {};
    filters = filters || {};
    options = options || {};

    return one
      ? this.collection.findOneAndUpdate(filters, update, options)
      : this.collection.updateMany(filters, update, options);
  }

  notUsedAnymore(_id, update) {
    const filter = { _id };
    const options = { returnOriginal: true };

    return this.update(true, filter, update, options);
  }
}

const classes = {
  USER: 'user',
  VEHICLE: 'vehicle',
  REQUERIMENT: 'requeriment'
};

module.exports = { CollectionsFactory, classes };
