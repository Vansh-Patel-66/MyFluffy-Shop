import Product from '../../models/product.model.js';
import ProductImage from '../../models/productImage.model.js';
import Category from '../../models/categories.model.js';
import CartItem from '../../models/cartItem.model.js';
import OrderItem from '../../models/orderItem.model.js';
import slugify from 'slugify';

export const createProduct = async (req, res) => {
  try {
    const { image_urls, ...productData } = req.body;
    
    if (!productData.slug && productData.name) {
      productData.slug = slugify(productData.name, { lower: true, strict: true });
    }

    const newRecord = await Product.create(productData);
    
    if (image_urls && Array.isArray(image_urls)) {
      const imageRecords = image_urls.map(url => ({
        product_id: newRecord.id,
        image_url: url
      }));
      await ProductImage.bulkCreate(imageRecords);
    }
    
    const createdProduct = await Product.findByPk(newRecord.id, {
      include: [{ model: Category }, { model: ProductImage }]
    });

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const records = await Product.findAll({
      include: [{ model: Category }, { model: ProductImage }],
      order: [['created_at', 'DESC']]
    });
    
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

export const getProductById = async (req, res) => {
  try {
    const record = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: ProductImage }]
    });
    if (record) res.status(200).json(record);
    else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { image_urls, ...productData } = req.body;

    if (productData.name && !productData.slug) {
      productData.slug = slugify(productData.name, { lower: true, strict: true });
    }

    const [updated] = await Product.update(productData, { where: { id: req.params.id } });
    
    if (image_urls && Array.isArray(image_urls)) {
      await ProductImage.destroy({ where: { product_id: req.params.id } });
      const imageRecords = image_urls.map(url => ({
        product_id: req.params.id,
        image_url: url
      }));
      await ProductImage.bulkCreate(imageRecords);
    }

    if (updated || (image_urls && image_urls.length >= 0)) {
      const updatedRecord = await Product.findByPk(req.params.id, {
        include: [{ model: Category }, { model: ProductImage }]
      });
      if (updatedRecord) res.status(200).json(updatedRecord);
      else res.status(404).json({ error: 'Record not found' });
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await ProductImage.destroy({ where: { product_id: req.params.id } });
    await CartItem.destroy({ where: { product_id: req.params.id } });
    await OrderItem.destroy({ where: { product_id: req.params.id } });
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
