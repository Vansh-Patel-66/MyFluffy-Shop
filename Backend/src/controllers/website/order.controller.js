import Order from '../../models/order.model.js';

export const createOrder = async (req, res) => {
  try {
    const newRecord = await Order.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const records = await Order.findAll();
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedRecords = records.slice(startIndex, endIndex);

    res.status(200).json({
      total: records.length,
      page: parseInt(page),
      limit: parseInt(limit),
      data: paginatedRecords
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const record = await Order.findByPk(req.params.id);
    if (record) res.status(200).json(record);
    else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const [updated] = await Order.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await Order.findByPk(req.params.id);
      res.status(200).json(updatedRecord);
    } else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
