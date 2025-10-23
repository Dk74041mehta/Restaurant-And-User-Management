const Menu = require('../models/Menu');

exports.getMenu = async (req, res, next) => {
  try {
    const menu = await Menu.find().sort({ createdAt: -1 });
    res.json({ success: true, menu });
  } catch (err) {
    next(err);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const item = new Menu(req.body);
    await item.save();
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Menu.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Menu.findByIdAndDelete(id);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    next(err);
  }
};
