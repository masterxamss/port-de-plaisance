/**
 * @module Dashboard-Controller
 * @description Controller responsible for operations related to the admin dashboard, including occupancy calculation, reservations, and data visualization.
 */

const Catway = require("../models/catway");
const Reservations = require("../models/reservations");
const User = require("../models/user");
const moment = require("moment");
const path = require('path');

/**
 * Calculates the occupancy percentage of Catways.
 *
 * The percentage is calculated based on the number of currently reserved catways compared to the total number of catways.
 *
 * @async
 * @function calculateOccupancyPercentage
 * @returns {Promise<string>} - Occupancy percentage, formatted with 2 decimal places.
 * @throws {Error} - If an error occurs when querying the occupancy data.
 *
 * @example
 * // Example usage
 * const occupancy = await calculateOccupancyPercentage();
 * console.log(occupancy); // Output: "45.23" (if 45.23% of catways are occupied)
 */
async function calculateOccupancyPercentage() {
  try {
    // Total catways available
    const totalCatways = await Catway.countDocuments();

    if (totalCatways === 0) return 0; // Prevents division by zero

    // Count of occupied catways with active reservations
    const activeReservations = await Reservations.distinct("catwayNumber", {
      checkOut: { $gt: new Date() } // Assuming that checkOut indicates the end of the booking
    });

    const ocupiedCatways = activeReservations.length;

    // Calculating the occupancy percentage
    const ocupiedPercentage = (ocupiedCatways / totalCatways) * 100;
    return ocupiedPercentage.toFixed(2); // Returns the value to two decimal places
  } catch (error) {
    console.error("Error when calculating the occupancy percentage:", error);
    throw error;
  }
}

/**
 * Gets the total number of active reservations.
 *
 * A reservation is considered active if the checkOut date is later than the current date.
 *
 * @async
 * @function getTotalActiveReserves
 * @returns {Promise<number>} - Total number of active reservations.
 * @throws {Error} - If an error occurs when querying the active reservations.
 *
 * @example
 * // Example usage
 * const totalActive = await getTotalActiveReserves();
 * console.log(totalActive); // Output: 12 (if there are 12 active reservations)
 */
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

/**
 * Gets the next reservation that will expire.
 *
 * Returns the next reservation with the closest checkOut date.
 *
 * @async
 * @function getNextReservationToExpire
 * @returns {Promise<Object|null>} - The next reservation to expire or null if none exists.
 * @throws {Error} - If an error occurs when querying the reservation.
 *
 * @example
 * // Example usage
 * const nextExpire = await getNextReservationToExpire();
 * if (nextExpire) {
 *   console.log(nextExpire); // Output: { catwayNumber: 3, clientName: "John Doe", checkOut: "2024-11-15" }
 * } else {
 *   console.log("No reservations are about to expire.");
 * }
 */
async function getNextReservationToExpire() {
  try {
    const nextReservation = await Reservations.findOne({
      checkOut: { $gt: new Date() }
    })
      .sort({ checkOut: 1 })
      .exec();

    if (!nextReservation) {
      return null;
    }

    return nextReservation;
  } catch (error) {
    console.error("Error getting the next reservation to expire:", error);
    throw error;
  }
}

/**
 * Gets the most recent bookings.
 *
 * Returns the bookings sorted by creation date, with an optional limit on the number of results.
 *
 * @async
 * @function getRecentBookings
 * @param {number} [limit=1] - The maximum number of recent bookings to retrieve.
 * @returns {Promise<Array>} - An array of recent bookings.
 * @throws {Error} - If an error occurs when querying the recent bookings.
 *
 * @example
 * // Example usage
 * const recentBookings = await getRecentBookings(5);
 * console.log(recentBookings); // Output: [{...}, {...}, {...}, {...}, {...}]
 */
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

/**
 * Calculates the average booking duration.
 *
 * The duration is calculated as the difference between checkOut and checkIn dates for each reservation, averaged across all reservations.
 *
 * @async
 * @function calculateAverageBookingDuration
 * @returns {Promise<string>} - The average booking duration in days, formatted with 2 decimal places.
 * @throws {Error} - If an error occurs when calculating the average booking duration.
 *
 * @example
 * // Example usage
 * const averageDuration = await calculateAverageBookingDuration();
 * console.log(averageDuration); // Output: "2.5" (if the average booking duration is 2.5 days)
 */
async function calculateAverageBookingDuration() {
  try {
    const reservations = await Reservations.find();
    const totalDays = reservations.reduce((acc, reserve) => {
      const duration =
        (new Date(reserve.checkOut) - new Date(reserve.checkIn)) /
        (1000 * 60 * 60 * 24);
      return acc + duration;
    }, 0);

    const averageDays = totalDays / reservations.length;
    return averageDays.toFixed(2);
  } catch (error) {
    console.error(
      "Error when calculating the average duration of bookings:",
      error
    );
    throw error;
  }
}

/**
 * Gets the number of booked and available catways.
 *
 * Returns the number of catways that are currently booked and those that are available.
 *
 * @async
 * @function getCatwaysBookedAndAvailable
 * @returns {Promise<Object>} - An object containing the count of occupied and available catways.
 * @throws {Error} - If an error occurs when calculating the booked and available catways.
 *
 * @example
 * // Example usage
 * const { ocupiedCatways, availableCatways } = await getCatwaysBookedAndAvailable();
 * console.log(ocupiedCatways); // Output: 5 (if 5 catways are occupied)
 * console.log(availableCatways); // Output: 10 (if 10 catways are available)
 */
async function getCatwaysBookedAndAvailable() {
  try {
    const totalCatways = await Catway.countDocuments();
    const activeReservations = await Reservations.distinct("catwayNumber", {
      checkOut: { $gt: new Date() }
    });

    const ocupiedCatways = activeReservations.length;
    const availableCatways = totalCatways - ocupiedCatways;

    return {
      ocupiedCatways,
      availableCatways
    };
  } catch (error) {
    console.error(
      "Error when calculating reserved and available catways:",
      error
    );
    throw error;
  }
}

/**
 * Renders the home page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getHome = (req, res) => {
  res.render("index", {
    pageTitle: "Accueil",
    path: "/"
  });
};

/**
 * Renders the dashboard page.
 *
 * The dashboard page displays data about catways, reservations, users, occupancy, and more.
 *
 * @async
 * @function getDashboard
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If an error occurs when retrieving the data for the dashboard.
 *
 * @example
 * // Example usage
 * app.get("/dashboard", async (req, res) => {
 *   try {
 *     await exports.getDashboard(req, res); // Renders the dashboard with all data.
 *   } catch (error) {
 *     console.log(error);
 *   }
 * });
 */
exports.getDashboard = async (req, res) => {
  try {
    const catways = await Catway.find();
    const lastCatway = catways[Object.keys(catways).pop()];
    const reservations = await Reservations.find();
    const users = await User.find();

    const catwayError = req.flash("catwayError");
    const reservationError = req.flash("reservationError");
    const usersError = req.flash("usersError");

    const ocupation = await calculateOccupancyPercentage();
    const totalActiveReserves = await getTotalActiveReserves();
    const nextReservationToExpire = await getNextReservationToExpire();
    const recentBookings = await getRecentBookings();
    const averageDuration = await calculateAverageBookingDuration();
    const { ocupiedCatways, availableCatways } =
      await getCatwaysBookedAndAvailable();

    if (catways.length === 0) {
      req.flash("catwayError", "Données non trouvées");
    }

    if (reservations.length === 0) {
      req.flash("reservationError", "Données non trouvées");
    }

    if (users.length === 0) {
      req.flash("usersError", "Données non trouvées");
    }

    return res.render("dashboard", {
      pageTitle: "Dashboard",
      path: "/dashboard",
      catways: catways,
      reservations: reservations,
      users: users,
      moment: moment,
      lastCatway: lastCatway,
      reservationError: reservationError,
      usersError: usersError,
      catwayError: catwayError,
      ocupation: ocupation,
      totalActiveReserves: totalActiveReserves,
      nextReservationToExpire: nextReservationToExpire,
      recentBookings: recentBookings,
      averageDuration: averageDuration,
      ocupiedCatways: ocupiedCatways,
      availableCatways: availableCatways
    });
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de l'obtention des informations"
    );
    return res.redirect("/dashboard");
  }
};

exports.getDocumentation = (req, res, html) => {
  console.log(path.basename(__dirname ));
  res.sendFile(path.join(__dirname, '../docs', 'index.html'));
};
