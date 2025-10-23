const Client = require('../models/Client');

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ lastOrderAt: -1 });
    res.json({ success: true, clients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.json({ success: true, client });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await Client.findByIdAndDelete(id);
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
