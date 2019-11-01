const { CollectionsFactory, classes } = require('../db/CollectionsFactory');

const getUsers = async (req, res) => {
  try {
    const User = new CollectionsFactory(classes.USER);
    const users = await User.find();
    res.send({ users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
    //TODO: handleError
  }
};

module.exports = {
  getUsers
};
