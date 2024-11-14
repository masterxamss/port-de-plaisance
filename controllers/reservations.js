/**
 * @module Reservations-controller
 * @description Controller for managing reservations. Handles operations like viewing, adding, and deleting reservations.
 */

const moment = require("moment");
const Reservation = require("../models/reservations");

/**
 * Retrieves all reservations and renders the reservations list view.
 *
 * @function getAllReservations
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Renders the reservations list view with the reservations data.
 * @throws {Error} If there is an error fetching the reservations.
 *
 * @example
 * // Example usage in an Express route:
 * app.get('/reservations', getAllReservations);
 */
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    const error = req.flash("error");
    const success = req.flash("success");

    return res.render("reservations/reservations-list", {
      reservations: reservations,
      path: "/reservations",
      pageTitle: "Reservations",
      moment: moment,
      error: error,
      success: success
    });
  } catch (error) {
    console.error(error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de l'obtention des reservations"
    );
    return res.redirect("/dashboard");
  }
};

/**
 * Retrieves reservations for a specific catway and renders the view.
 *
 * @function getReservationsByCatway
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Renders the reservations by catway view.
 * @throws {Error} If there is an error fetching the reservations.
 *
 * @example
 * // Example usage in an Express route:
 * app.get('/catways/:id/reservations', getReservationsByCatway);
 */
exports.getReservationsByCatway = async (req, res) => {
  const { id } = req.params;
  const error = req.flash("error");
  const success = req.flash("success");

  try {
    const reservations = await Reservation.find({ catwayNumber: id });
    if (!reservations.length) {
      req.flash("error", "Aucunne reservation pour ce catway");
      return res.redirect("/catways/" + id);
    }
    return res.render("reservations/reservation-by-catway", {
      reservations: reservations,
      path: "/reservations",
      pageTitle: "Reservations",
      moment: moment,
      catwayNumber: id,
      error: error,
      success: success
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Erreur dans l'obtention des réservations");
    return res.redirect("/catways/" + id);
  }
};

/**
 * Renders the form to add a new reservation for a specific catway.
 *
 * @function getAddReservation
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Renders the add reservation form.
 * @throws {Error} If there is an error rendering the form.
 *
 * @example
 * // Example usage in an Express route:
 * app.get('/catways/:id/reservations/get-add', getAddReservation);
 */
exports.getAddReservation = async (req, res) => {
  const error = req.flash("error");
  const success = req.flash("success");
  const catwayNumber = req.params.id;
  const reservations = await Reservation.find();
  try {
    res.render("reservations/add-reservation", {
      pageTitle: "Ajout réservation",
      path: "/reservations",
      error: error,
      success: success,
      catwayNumber: catwayNumber,
      reservations: reservations,
      moment: moment
    });
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de l'ajout de la reservation"
    );
    return res.redirect("/catways");
  }
};

/**
 * Adds a new reservation for a specific catway.
 *
 * @function addReservation
 * @async
 * @param {Object} req - The request object containing reservation details.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Redirects after successfully adding a reservation.
 * @throws {Error} If there is an error while adding the reservation.
 *
 * @example
 * // Example usage in an Express route:
 * app.post('/catways/:id/reservations', addReservation);
 */
exports.addReservation = async (req, res) => {
  const { client_name, boat_name, check_in, check_out } = req.body;
  const catway_number = req.params.id;

  try {
    if (
      !catway_number ||
      !client_name ||
      !boat_name ||
      !check_in ||
      !check_out
    ) {
      req.flash("error", "Veuillez renseigner tous les champs");
      return res.redirect(
        "/catways/" + catway_number + "/reservations/get-add"
      );
    }

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      req.flash("error", "Dates invalides.");
      return res.redirect(
        "/catways/" + catway_number + "/reservations/get-add"
      );
    }

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
      req.flash("error", "Une réservation existe déjà pour cette période.");
      return res.redirect(
        "/catways/" + catway_number + "/reservations/get-add"
      );
    }

    const reservation = new Reservation({
      catwayNumber: catway_number,
      clientName: client_name,
      boatName: boat_name,
      checkIn: checkInDate,
      checkOut: checkOutDate
    });

    await reservation.save();
    req.flash("success", "Reservation ajoute avec succès");
    return res.redirect("/catways");
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de l'ajout de la reservation"
    );
    return res.redirect("/catways");
  }
};

/**
 * Deletes a specific reservation by its ID.
 *
 * @function deleteReservation
 * @async
 * @param {Object} req - The request object containing reservation and catway identifiers.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Redirects after successfully deleting a reservation.
 * @throws {Error} If there is an error while deleting the reservation.
 *
 * @example
 * // Example usage in an Express route:
 * app.delete('/catways/:catwayNumber/reservations/:idReservation', deleteReservation);
 */
exports.deleteReservation = async (req, res) => {
  const catwayNumber = req.params.id;
  const idReservation = req.params.idReservation;

  try {
    const deletedReservation = await Reservation.findByIdAndDelete(
      idReservation
    );
    if (!deletedReservation) {
      req.flash("error", "Cette reservation n'existe pas");
      return res.redirect("/catways/" + catwayNumber + "/reservations");
    }

    const reservations = await Reservation.find({ catwayNumber: catwayNumber });
    if (!reservations.length) {
      req.flash("success", "Réservation supprimé avec succès");
      return res.redirect("/reservations");
    } else {
      req.flash("success", "Reservation supprimé avec succès");
      return res.redirect("/catways/" + catwayNumber + "/reservations");
    }
  } catch (error) {
    req.flash(
      "error",
      "Une erreur s'est produite lors de la suppression de la reservation"
    );
    return res.redirect("/catways/" + catwayNumber + "/reservations");
  }
};

/**
 * Retrieves a reservation by its ID for viewing.
 *
 * @function getReservationById
 * @async
 * @param {Object} req - The request object containing reservation and catway identifiers.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Renders the reservation details view.
 * @throws {Error} If there is an error fetching the reservation.
 *
 * @example
 * // Example usage in an Express route:
 * app.get('/catways/:id/reservations/:idReservation', getReservationById);
 */
exports.getReservationById = async (req, res) => {
  const { id, idReservation } = req.params;

  try {
    const reservation = await Reservation.findOne({
      catwayNumber: id,
      _id: idReservation
    });
    if (!reservation) {
      req.flash("error", "Cette reservation n'existe pas");
      return res.redirect("/catways/" + id + "/reservations");
    }
    return res.render("reservations/reservation", {
      reservation: reservation,
      path: "/reservations",
      pageTitle: "Details de la reservation",
      moment: moment
    });
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "Erreur lors de l'obtention des détails de la reservation"
    );
    return res.redirect("/catways/" + id + "/reservations");
  }
};

// const moment = require('moment');

// const Reservation = require('../models/reservations');

// exports.getAllReservations = async (req, res) => {
//   try {
//     const reservations = await Reservation.find();
//     const error = req.flash('error');
//     const success = req.flash('success');

//     return res.render('reservations/reservations-list', {
//       reservations: reservations,
//       path: '/reservations',
//       pageTitle: 'Reservations',
//       moment: moment,
//       error: error,
//       success: success
//     });
//   } catch (error) {
//     console.error(error);
//     req.flash('error', 'Une erreur s\'est produite lors de l\'obtention des reservations');
//     return res.redirect('/dashboard');
//   }
// };

// exports.getReservationsByCatway = async (req, res) => {
//   const { id } = req.params;
//   const error = req.flash('error');
//   const success = req.flash('success');

//   try {
//     const reservations = await Reservation.find({ catwayNumber: id});
//     if (!reservations.length) {
//       req.flash('error', 'Aucunne reservation pour ce catway');
//       return res.redirect('/catways/' + id);
//     }
//     return res.render('reservations/reservation-by-catway', {
//       reservations: reservations,
//       path: '/reservations',
//       pageTitle: 'Reservations',
//       moment: moment,
//       catwayNumber: id,
//       error: error,
//       success: success
//     });
//   } catch (error) {
//     console.error(error);
//     req.flash('error', 'Erreur dans l\'obtention des réservations');
//     return res.redirect('/catways/' + id);
//   }
// };

// exports.getAddReservation = async (req, res) => {
//   const error = req.flash('error');
//   const success = req.flash('success');
//   const catwayNumber = req.params.id;
//   const reservations = await Reservation.find();
//   try {
//     res.render('reservations/add-reservation', {
//       pageTitle: 'Ajout réservation',
//       path: '/reservations',
//       error: error,
//       success: success,
//       catwayNumber: catwayNumber,
//       reservations: reservations,
//       moment: moment
//     })
//   }
//   catch(error){
//     console.log(error);
//     req.flash('error', 'Une erreur s\'est produite lors de l\'ajout de la reservation');
//     return res.redirect('/catways');
//   }
// };

// exports.addReservation = async (req, res) => {
//   const { client_name, boat_name, check_in, check_out } = req.body;
//   const catway_number = req.params.id;

//   try {
//     if (!catway_number || !client_name || !boat_name || !check_in || !check_out) {
//       req.flash('error', 'Veuillez renseigner tous les champs');
//       return res.redirect('/catways/' + catway_number + '/reservations/get-add');
//     }

//     const checkInDate = new Date(check_in);
//     const checkOutDate = new Date(check_out);

//     if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
//       req.flash('error', 'Dates invalides.');
//       return res.redirect('/catways/' + catway_number + '/reservations/get-add');
//     }

//     const existingReservation = await Reservation.findOne({
//       catwayNumber: catway_number,
//       $or: [
//         {
//           checkIn: { $lt: checkOutDate },
//           checkOut: { $gt: checkInDate }
//         }
//       ]
//     });

//     if (existingReservation) {
//       req.flash('error', 'Une réservation existe déjà pour cette période.');
//       return res.redirect('/catways/' + catway_number + '/reservations/get-add');
//     }

//     const reservation = new Reservation({
//       catwayNumber: catway_number,
//       clientName: client_name,
//       boatName: boat_name,
//       checkIn: checkInDate,
//       checkOut: checkOutDate
//     });

//     await reservation.save();
//     req.flash('success', 'Reservation ajoute avec succès');
//     return res.redirect('/catways');
//   } catch (error) {
//     console.log(error);
//     req.flash('error', 'Une erreur s\'est produite lors de l\'ajout de la reservation');
//     return res.redirect('/catways');
//   }
// };

// exports.deleteReservation = async (req, res) => {
//   const catwayNumber = req.params.id;
//   const idReservation = req.params.idReservation;

//   try {
//     const deletedReservation = await Reservation.findByIdAndDelete(idReservation);
//     if (!deletedReservation) {
//       req.flash('error', 'Cette reservation n\'existe pas');
//       return res.redirect('/catways/'+ catwayNumber + '/reservations');
//     }

//     const reservations = await Reservation.find({ catwayNumber: catwayNumber });
//     if (!reservations.length) {
//       req.flash('success', 'Réservation supprimé avec succès');
//       return res.redirect('/reservations');
//     } else {
//       req.flash('success', 'Reservation supprimé avec succès');
//       return res.redirect('/catways/'+ catwayNumber + '/reservations');
//     }

//   } catch (error) {
//       req.flash('error', 'Une erreur s\'est produite lors de la suppression de la reservation');
//       return res.redirect('/catways/'+ catwayNumber + '/reservations');
//   }
// };

// exports.getReservationById = async (req, res) => {
//   const { id, idReservation } = req.params;

//   try{
//     const reservation = await Reservation.findOne({ catwayNumber: id, _id: idReservation });
//     if (!reservation) {
//       req.flash('error', 'Cette reservation n\'existe pas');
//       return res.redirect('/catways/'+ id + '/reservations');
//     }
//     return res.render('reservations/reservation', {
//       reservation: reservation,
//       path: '/reservations',
//       pageTitle: 'Reservation',
//       moment: moment
//     });
//   }
//   catch(error){
//     console.log(error);
//     req.flash('error', 'Une erreur s\'est produite lors de l\'obtention de la reservation');
//     return res.redirect('/catways/'+ id + '/reservations');
//   }
// }
