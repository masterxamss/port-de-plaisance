/**
 * @module controllers/catway
 * @description Controller for managing reservations. Handles operations like viewing, adding, and deleting reservations.
 * @requires models/catway
 * @requires models/reservations
 */

const Catway = require("../models/catway");
const Reservations = require("../models/reservations");
const moment = require("moment");

/**
 * Retrieves all catways and reservations and displays the catways listing page.
 *
 * @async
 * @function getCatways
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @throws {Error} If an error occurs while fetching the catways or reservations.
 * @example
 * // Example usage:
 * app.get('/catways', catwayController.getCatways);
 */
exports.getCatways = async (req, res) => {
  try {
    const catways = await Catway.find().sort({ _id: "asc" });
    const reservations = await Reservations.find();
    const error = req.flash("error");
    const success = req.flash("success");

    res.render("catways/catways-list", {
      pageTitle: "Catways list",
      catways: catways,
      reservations: reservations,
      path: "/catways",
      error: error,
      success: success,
      moment: moment
    });
  } catch (error) {
    console.log(error);
    res.render("catways/catways-list", {
      pageTitle: "Catways list",
      catways: [],
      path: "/catways",
      error: res.flash(
        "error",
        "La liste des Catways n'a pas pu être telechargee"
      )
    });
  }
};

/**
 * Retrieves the details of a single catway and its associated reservations.
 *
 * @async
 * @function getOneCatway
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @throws {Error} If an error occurs while fetching the catway or reservations.
 * @example
 * // Example usage:
 * app.get('/catways/:id', catwayController.getOneCatway);
 */
exports.getOneCatway = async (req, res) => {
  try {
    const catwayNumber = req.params.id;
    const catway = await Catway.find({ catwayNumber: catwayNumber });
    const reservations = await Reservations.find({
      catwayNumber: catwayNumber
    });
    if (!catway) {
      req.flash("error", "Ce Catway n'existe pas");
      return res.redirect("/catways");
    }
    res.render("catways/catway-detail", {
      pageTitle: "Detail du Catway",
      catway: catway[0],
      reservations: reservations,
      moment: moment,
      path: "/catways",
      error: req.flash("error"),
      success: req.flash("success")
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Le Catway n'a pas pu être telechargee");
    res.render("catways/catways-list", {
      pageTitle: "Catways list",
      catways: this.getCatways,
      path: "/catways",
      error: error
    });
  }
};

/**
 * Renders the page to add a new catway.
 *
 * @async
 * @function getAddCatway
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @throws {Error} If an error occurs while fetching catways or reservations.
 * @example
 * // Example usage:
 * app.get('/catways/get-add', catwayController.getAddCatway);
 */
exports.getAddCatway = async (req, res) => {
  const error = req.flash("error");
  const success = req.flash("success");
  const catways = await Catway.find();
  const reservations = await Reservations.find();
  const nextCatway = catways.length + 1;

  try {
    res.render("catways/add-catway", {
      pageTitle: "Ajout d'un Catway",
      path: "/catways",
      error: error,
      success: success,
      editMode: false,
      nextCatway: nextCatway,
      catways: catways,
      reservations: reservations,
      moment: moment
    });
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de l'obtention des Catways"
    );
    return res.redirect("/catways");
  }
};

/**
 * Creates a new catway.
 *
 * @async
 * @function createCatway
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @throws {Error} If an error occurs while creating the catway.
 * @example
 * // Example usage:
 * app.post('/catways', catwayController.createCatway);
 */
exports.createCatway = async (req, res) => {
  const { catway_number, type, catway_state } = req.body;

  if (!catway_number || !type || !catway_state) {
    req.flash("error", "Veuillez renseigner tous les champs");
    return res.redirect("/catways/get-add");
  }

  try {
    const exists = await Catway.exists({ catwayNumber: catway_number });
    if (exists) {
      req.flash("error", "Ce Catway existe déja");
      return res.redirect("/catways/get-add");
    }

    const catway = new Catway({
      catwayNumber: catway_number,
      type,
      catwayState: catway_state
    });
    await catway.save();

    req.flash("success", "Catway ajoute avec succès");
    res.redirect("/catways");
  } catch (error) {
    console.error("Erro ao criar Catway:", error);
    req.flash("error", "Une erreur s'est produite lors de l'ajout du Catway");
    res.redirect("/catways");
  }
};

/**
 * Retrieves the edit page for a catway.
 *
 * @async
 * @function getEditCatway
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @throws {Error} If an error occurs while fetching the catway details.
 * @example
 * // Example usage:
 * app.get('/catways/get-edit/:id', catwayController.getEditCatway);
 */
exports.getEditCatway = async (req, res) => {
  const editMode = req.query.edit;
  try {
    const catway = await Catway.findById(req.params.id);
    const catways = await Catway.find();
    const reservations = await Reservations.find();
    const error = req.flash("error");
    const success = req.flash("success");
    if (!catway) {
      req.flash("error", "Ce Catway n'existe pas");
      return res.redirect("/catways");
    }
    res.render("catways/add-catway", {
      pageTitle: "Editer un Catway",
      path: "/catways",
      editMode: editMode,
      catway: catway,
      error: error,
      moment: moment,
      success: success,
      catways: catways,
      reservations: reservations
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Replaces an existing catway with new data.
 *
 * @async
 * @function replaceCatway
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @throws {Error} If an error occurs while replacing the catway.
 * @example
 * // Example usage:
 * app.put('/catways/:id', catwayController.replaceCatway);
 */
exports.replaceCatway = async (req, res) => {
  const { catway_number, type, catway_state } = req.body;

  try {
    // Verifica se todos os campos foram preenchidos
    if (!catway_number || !type.trim() || !catway_state.trim()) {
      req.flash("error", "Veuillez renseigner tous les champs");
      return res.redirect("/catways/get-edit/" + req.params.id + "?edit=true");
    }

    // Busca o documento do Catway pelo ID
    const catwayDoc = await Catway.findById(req.params.id);

    if (!catwayDoc) {
      req.flash("error", "Ce Catway n'existe pas");
      return res.redirect("/catways");
    }

    //Verifica se o catwayNumber já existe em outro documento
    const filter = { catwayNumber: catway_number };
    const update = {
      catwayNumber: catway_number,
      type: type,
      catwayState: catway_state
    };

    await Catway.findOneAndUpdate(filter, update, { new: true });
    req.flash("success", "Catway modifié avec succès");
    return res.redirect("/catways/get-edit/" + req.params.id + "?edit=true");
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de la modification du Catway"
    );
    return res.redirect("/catways");
  }
};

/**
 * Updates the state of an existing catway.
 *
 * @async
 * @function updateCatway
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @throws {Error} If an error occurs while updating the catway's state.
 * @example
 * // Example usage:
 * app.patch('/catways/:id', catwayController.updateCatway);
 */
exports.updateCatway = async (req, res) => {
  const id = req.params.id;
  const state = req.body.catwayState;
  try {
    if (!state.trim()) {
      req.flash("error", "Veuillez renseigner le état du Catway");
      return res.redirect("/catways/" + req.params.id);
    }

    const updatedCatway = await Catway.find({ catwayNumber: id });

    if (!updatedCatway) {
      req.flash("error", "Ce Catway n'existe pas");
      return res.redirect("/catways");
    }

    updatedCatway[0].catwayState = state;
    await updatedCatway[0].save();
    req.flash("success", "État modifié avec succès");
    return res.redirect("/catways/" + req.params.id);
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "Une erreur s'est produite lors de la mise à jour du état du Catway"
    );
    return res.redirect("/catways/" + req.params.id);
  }
};

/**
 * Deletes a catway by its ID.
 *
 * @async 
 * @function deleteCatway
 * @param {Object} req - The HTTP request.
 * @param {Object} res - The HTTP response.
 * @throws {Error} If an error occurs while deleting the catway.
 * @example
 * // Example usage:
 * app.post('/catways/:id', catwayController.deleteCatway);
 */
exports.deleteCatway = async (req, res) => {
  try {
    const reservations = await Reservations.find({
      catwayNumber: req.params.id
    });
    if (reservations.length > 0) {
      req.flash("error", "Ce Catway contient des reservations");
      return res.redirect("/catways/" + req.params.id);
    }

    const deletedCatway = await Catway.findOneAndDelete({
      catwayNumber: req.params.id
    });
    if (!deletedCatway) {
      req.flash("error", "Ce Catway n'existe pas");
      return res.redirect("/catways");
    }

    req.flash("success", "Catway supprimé avec succès");
    return res.redirect("/catways");
  } catch (error) {
    req.flash(
      "error",
      "Une erreur s'est produite lors de la suppression du Catway"
    );
    return res.redirect("/catways");
  }
};
