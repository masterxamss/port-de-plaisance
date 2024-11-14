const User = require('../models/user');

/**
 * @module authUser
 * 
 * @description Middleware function that verifies the user session and sets the req.user property.
 * 
 * This middleware checks if the user is logged in by verifying the session. If the session is valid, 
 * it retrieves the user document from the database using the user's ID stored in the session 
 * and assigns it to `req.user`. If no session exists or the session is invalid, 
 * it calls `next()` to continue the request cycle.
 * 
 * This middleware is useful for routes that require user authentication and access to user data.
 * 
 * @function
 * @param {Object} req - The request object containing the incoming HTTP request. 
 * It may have a `session` property that stores the user's session data.
 * @param {Object} res - The response object used to send a response back to the client.
 * @param {Function} next - The next middleware function to call after the current one completes.
 * 
 * @returns {void} - This function does not return anything but either continues the request cycle or redirects.
 * 
 * @example
 * // Usage example
 * // This middleware can be used to ensure that the user is authenticated
 * // before accessing a protected route like a dashboard.
 * app.use('/dashboard', authUser, (req, res) => {
 *   if (req.user) {
 *     res.render('dashboard', { user: req.user });
 *   } else {
 *     res.redirect('/login');
 *   }
 * });
 */
module.exports = async (req, res, next) => {
  try {
    // If there is no user session, continue the request cycle
    if (!req.session.user) {
      return next();
    }

    // Find the user by the ID stored in the session
    const user = await User.findById(req.session.user._id);
    
    // If user exists, assign the user document to req.user
    if (user) {
      req.user = user;
    }
  } catch (error) {
    console.log(error);
  }

  // Continue to the next middleware or route handler
  next();
};

