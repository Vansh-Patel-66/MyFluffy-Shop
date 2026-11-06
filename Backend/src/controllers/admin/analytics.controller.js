import Order from '../../models/order.model.js';
import User from '../../models/user.model.js';
import Product from '../../models/product.model.js';
import { fn, col } from 'sequelize';

export const getAnalytics = async (req, res) => {
  try {
    // 1. Live count of users
    const totalUsers = await User.count();

    // 2. Live count of products
    const totalProducts = await Product.count({ where: { is_active: true } });

    // 3. Live count of orders and total revenue
    const totalOrders = await Order.count();
    const totalSalesResult = await Order.findAll({
      attributes: [[fn('SUM', col('finale_amount')), 'total_sales']]
    });
    const totalSales = parseFloat(totalSalesResult[0]?.dataValues?.total_sales || 0);

    // 4. Return live aggregated analytics
    res.status(200).json([{
      total_sales: totalSales,
      total_orders: totalOrders,
      total_users: totalUsers,
      total_products: totalProducts
    }]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnalyticsById = async (req, res) => {
  return getAnalytics(req, res);
};
