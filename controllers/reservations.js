const Reservation = require('../models/reservations');

// Obter todas as reservas
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}


// Obter todas as reservas de um catway específico
exports.getReservationsByCatway = async (req, res) => {
  const { catwayNumber } = req.params;
  try {
    const reservations = await Reservation.find({ catwayNumber: catwayNumber });

    if (!reservations.length) {
      return res.status(404).json({ message: 'Nenhuma reserva encontrada para este catway.' });
    }

    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter reservas.' });
  }
};

// Obter uma reserva específica de um catway específico
exports.getReservationByCatwayAndId = async (req, res) => {
  const { catwayNumber, idReservation } = req.params;
  try {
    const reservation = await Reservation.findOne({
      catwayNumber: catwayNumber,
      _id: idReservation,
    });

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva não encontrada para este catway.' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter a reserva.' });
  }
};

// Criar uma nova reserva
exports.createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Apagar uma reserva existente
exports.deleteReservationByCatwayAndId = async (req, res) => {
  const { catwayNumber, idReservation } = req.params;
  
  try {
    const result = await Reservation.deleteOne({
      catwayNumber: catwayNumber,
      _id: idReservation,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Reserva não encontrada para este catway.' });
    }

    res.status(200).json({ message: 'Reserva apagada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao apagar a reserva.' });
  }
};

