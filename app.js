const express = require('express');
const connectDB = require('./config/database');
const bodyParser = require('body-parser');

const catwayRoutes = require('./routes/catway');
const reservationRoutes = require('./routes/reservations');
const usersRoutes = require('./routes/users');

const app = express();



// Conecta ao MongoDB
connectDB();

// Middleware para o parsing de JSON
app.use(express.json());

// Rotas aqui...
app.use(catwayRoutes);
app.use(reservationRoutes);
app.use(usersRoutes);

app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
