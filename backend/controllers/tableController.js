const Table = require('../models/Table');

// 🪑 Get All Tables (Dashboard)
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.status(200).json({ success: true, tables });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//  Create New Table (Dashboard)
exports.createTable = async (req, res) => {
  try {
    const { chairs, tableName } = req.body;

    // ✅ Find last table number
    const lastTable = await Table.findOne().sort({ tableNumber: -1 });
    const nextTableNumber = lastTable ? lastTable.tableNumber + 1 : 1;

    if (nextTableNumber > 30) {
      return res.status(400).json({ success: false, error: 'Maximum 30 tables reached' });
    }

    const table = new Table({
      tableNumber: nextTableNumber,
      chairs,
      tableName,
      status: 'Available'
    });

    await table.save();
    res.status(201).json({ success: true, table });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ❌ Delete Table (Dashboard)
exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({ success: false, error: 'Table not found' });
    }

    if (table.status === 'Reserved') {
      return res.status(400).json({ success: false, error: 'Reserved tables cannot be deleted' });
    }

    await Table.findByIdAndDelete(id);

    // ✅ Re-number remaining tables
    const remaining = await Table.find().sort({ tableNumber: 1 });
    for (let i = 0; i < remaining.length; i++) {
      remaining[i].tableNumber = i + 1;
      await remaining[i].save();
    }

    res.status(200).json({ success: true, message: 'Table deleted and numbers reshuffled' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔄 Update Table Status (Dashboard)
exports.updateTableStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const table = await Table.findByIdAndUpdate(id, { status }, { new: true });
    if (!table) {
      return res.status(404).json({ success: false, error: 'Table not found' });
    }

    res.status(200).json({ success: true, table });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
