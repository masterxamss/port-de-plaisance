const Catway = require('../models/catway');

exports.getCatways = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOneCatway = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) {
      return res.status(404).json({ message: "Catway not found" });
    }
    res.status(200).json(catway);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createCatway = async (req, res) => {
  try {
    const catway = await Catway.create(req.body);
    res.status(201).json(catway);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.replaceCatway = async (req, res) => {
  try {
    const replacedCatway = await Catway.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, overwrite: true, runValidators: true }
    );
    if (!replacedCatway) {
      return res.status(404).json({ message: "Catway not found" });
    }
    res.status(200).json(replacedCatway);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.updateCatway = async (req, res) => {
  try {
    const updatedCatway = await Catway.findByIdAndUpdate(
      req.params.id,           
      req.body,                     
      { new: true, runValidators: true }
    );
    
    if (!updatedCatway) {
      return res.status(404).json({ message: "Catway not found" });
    }

    res.status(200).json(updatedCatway);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCatway = async (req, res) => {
  try {
    const deletedCatway = await Catway.findByIdAndDelete(req.params.id);
    if (!deletedCatway) {
      return res.status(404).json({ message: "Catway not found" });
    }
    res.status(200).json(deletedCatway);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};