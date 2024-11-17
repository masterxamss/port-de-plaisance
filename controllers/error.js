/**
 * @module controllers/error
 * @description Renders the 404 error page.
 *
 */

/**
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function to call.
 *
 * @returns {void} - Renders the 404 page with a 404 status code.
 *
 * @example
 * // Usage:
 * router.get('/404', errorController.get404);
 */
exports.get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn
  });
};
