import OrderItem from '../../models/orderItem.model.js';
import Product from '../../models/product.model.js';

export const createOrderItem = async (req, res) => {
  try {
    const newRecord = await OrderItem.create(req.body);
    
    if (req.body.product_id && req.body.quantity) {
      const product = await Product.findByPk(req.body.product_id);
      if (product && product.stock >= req.body.quantity) {
        await product.update({ stock: product.stock - req.body.quantity });
      }
    }

    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderItems = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const records = await OrderItem.findAll();
    
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

export const getOrderItemById = async (req, res) => {
  try {
    const record = await OrderItem.findByPk(req.params.id);
    if (record) res.status(200).json(record);
    else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    const [updated] = await OrderItem.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await OrderItem.findByPk(req.params.id);
      res.status(200).json(updatedRecord);
    } else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrderItem = async (req, res) => {
  try {
    const deleted = await OrderItem.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
