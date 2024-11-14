const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

/**
 * @module is-auth
 * 
 * @description Middleware function that verifies the JWT token from the cookies, and refreshes it if valid.
 * 
 * This middleware checks if a token is present in the cookies. If the token is valid, it decodes it and 
 * generates a new token with the same user data, setting it as a cookie in the response.
 * If the token is invalid or missing, it redirects the user to the login page.
 * @function
 * @param {Object} req - The request object containing the incoming HTTP request.
 * @param {Object} res - The response object used to send a response back to the client.
 * @param {Function} next - The next middleware function to call after the current one completes.
 * 
 * @returns {void} - This function does not return anything but either continues the request cycle or redirects.
 * 
 * @example
 * // This middleware can be used to protect routes that require authentication.
 * app.use('/dashboard', isAuth);
 */
module.exports = async (req, res, next) => {
  let token = req.cookies.token;
  
  if (token) {
    // Verify the JWT token
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        // Token is invalid
        return res.status(401).json({ message: "Invalid token" });
      } else {
        // Token is valid, set the decoded user information
        req.decoded = decoded;

        // Define the expiration time for the new token (24 hours)
        const expireIn = 24 * 60 * 60;

        // Create a new JWT token with the user information from the decoded token
        const newToken = jwt.sign(
          {
            user: decoded.user
          },
          SECRET_KEY,
          {
            expiresIn: expireIn
          }
        );

        // Set the new token in the cookies for the client
        res.cookie("token", newToken, {
          httpOnly: true, // Ensure the cookie is accessible only via HTTP (not client-side JavaScript)
          secure: process.env.NODE_ENV === "production", // Only set the cookie securely in production
          sameSite: "Strict", // Prevent the cookie from being sent in cross-origin requests
          maxAge: expireIn * 1000 // Expiration time for the cookie in milliseconds
        });

        // Proceed to the next middleware or route handler
        next();
      }
    });
  } else {
    // If no token is found, redirect to the login page
    return res.redirect("/auth/login");
  }
};

