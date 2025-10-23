const Chef = require('../models/Chef');

exports.getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json({ success: true, chefs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createChef = async (req, res) => {
  try {
    const chef = new Chef(req.body);
    await chef.save();
    res.json({ success: true, chef });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteChef = async (req, res) => {
  try {
    const { id } = req.params;
    await Chef.findByIdAndDelete(id);
    res.json({ success: true, message: 'Chef deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
