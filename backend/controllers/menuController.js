const Menu = require('../models/Menu');

// Get all menu items
exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.find().sort({ createdAt: -1 });
    res.json({ success: true, menu });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const item = new Menu(req.body);
    await item.save();
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Menu.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Menu.findByIdAndDelete(id);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
