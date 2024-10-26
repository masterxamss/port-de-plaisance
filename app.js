const express = require('express');
const connectDB = require('./config/database');

const catwayRoutes = require('./routes/catwayRoutes');

const app = express();

// Conecta ao MongoDB
connectDB();

// Middleware para o parsing de JSON
app.use(express.json());

// Rotas aqui...
app.use(catwayRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
