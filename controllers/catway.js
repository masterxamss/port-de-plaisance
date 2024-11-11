const Catway = require('../models/catway');
const Reservations = require('../models/reservations');
const moment = require('moment');


exports.getCatways = async (req, res) => {
  try{
    const catways = await Catway.find().sort({ _id: "asc" });
    const reservations = await Reservations.find();
    const error = req.flash('error');
    const success = req.flash('success');

    res.render('catways/catways-list', {
      pageTitle: 'Catways list',
      catways: catways,
      reservations: reservations,
      path: '/catways',
      error: error,
      success: success,
      moment: moment
    })  
  }
  catch (error) {
    console.log(error);
    res.render('catways/catways-list', {
      pageTitle: 'Catways list',
      catways: [],
      path: '/catways',
      error: res.flash('error', 'La liste des Catways n\'a pas pu être telechargee')
    })
  }
};

exports.getOneCatway = async (req, res) => {
  try {
    const catwayNumber = req.params.id;
    const catway = await Catway.find({ catwayNumber: catwayNumber });
    const reservations = await Reservations.find({ catwayNumber: catwayNumber });
    if (!catway) {
      req.flash('error', 'Ce Catway n\'existe pas');
      return res.redirect('/catways/list');
    }
    res.render('catways/catway-detail', {
      pageTitle: 'Detail du Catway',
      catway: catway[0],
      reservations: reservations,
      moment: moment,
      path: '/catways',
      error: req.flash('error'),
      success: req.flash('success')
    })
  } catch (error) {
    console.log(error);
    req.flash('error', 'Le Catway n\'a pas pu être telechargee');
    res.render('catways/list', {
      pageTitle: 'Catways list',
      catways: this.getCatways,
      path: '/catways',
      error: error
    })
  }
};

exports.getAddCatway = async (req, res) => {
  const error = req.flash('error');
  const success = req.flash('success');
  const catways = await Catway.find();
  const reservations = await Reservations.find();
  const nextCatway = catways.length + 1;
  
  try {
    res.render('catways/add-catway', {
      pageTitle: 'Ajout d\'un Catway',
      path: '/catways',
      error: error,
      success: success,
      editMode: false,
      nextCatway: nextCatway,
      catways: catways,
      reservations: reservations,
      moment: moment
    })  
  }
  catch(error){
    console.log(error);
    req.flash('error', 'Une erreur s\'est produite lors de l\'obtention des Catways');
    return res.redirect('/catways/list');
  }
};

exports.createCatway = async (req, res) => {
  const {catway_number, type, catway_state} = req.body;
  try{
    const catwayDoc = await Catway.findOne({catwayNumber: catway_number});
    if(catwayDoc){
      req.flash('error', 'Ce Catway existe déja');
      return res.redirect('/catways/get-add');
    }

    if(!catway_number || !type || !catway_state){
      req.flash('error', 'Veuillez renseigner tous les champs');
      return res.redirect('/catways/get-add');
    }

    const catway = new Catway({
      catwayNumber: catway_number,
      type: type,
      catwayState: catway_state
    });
    await catway.save();
    req.flash('success', 'Catway ajoute avec succès');
    return res.redirect('/catways/list');
  }
  catch (error){
    console.log(error);
    req.flash('error', 'Une erreur s\'est produite lors de l\'ajout du Catway');
    return res.redirect('/catways/list');
  }
};

exports.getEditCatway = async (req, res) => {
  const editMode = req.query.edit;
  try{
    const catway = await Catway.findById(req.params.id);
    const catways = await Catway.find();
    const reservations = await Reservations.find();
    const error = req.flash('error');
    const success = req.flash('success');
    if(!catway){
      req.flash('error', 'Ce Catway n\'existe pas');
      return res.redirect('/catways/list');
    }
    res.render('catways/add-catway', {
      pageTitle: 'Editer un Catway',
      path: '/catways',
      editMode: editMode,
      catway: catway,
      error: error,
      moment: moment,
      success: success,
      catways: catways,
      reservations: reservations
    });
  }
  catch(error){
    console.log(error);
  }
}


exports.replaceCatway = async (req, res) => {
  const { catway_number, type, catway_state } = req.body;

  try {
    // Verifica se todos os campos foram preenchidos
    if (!catway_number || !type.trim() || !catway_state.trim()) {
      req.flash('error', 'Veuillez renseigner tous les champs');
      return res.redirect('/catways/get-edit/' + req.params.id + '?edit=true');
    }

    // Busca o documento do Catway pelo ID
    const catwayDoc = await Catway.findById(req.params.id);
    
    if (!catwayDoc) {
      req.flash('error', 'Ce Catway n\'existe pas');
      return res.redirect('/catways/list');
    }

    //Verifica se o catwayNumber já existe em outro documento
    const filter = { catwayNumber: catway_number };
    const update = {
      catwayNumber: catway_number,
      type: type,
      catwayState: catway_state
    };

    await Catway.findOneAndUpdate(filter, update, { new: true });
    req.flash('success', 'Catway modifié avec succès');
    return res.redirect('/catways/get-edit/' + req.params.id + '?edit=true');

  } catch (error) {
    console.log(error);
    req.flash('error', 'Une erreur s\'est produite lors de la modification du Catway');
    return res.redirect('/catways/list');
  }
};

exports.updateCatway = async (req, res) => {
  const id = req.params.id;
  const state = req.body.catwayState
  try {
    
    if (!state.trim()) {
      req.flash('error', 'Veuillez renseigner le état du Catway');
      return res.redirect('/catways/get-catway/'  + req.params.id);
    }

    const updatedCatway = await Catway.find({ catwayNumber: id });

    if (!updatedCatway) {
      req.flash('error', 'Ce Catway n\'existe pas');
      return res.redirect('/catways/list');
    }

    updatedCatway[0].catwayState = state;
    await updatedCatway[0].save();
    req.flash('success', 'État modifié avec succès');
    return res.redirect('/catways/get-catway/'  + req.params.id);

  } catch (error) {
    console.log(error);
    req.flash('error', 'Une erreur s\'est produite lors de la mise à jour du état du Catway');
    return res.redirect('/catways/get-catway/'  + req.params.id);
  }
};

exports.deleteCatway = async (req, res) => {
  try {
    
    const reservations = await Reservations.find({ catwayNumber: req.params.id });
    if (reservations.length > 0) {
      req.flash('error', 'Ce Catway contient des reservations');
      return res.redirect('/catways/get-catway/' + req.params.id);
    }

    const deletedCatway = await Catway.findOneAndDelete({catwayNumber: req.params.id});
    if (!deletedCatway) {
      req.flash('error', 'Ce Catway n\'existe pas');
      return res.redirect('/catways/list');
    }

    req.flash('success', 'Catway supprimé avec succès');
    return res.redirect('/catways/list');

  } catch (error) {
    req.flash('error', 'Une erreur s\'est produite lors de la suppression du Catway');
    return res.redirect('/catways/list');
  }
};