/**
 * @module middlewares/is-auth
 * @description Middleware function that verifies the JWT token from the cookies, and refreshes it if valid.
 * 
 * This middleware checks if a token is present in the cookies. If the token is valid, it decodes it and 
 * generates a new token with the same user data, setting it as a cookie in the response.
 * If the token is invalid or missing, it redirects the user to the login page.
 * 
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
const jwt = require("jsonwebtoken");
/**
 * @constant SECRET_KEY - A secret key used to sign and verify JWT tokens.
 */
const SECRET_KEY = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  let token = req.cookies.token;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {                     // Verify the JWT token
      if (err) {                                                          // Token is invalid
        return res.status(401).json({ message: "Invalid token" });
      } else {
        req.decoded = decoded;                                            // Token is valid, set the decoded user information

        const expireIn = 24 * 60 * 60;                                    // Define the expiration time for the new token (24 hours)

        const newToken = jwt.sign(                                        // Create a new JWT token with the user information from the decoded token
          {
            user: decoded.user
          },
          SECRET_KEY,
          {
            expiresIn: expireIn
          }
        );

        res.cookie("token", newToken, {                                   // Set the new token in the cookies for the client
          httpOnly: true,                                                 // Ensure the cookie is accessible only via HTTP (not client-side JavaScript)
          secure: process.env.NODE_ENV === "production",                  // Only set the cookie securely in production
          sameSite: "Strict",                                             // Prevent the cookie from being sent in cross-origin requests
          maxAge: expireIn * 1000                                         // Expiration time for the cookie in milliseconds
        });

        next();                                                           // Proceed to the next middleware                          
      }
    });
  } else {
    return res.redirect("/auth/login");                                   // If no token is found, redirect to the login page
  }
};

