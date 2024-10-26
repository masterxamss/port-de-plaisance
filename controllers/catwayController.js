const Catway = require('../models/catway');

exports.createCatway = async (req, res) => {
  try {
    const catway = await Catway.create(req.body);
    res.status(201).json(catway);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCatways = async (req, res) => {
  try {
    const catways = await catway.find();
    res.json(catways);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};