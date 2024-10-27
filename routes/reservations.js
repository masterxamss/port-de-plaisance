const express = require('express');
const reservationController = require('../controllers/reservations');
const router = express.Router();


// Obter todas as reservas
router.get('/reservations', reservationController.getReservations);

// Obter todas as reservas de um catway específico
router.get('/catways/:catwayNumber/reservations', reservationController.getReservationsByCatway);

// Obter uma reserva específica de um catway específico
router.get('/catways/:catwayNumber/reservations/:idReservation', reservationController.getReservationByCatwayAndId);

// Criar uma nova reserva para um catway específico
router.post('/catways/:catwayNumber/reservations', reservationController.createReservation);

// Apagar uma reserva específica de um catway específico
router.delete('/catways/:catwayNumber/reservations/:idReservation', reservationController.deleteReservationByCatwayAndId);


module.exports = router;