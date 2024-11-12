const express = require('express');
const reservationController = require('../controllers/reservations');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');

router.get('/reservations', isAuth, reservationController.getAllReservations);

router.get('/catways/:id/reservations', isAuth, reservationController.getReservationsByCatway);

router.get('/catways/:id/reservations/get-add', isAuth, reservationController.getAddReservation);

router.post('/catways/:id/reservations', isAuth, reservationController.addReservation);

router.delete('/catways/:id/reservations/:idReservation', isAuth, reservationController.deleteReservation);

router.get('/catway/:id/reservation/:idReservation', isAuth, reservationController.getReservationById);

module.exports = router;