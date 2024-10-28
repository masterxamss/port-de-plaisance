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

// Rotas aqui...
app.use(catwayRoutes);
app.use(reservationRoutes);
app.use(usersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
