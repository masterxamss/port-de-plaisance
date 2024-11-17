/**
 * @file Main entry point for the application.
 * Sets up middleware and routes.
 * Connects to the database and configures view engine.
 */

// Import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const session = require('./middlewares/sessionConfig');
const csrfProtection = require('./middlewares/csrfProtection');
const authUser = require('./middlewares/authUser');
const locals = require('./middlewares/setLocals');
const basicMiddlewares = require('./middlewares/basicMiddlewares');

// Import route handlers
const catwayRoutes = require('./routes/catway');
const reservationRoutes = require('./routes/reservations');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');

// Import 404 page not found controller
const errorController = require('./controllers/error');

// Create an Express application
const app = express();

/**
 * Connects to the database.
 */
connectDB();

/**
 * Sets the view engine and views directory for the application.
 */
app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('trust proxy', 1);


/**
 * Configures middleware for the application.
 */
basicMiddlewares(app);                    // Configures basic middleware
app.use(session);                         // Configures session
app.use(cookieParser('secrect-key'));     // Parses cookies with a secret key
app.use(csrfProtection);                  // Adds CSRF protection
app.use(require('connect-flash')());      // Enables flash messages
app.use(authUser);                        // Authenticates the user
app.use(locals);                          // Sets local variables

/**
 * Mounts route handlers.
 */
app.use(homeRoutes);                      // Handles home routes
app.use(catwayRoutes);                    // Handles catway-related routes
app.use(reservationRoutes);               // Handles reservation-related routes
app.use('/users', usersRoutes);           // Handles user-related routes
app.use('/auth', authRoutes);             // Handles authentication-related routes

app.use(errorController.get404);          // Handles 404 page

module.exports = app;

/**
 * @global
 * @constant {number} DEFAULT_PORT
 * Starts the server on the specified port.
 */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));







































// const path = require('path');
// const express = require('express');
// const connectDB = require('./config/database');
// const bodyParser = require('body-parser');
// const flash = require('connect-flash');
// const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);
// const methodOverride = require('method-override');

// const catwayRoutes = require('./routes/catway');
// const reservationRoutes = require('./routes/reservations');
// const usersRoutes = require('./routes/users');
// const authRoutes = require('./routes/auth');
// const homeRoutes = require('./routes/home');

// const User = require('./models/user');
// const errorController = require('./controllers/error');

// const app = express();
// const store = new MongoDBStore({
//   uri: process.env.MONGO_URI,
//   collection: 'sessions'
// });

// connectDB();

// app.use(express.json());

// app.set('view engine', 'ejs');
// app.set('views', 'views');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(methodOverride('_method'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(
//   session({
//     secret: process.env.JWT_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 2
//     }
//   })
// );
// app.use(flash());
// app.use(async (req, res, next) => {
//   try{
//     if (!req.session.user) {
//       return next();
//     }

//     const user = await User.findById(req.session.user._id);
//     if (user){
//       req.user = user;
      
//     }
//   } catch(error){
//     console.log(error);
//   }
//   next();
// });

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   res.locals.user = req.user;
//   //res.locals.csrfToken = req.csrfToken();
//   next();
// });


// app.use(homeRoutes);
// app.use(catwayRoutes);
// app.use(reservationRoutes);
// app.use('/users', usersRoutes);
// app.use('/auth', authRoutes);

// app.use(errorController.get404);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
