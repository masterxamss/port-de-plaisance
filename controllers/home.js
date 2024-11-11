const Catway = require('../models/catway');
const Reservations = require('../models/reservations');
const User = require('../models/user');
const moment = require('moment');

async function calculateOccupancyPercentage() {
  try {
      // Total catways available
      const totalCatways = await Catway.countDocuments();

      if (totalCatways === 0) return 0;  // Prevents division by zero

      // Count of occupied catways with active reservations
      const activeReservations = await Reservations.distinct('catwayNumber', {
          checkOut: { $gt: new Date() }  // Assuming that checkOut indicates the end of the booking
      });

      const ocupiedCatways = activeReservations.length;

      // Calculating the occupancy percentage
      const ocupiedPercentage = (ocupiedCatways / totalCatways) * 100;
      return ocupiedPercentage.toFixed(2);  // Returns the value to two decimal places

  } catch (error) {
      console.error("Error when calculating the occupancy percentage:", error);
      throw error;
  }
}

async function getTotalActiveReserves() {
  try {
      const totalActives = await Reservations.countDocuments({
          checkOut: { $gt: new Date() }
      });
      return totalActives;
  } catch (error) {
      console.error("Error when obtaining total active bookings:", error);
      throw error;
  }
}

async function getNextReservationToExpire() {
  try {
      const nextReservation = await Reservations.findOne({
          checkOut: { $gt: new Date() }
      }).sort({ checkOut: 1 }).exec();

      if (!nextReservation) {
          return null;
      }

      return nextReservation;
  } catch (error) {
      console.error("Error getting the next reservation to expire:", error);
      throw error;
  }
}

async function getRecentBookings(limit = 1) {
  try {
      const recentBookings = await Reservations.find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .exec();

      return recentBookings;
  } catch (error) {
      console.error("Error retrieving recent reservations:", error);
      throw error;
  }
}

async function calculateAverageBookingDuration() {
  try {
      const reservations = await Reservations.find();
      const totalDays = reservations.reduce((acc, reserve) => {
          const duration = (new Date(reserve.checkOut) - new Date(reserve.checkIn)) / (1000 * 60 * 60 * 24);
          return acc + duration;
      }, 0);

      const averageDays = totalDays / reservations.length;
      return averageDays.toFixed(2);
  } catch (error) {
      console.error("Error when calculating the average duration of bookings:", error);
      throw error;
  }
}

async function getCatwaysBookedAndAvailable() {
  try {
      const totalCatways = await Catway.countDocuments();
      const activeReservations = await Reservations.distinct('catwayNumber', {
          checkOut: { $gt: new Date() }
      });

      const ocupiedCatways = activeReservations.length;
      const availableCatways = totalCatways - ocupiedCatways;

      return {
          ocupiedCatways,
          availableCatways
      };
  } catch (error) {
      console.error("Erro ao calcular catways reservados e disponíveis:", error);
      throw error;
  }
}

exports.getHome = (req, res) => {
  res.render('index',{
    pageTitle: 'Accueil',
    path: '/'
  });
};

exports.getDashboard = async(req, res) => {
  try {
    const catways = await Catway.find();
    const lastCatway = catways[Object.keys(catways).pop()];
    const reservations = await Reservations.find();
    const users = await User.find();

    const catwayError = req.flash('catwayError');
    const reservationError = req.flash('reservationError');
    const usersError = req.flash('usersError');

    const ocupation = await calculateOccupancyPercentage();
    const totalActiveReserves = await getTotalActiveReserves();
    const nextReservationToExpire = await getNextReservationToExpire();
    const recentBookings = await getRecentBookings();
    const averageDuration = await calculateAverageBookingDuration();
    const { ocupiedCatways, availableCatways } = await getCatwaysBookedAndAvailable();

    if (catways.length === 0) {
      req.flash('catwayError', 'Data not found');
    }

    if (reservations.length === 0) {
      req.flash('reservationError', 'Data not found');
    }

    if (users.length === 0) {
      req.flash('usersError', 'Data not found');
    }


    return res.render('dashboard', {
      pageTitle: 'Dashboard',
      path: '/dashboard',
      catways: catways,
      reservations: reservations,
      users: users,
      moment: moment,
      lastCatway: lastCatway,
      reservationError: reservationError,
      usersError: usersError,
      catwayError: catwayError,
      ocupation : ocupation,
      totalActiveReserves: totalActiveReserves,
      nextReservationToExpire: nextReservationToExpire,
      recentBookings: recentBookings,
      averageDuration: averageDuration,
      ocupiedCatways: ocupiedCatways,
      availableCatways: availableCatways
    });

  } catch (error) {
    console.log(error);
    req.flash('error', 'Une erreur s\'est produite lors de l\'obtention des informations');
    return res.redirect('/dashboard');
  }
};