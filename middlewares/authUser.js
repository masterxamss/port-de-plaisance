const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }

    const user = await User.findById(req.session.user._id);
    if (user) {
      req.user = user;
    }
  } catch (error) {
    console.log(error);
  }
  next();
};
