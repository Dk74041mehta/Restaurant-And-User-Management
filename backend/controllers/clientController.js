const Client = require('../models/Client');

exports.getClients = async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ lastOrderAt: -1 });
    res.json({ success: true, clients });
  } catch (err) {
    next(err);
  }
};

exports.createClient = async (req, res, next) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.json({ success: true, client });
  } catch (err) {
    next(err);
  }
};

exports.deleteClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Client.findByIdAndDelete(id);
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (err) {
    next(err);
  }
};
