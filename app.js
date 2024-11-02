const path = require('path');
const express = require('express');
const connectDB = require('./config/database');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const methodOverride = require('method-override');

const catwayRoutes = require('./routes/catway');
const reservationRoutes = require('./routes/reservations');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');

const User = require('./models/user');
const errorController = require('./controllers/error');

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
});

// Conecta ao MongoDB
connectDB();

// Middleware para o parsing de JSON
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(flash());
app.use(async (req, res, next) => {
  try{
    if (!req.session.user) {
      return next();
    }

    const user = await User.findById(req.session.user._id);
    if (user){
      req.user = user;
      
    }
  } catch(error){
    console.log(error);
  }
  next();
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.user = req.user;
  //res.locals.csrfToken = req.csrfToken();
  next();
});



// Rotas aqui...
app.use(homeRoutes);
app.use('/catways', catwayRoutes);
app.use(reservationRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

app.use(errorController.get404);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
