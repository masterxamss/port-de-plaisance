const moment = require('moment');

const Reservation = require('../models/reservations');


exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    const error = req.flash('error');
    const success = req.flash('success');
    return res.render('reservations/reservations-list', {
      reservations: reservations,
      path: '/reservations',
      pageTitle: 'Reservations',
      moment: moment,
      error: error,
      success: success
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Une erreur s\'est produite lors de l\'obtention des reservations');
    return res.redirect('/dashboard');
  }
};



exports.getReservationsByCatway = async (req, res) => {
  const { id } = req.params;
  const error = req.flash('error');
  const success = req.flash('success');

  try {
    const reservations = await Reservation.find({ catwayNumber: id});
    if (!reservations.length) {
      req.flash('error', 'Aucunne reservation pour ce catway');
      return res.redirect('/catways/get-catway/' + id);
    }
    return res.render('reservations/reservation-by-catway', {
      reservations: reservations,
      path: '/reservations',
      pageTitle: 'Reservations',
      moment: moment,
      catwayNumber: id,
      error: error,
      success: success
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Erreur dans l\'obtention des réservations');
    return res.redirect('/catways/get-catway/' + id);
  }
};

exports.getAddReservation = async (req, res) => {
  const error = req.flash('error');
  const success = req.flash('success');
  const catwayNumber = req.params.id;
  const reservations = await Reservation.find();
  try {
    res.render('reservations/add-reservation', {
      pageTitle: 'Ajout réservation',
      path: '/reservations',
      error: error,
      success: success,
      catwayNumber: catwayNumber,
      reservations: reservations,
      moment: moment
    })  
  }
  catch(error){
    console.log(error);
    req.flash('error', 'Une erreur s\'est produite lors de l\'ajout de la reservation');
    return res.redirect('/catways/list');
  }
};

exports.addReservation = async (req, res) => {
  const { client_name, boat_name, check_in, check_out } = req.body;
  const catway_number = req.params.id;

  try {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!catway_number || !client_name || !boat_name || !check_in || !check_out) {
      req.flash('error', 'Veuillez renseigner tous les champs');
      return res.redirect('/catways/' + catway_number + '/reservations/get-add');
    }

    // Converte as datas para objetos Date
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    // Verifica se as datas são válidas
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      req.flash('error', 'Dates invalides.');
      return res.redirect('/catways/' + catway_number + '/reservations/get-add');
    }

    // Verifica se já existe uma reserva que se sobreponha às datas fornecidas
    const existingReservation = await Reservation.findOne({
      catwayNumber: catway_number,
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    });

    if (existingReservation) {
      req.flash('error', 'Une réservation existe déjà pour cette période.');
      return res.redirect('/catways/' + catway_number + '/reservations/get-add');
    }

    // Cria e salva a nova reserva
    const reservation = new Reservation({
      catwayNumber: catway_number,
      clientName: client_name,
      boatName: boat_name,
      checkIn: checkInDate,
      checkOut: checkOutDate
    });
    
    await reservation.save();
    req.flash('success', 'Reservation ajoute avec succès');
    return res.redirect('/catways/list');
  } catch (error) {
    console.log(error);
    req.flash('error', 'Une erreur s\'est produite lors de l\'ajout de la reservation');
    return res.redirect('/catways/list');
  }
};

exports.deleteReservation = async (req, res) => {
  const catwayNumber = req.params.id;
  const idReservation = req.params.idReservation;

  try {
    const deletedReservation = await Reservation.findByIdAndDelete(idReservation);
    if (!deletedReservation) {
      req.flash('error', 'Cette reservation n\'existe pas');
      return res.redirect('/catways/'+ catwayNumber + '/reservations');
    }

    const reservations = await Reservation.find({ catwayNumber: catwayNumber });
    if (!reservations.length) {
      req.flash('success', 'Réservation supprimé avec succès');
      return res.redirect('/catways/reservations');
    } else {
      req.flash('success', 'Reservation supprimé avec succès');
      return res.redirect('/catways/'+ catwayNumber + '/reservations');  
    }
      
  } catch (error) {
      req.flash('error', 'Une erreur s\'est produite lors de la suppression de la reservation');
      return res.redirect('/catways/'+ catwayNumber + '/reservations');
  }
};

exports.getReservationById = async (req, res) => {
  const { id, idReservation } = req.params;

  try{
    const reservation = await Reservation.findOne({ catwayNumber: id, _id: idReservation });
    if (!reservation) {
      req.flash('error', 'Cette reservation n\'existe pas');
      return res.redirect('/catways/'+ id + '/reservations');
    }
    return res.render('reservations/reservation', {
      reservation: reservation,
      path: '/reservations',
      pageTitle: 'Reservation',
      moment: moment
    });
  }
  catch(error){
    console.log(error);
    req.flash('error', 'Une erreur s\'est produite lors de l\'obtention de la reservation');
    return res.redirect('/catways/'+ id + '/reservations');
  }
}

























