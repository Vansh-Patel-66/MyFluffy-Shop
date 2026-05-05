import Address from '../../models/address.model.js';

export const createAddress = async (req, res) => {
  try {
    const newRecord = await Address.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const records = await Address.findAll();
    
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

export const getAddressById = async (req, res) => {
  try {
    const record = await Address.findByPk(req.params.id);
    if (record) res.status(200).json(record);
    else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const [updated] = await Address.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await Address.findByPk(req.params.id);
      res.status(200).json(updatedRecord);
    } else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
