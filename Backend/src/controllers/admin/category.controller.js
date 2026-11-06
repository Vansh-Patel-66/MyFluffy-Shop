import Category from '../../models/categories.model.js';
import Product from '../../models/product.model.js';

export const createCategory = async (req, res) => {
  try {
    const newRecord = await Category.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const records = await Category.findAll({
      order: [['created_at', 'ASC']]
    });
    
    if (page || limit) {
      const p = parseInt(page) || 1;
      const l = parseInt(limit) || 50;
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

export const getCategoryById = async (req, res) => {
  try {
    const record = await Category.findByPk(req.params.id);
    if (record) {
      res.status(200).json(record);
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedRecord = await Category.findByPk(req.params.id);
      res.status(200).json(updatedRecord);
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Product.update(
      { category_id: null },
      { where: { category_id: req.params.id } }
    );
    const deleted = await Category.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
