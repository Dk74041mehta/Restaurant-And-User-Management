const Chef = require('../models/Chef');

exports.getChefs = async (req, res, next) => {
  try {
    const chefs = await Chef.find();
    res.json({ success: true, chefs });
  } catch (err) {
    next(err);
  }
};

exports.createChef = async (req, res, next) => {
  try {
    const chef = new Chef(req.body);
    await chef.save();
    res.json({ success: true, chef });
  } catch (err) {
    next(err);
  }
};

exports.deleteChef = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Chef.findByIdAndDelete(id);
    res.json({ success: true, message: 'Chef deleted successfully' });
  } catch (err) {
    next(err);
  }
};
