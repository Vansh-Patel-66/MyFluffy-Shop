import Order from '../../models/order.model.js';
import OrderItem from '../../models/orderItem.model.js';
import Product from '../../models/product.model.js';
import User from '../../models/user.model.js';
import dbConnection from '../../config/database.js';

export const createOrder = async (req, res) => {
  const t = await dbConnection.transaction();
  try {
    const { items, ...orderData } = req.body;

    const newOrder = await Order.create(orderData, { transaction: t });

    if (items && Array.isArray(items) && items.length > 0) {
      const orderItemsToCreate = items.map(item => ({
        order_id: newOrder.id,
        product_id: item.product_id || item.id,
        quantity: item.quantity || 1,
        price: item.price || item.selling_price,
        gst_rate: item.gst_rate || 0,
        total_price: (item.price || item.selling_price) * (item.quantity || 1)
      }));

      await OrderItem.bulkCreate(orderItemsToCreate, { transaction: t });
    }

    await t.commit();

    const createdOrder = await Order.findByPk(newOrder.id, {
      include: [
        { model: OrderItem, include: [{ model: Product }] },
        { model: User, attributes: ['id', 'email'] }
      ]
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { page, limit, user_id } = req.query;
    const whereClause = {};
    if (user_id) whereClause.user_id = user_id;

    const records = await Order.findAll({
      where: whereClause,
      include: [
        { model: OrderItem, include: [{ model: Product }] },
        { model: User, attributes: ['id', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });
    
    if (page || limit) {
      const p = parseInt(page) || 1;
      const l = parseInt(limit) || 20;
      const startIndex = (p - 1) * l;
      const endIndex = p * l;
      const paginatedRecords = records.slice(startIndex, endIndex);

      return res.status(200).json({
        total: records.length,
        page: p,
        limit: l,
        data: paginatedRecords
      });
    }

    res.status(200).json({
      total: records.length,
      page: 1,
      limit: records.length,
      data: records
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const record = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, include: [{ model: Product }] },
        { model: User, attributes: ['id', 'email'] }
      ]
    });
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
      const updatedRecord = await Order.findByPk(req.params.id, {
        include: [
          { model: OrderItem, include: [{ model: Product }] },
          { model: User, attributes: ['id', 'email'] }
        ]
      });
      res.status(200).json(updatedRecord);
    } else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    await OrderItem.destroy({ where: { order_id: req.params.id } });
    const deleted = await Order.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
