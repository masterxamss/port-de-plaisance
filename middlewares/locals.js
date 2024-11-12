module.exports = (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.user = req.user;

  if (req.csrfToken) {
    res.locals.csrfToken = req.csrfToken();
  }
  next();
};
