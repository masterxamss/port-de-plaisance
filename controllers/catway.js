/**
 * @module controllers/catway
 * @description Controller for managing reservations. Handles operations like viewing, adding, and deleting reservations - See {@tutorial program-tutorial}.
 * @requires models/catway
 * @requires models/reservations
 */

const Catway = require("../models/catway");
const Reservations = require("../models/reservations");
const moment = require("moment");

/**
 * Retrieves all catways and reservations and displays the catways listing page.
 *
 * Renders the list page for all Catways.
 * It retrieves all Catways from the database, along with their associated Reservations.
 * If an error occurs while fetching the data, an error message is displayed.
 *
 * @function getCatways
 * @async
 * @param {Object} req - The request object used to handle the request and any flash messages.
 * @param {Object} res - The response object used to render the page or return an error message.
 *
 * @returns {void} - Renders the "catways-list" view with the list of Catways and their associated reservations, or redirects with an error message if the data cannot be fetched.
 *
 * @throws {Error} - Catches any errors during the database queries and logs the error while rendering the list page with an appropriate error message.
 * @example
 * // Example usage:
 * app.get('/catways', catwayController.getCatways);
 */
exports.getCatways = async (req, res) => {
  try {
    // Retrieve all Catways from the database, sorted by _id in ascending order
    const catways = await Catway.find().sort({ _id: "asc" });

    // Retrieve all reservations associated with Catways
    const reservations = await Reservations.find();

    // Fetch any flash messages for error and success
    const error = req.flash("error");
    const success = req.flash("success");

    // Render the "catways-list" page with the fetched data
    res.status(200).render("catways/catways-list", {
      pageTitle: "Catways list",
      catways: catways,
      reservations: reservations,
      path: "/catways",
      error: error,
      success: success,
      moment: moment,
    });
  } catch (error) {
    console.log(error);
    // Render the list page with an empty Catways list and an error message
    res.status(500).render("catways/catways-list", {
      pageTitle: "Catways list",
      catways: [],
      path: "/catways",
      error: res.flash(
        "error",
        "Catways list could not be downloaded"
      )
    });
  }
};

/**
 * Renders the detail page for a specific Catway.
 * It retrieves the Catway and its associated Reservations based on the Catway number passed in the request parameter.
 * If the Catway doesn't exist, an error message is displayed and the user is redirected to the Catways list page.
 *
 * @function getOneCatway
 * @async
 * @param {Object} req - The request object containing the Catway number in the URL parameters.
 * @param {Object} res - The response object used to render the page or handle redirects.
 *
 * @returns {void} - Renders the "catway-detail" view with the Catway's details and its reservations or redirects the user in case of an error.
 *
 * @throws {Error} - Logs any errors that occur during the process and redirects the user with an error message.
 * @example
 * // Example usage:
 * app.get('/catways/:id', catwayController.getOneCatway);
 */
exports.getOneCatway = async (req, res) => {
  try {
    // Extract the Catway number from the URL parameters
    const catwayNumber = req.params.id;

    // Find the Catway by its number
    const catway = await Catway.find({ catwayNumber: catwayNumber });

    // Find all reservations associated with this Catway number
    const reservations = await Reservations.find({
      catwayNumber: catwayNumber
    });

    // If no Catway is found, redirect to the Catways list with an error message
    if (!catway || catway.length === 0) {
      req.flash("error", "This Catway doesn't exist");
      return res.redirect("/catways");
    }
    // Render the detail page for the Catway, passing the necessary data
    res.status(200).render("catways/catway-detail", {
      pageTitle: "Detail du Catway",
      catway: catway[0],
      reservations: reservations,
      moment: moment,
      path: "/catways",
      error: req.flash("error"),
      success: req.flash("success"),
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Catway could not be downloaded");
    res.redirect("/catways");
  }
};

/**
 * Renders the page for adding a new Catway.
 * It retrieves the current Catways and Reservations from the database, calculates the next Catway number,
 * and passes this data to the template for rendering.
 * If there is any error during the data retrieval or rendering process, an error message is set, 
 * and the user is redirected to the Catways list page.
 *
 * @function getAddCatway
 * @async
 * @param {Object} req - The request object, which is used to retrieve any flash messages and handle errors.
 * @param {Object} res - The response object, which is used to render the page or handle redirects.
 *
 * @returns {void} - Renders the "add-catway" view with the necessary data or redirects the user in case of an error.
 *
 * @throws {Error} - Logs any errors that occur during the process, and redirects the user with an error message.
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
    // Render the page for adding a new Catway, passing all necessary data
    res.status(200).render("catways/add-catway", {
      pageTitle: "Adding a Catway",                     
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
    req.flash("error", "An error has occurred");        
    return res.redirect("/catways");                    
  }
};

/**
 * Creates a new Catway by saving the provided data (catway number, type, and state) into the database.
 * It first checks if all required fields are filled out. If not, an error message is shown, and the user is redirected to the Catway creation page.
 * It also checks if a Catway with the same catway number already exists. If it does, an error message is shown, and the user is redirected.
 * If the Catway is successfully created, a success message is shown, and the user is redirected to the Catways list.
 *
 * @function createCatway
 * @async
 * @param {Object} req - The request object containing the Catway details (catway number, type, and state) in the request body.
 * @param {Object} res - The response object used to send the result of the operation (redirecting or rendering).
 *
 * @returns {void} - Redirects the user to the Catways list if the Catway is created successfully or back to the creation page if there is an error.
 *
 * @throws {Error} - Logs any errors that occur during the Catway creation process, but does not stop the user from being redirected.
 * @example
 * // Example usage:
 * app.post('/catways', catwayController.createCatway);
 */
exports.createCatway = async (req, res) => {
  // Retrieve the Catway details from the request body
  const { catway_number, type, catwayState } = req.body;                     

  //Check if all required fields are filled in, if not, show an error and redirect
  if (!catway_number || !type || !catwayState) {
    req.flash("error", "Please fill in all fields");                          
    return res.redirect("/catways/get-add");                                  
  }

  try {
    // Check if a Catway with the same catway number already exists
    const exists = await Catway.exists({ catwayNumber: catway_number });
    if (exists) {
      req.flash("error", "This Catway exists");                               
      return res.redirect("/catways/get-add");                                
    }

    // Create a new Catway instance and save it to the database
    const catway = new Catway({
      catwayNumber: catway_number,
      type,
      catwayState: catwayState.trim()
    });
    await catway.save();                                                      

    // Set success message and redirect to the Catways list
    req.flash("success", "Catway successfully added");
    res.redirect("/catways");
  } catch (error) {
    // Log any errors and set an error message if an exception occurs during the process
    console.error(error);
    req.flash("error", "An error occurred when adding the Catway");
    res.redirect("/catways");
  }
};

/**
 * Retrieves the edit page for a specific Catway.
 * It checks if the Catway exists based on the provided ID. If not, an error message is displayed, and the user is redirected to the Catways list.
 * If the Catway exists, the page is rendered with the necessary data, including the current Catway details, all Catways, and all Reservations.
 * Additionally, any flash messages for errors or successes are included in the render.
 *
 * @function getEditCatway
 * @async
 * @param {Object} req - The request object containing the Catway ID in the parameters and the query string (edit mode flag).
 * @param {Object} res - The response object used to render the edit page.
 *
 * @returns {void} - Renders the edit page with the current data, flash messages, and other relevant information.
 *
 * @throws {Error} - Logs any errors that occur during the process, though it does not currently send a response if an error is thrown.
 */
exports.getEditCatway = async (req, res) => {
  // Retrieve the edit mode flag from the query string
  const editMode = req.query.edit;                              
  try {
    // Find the Catway document by its ID
    const catway = await Catway.findById(req.params.id);

    // Retrieve all Catway and Reservation documents
    const catways = await Catway.find();
    const reservations = await Reservations.find();

    // Get any flash messages
    const error = req.flash("error");                           
    const success = req.flash("success");                    

    // If the Catway does not exist, show an error message and redirect
    if (!catway) {
      req.flash("error", "This Catway doesn't exist");
      return res.status(404).redirect("/catways");
    }

    // Render the page with the current Catway, available Catways, Reservations, and flash messages
    res.status(200).render("catways/add-catway", {
      pageTitle: "Edit a Catway",                               
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
 * Replaces the details of an existing Catway identified by its ID.
 * It checks if the necessary fields (catway_number, type, and catway_state) are provided.
 * If any of the fields are missing, an error message is displayed, and the user is redirected to the edit page.
 * If the Catway is not found, an error message is shown, and the user is redirected to the list of Catways.
 * If the update is successful, a success message is displayed, and the user is redirected to the edit page for the modified Catway.
 *
 * @function replaceCatway
 * @async
 * @param {Object} req - The request object containing the new Catway details (catway_number, type, catway_state) in the body and the Catway ID in the parameters.
 * @param {Object} res - The response object.
 *
 * @returns {void} - Redirects to the appropriate page based on success or failure.
 *
 * @throws {Error} - Catches any errors that may occur during the Catway modification process.
 * // Example usage:
 * app.put('/catways/:id', catwayController.replaceCatway);
 */
exports.replaceCatway = async (req, res) => {
  // Extract the Catway details from the request body
  const { catway_number, type, catwayState } = req.body;                                     

  try {
    // Check if all required fields are provided
    if (!catway_number || !type.trim() || !catwayState.trim()) {
      req.flash("error", "Please fill in all fields");
      return res.status(400).redirect("/catways/get-edit/" + req.params.id + "?edit=true");   
    }

    // Find the Catway document by its ID
    const catwayDoc = await Catway.findById(req.params.id);

    // If the Catway does not exist, show an error message
    if (!catwayDoc) {
      req.flash("error", "This Catway doesn't exist");
      return res.status(404).redirect("/catways");                                            
    }

    // Prepare the update filter and the new data to be updated
    const filter = { catwayNumber: catway_number };
    const update = {
      catwayNumber: catway_number,
      type: type,
      catwayState: catwayState
    };

    // Update the Catway document
    await Catway.findOneAndUpdate(filter, update, { new: true });
    req.flash("success", "Catway successfully modified");                                     
    return res.status(200).redirect("/catways/get-edit/" + req.params.id + "?edit=true");     
  } catch (error) {
    // Catch any errors during the process and show an error message
    console.log(error);
    req.flash(
      "error",
      "An error occurred while modifying the Catway"
    );
    return res.redirect("/catways");                                                          
  }
};

/**
* Updates the state of a specific Catway identified by its catwayNumber.
 * The Catway's state is updated only if a valid state is provided.
 * If the state is empty, an error message is shown and the user is redirected back to the Catway page.
 * If the Catway is not found, an error message is displayed.
 * After updating, a success message is shown, and the user is redirected to the updated Catway page.
 *
 * @function updateCatway
 * @async
 * @param {Object} req - The request object containing the Catway ID in the parameters and the new state in the body.
 * @param {Object} res - The response object.
 *
 * @returns {void} - Redirects back to the Catway page with a success or error message.
 *
 * @throws {Error} - Catches any errors that may occur during the Catway update process.
 * @example
 * // Example usage:
 * app.patch('/catways/:id', catwayController.updateCatway);
 */
exports.updateCatway = async (req, res) => {
  const id = req.params.id;  // Get the catwayNumber from the URL parameters
  const state = req.body.catwayState;  // Get the new state from the request body

  try {
    // Check if the provided state is valid (non-empty)
    if (!state.trim()) {
      req.flash("error", "Please enter the Catway state");
      return res.redirect("/catways/" + req.params.id);
    }

    // Attempt to find the Catway by its catwayNumber
    const updatedCatway = await Catway.find({ catwayNumber: id });

    // If the Catway is not found, show an error message
    if (!updatedCatway) {
      req.flash("error", "This Catway doesn't exist");
      return res.redirect("/catways");
    }

    // Update the state of the found Catway
    updatedCatway[0].catwayState = state.trim();
    await updatedCatway[0].save();  // Save the updated Catway

    // Show a success message after successful update
    req.flash("success", "State successfully modified");
    return res.redirect("/catways/" + req.params.id);
  } catch (error) {
    // Catch any errors during the process and show an error message
    console.log(error);
    req.flash(
      "error",
      "An error occurred while updating the Catway status"
    );
    return res.redirect("/catways/" + req.params.id);
  }
};

/**
 * Deletes a Catway and its associated reservations if no active reservations are found.
 * If the Catway has active reservations (i.e., with a check-out date in the future),
 * it will not be deleted, and an error message will be displayed.
 * After successfully deleting the Catway, it also deletes any reservations associated with it.
 *
 * @function deleteCatway
 * @async
 * @param {Object} req - The request object containing the catway's ID in the parameters.
 * @param {Object} res - The response object.
 *
 * @returns {void} - Redirects back to the Catways page with a success or error message.
 *
 * @throws {Error} - Catches any errors during the deletion process (e.g., issues with database operations).
 * @example
 * // Example usage:
 * app.post('/catways/:id', catwayController.deleteCatway);
 */
exports.deleteCatway = async (req, res) => {
  try {
    // Retrieve all reservations associated with the Catway using the catwayNumber
    const reservations = await Reservations.find({
      catwayNumber: req.params.id
    });

    // Check if there are any active reservations for this Catway
    for (let i = 0; i < reservations.length; i++) {
      if (reservations.length > 0 && reservations[i].checkOut > new Date()) {
        // If there are active reservations, prevent deletion and show an error
        req.flash("error", "This Catway contains active reservations");
        return res.redirect("/catways/" + req.params.id);
      }
    }

    // Attempt to find and delete the Catway by its catwayNumber
    const deletedCatway = await Catway.findOneAndDelete({
      catwayNumber: req.params.id
    });

    // If the Catway doesn't exist, show an error message
    if (!deletedCatway) {
      req.flash("error", "This Catway doesn't exist");
      return res.redirect("/catways");
    }

    // Retrieve all reservations associated with the deleted Catway
    const deletedReservations = await Reservations.find({
      catwayNumber: req.params.id
    });

    // If there are any reservations associated with this Catway, delete them
    if (deletedReservations) {
      await Reservations.deleteMany({
        catwayNumber: req.params.id
      });
    }

    // Successfully deleted the Catway and its associated reservations
    req.flash("success", "Catway successfully deleted");
    return res.redirect("/catways");
  } catch (error) {
    // If there is an error during the deletion process, show an error message
    req.flash(
      "error",
      "An error occurred while deleting the Catway"
    );
    return res.redirect("/catways");
  }
};
