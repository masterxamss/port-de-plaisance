const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const session = require('./middlewares/session');
const csrfProtection = require('./middlewares/csrfProtection');
const authUser = require('./middlewares/authUser');
const locals = require('./middlewares/locals');
const basicMiddlewares = require('./middlewares/basicMiddlewares');

const catwayRoutes = require('./routes/catway');
const reservationRoutes = require('./routes/reservations');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');
const errorController = require('./controllers/error');

const app = express();

connectDB();

app.set('view engine', 'ejs');
app.set('views', 'views');

basicMiddlewares(app); // Configura middlewares básicos
app.use(session);       // Configura a sessão
app.use(cookieParser('secrect-key'));
app.use(csrfProtection); // Configura o middleware CSRF
app.use(require('connect-flash')()); // Flash messages
app.use(authUser);      // Autentica o utilizador
app.use(locals);        // Configura variáveis locais

app.use(homeRoutes);
app.use(catwayRoutes);
app.use(reservationRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

app.use(errorController.get404);

const PORT = process.env.PORT || 5000;
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
