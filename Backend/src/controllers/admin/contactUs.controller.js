import ContactUs from '../../models/contactUs.model.js';

export const createContactUs = async (req, res) => {
  try {
    const newRecord = await ContactUs.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContactUs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const records = await ContactUs.findAll();
    
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

export const getContactUsById = async (req, res) => {
  try {
    const record = await ContactUs.findByPk(req.params.id);
    if (record) res.status(200).json(record);
    else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateContactUs = async (req, res) => {
  try {
    const [updated] = await ContactUs.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await ContactUs.findByPk(req.params.id);
      res.status(200).json(updatedRecord);
    } else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteContactUs = async (req, res) => {
  try {
    const deleted = await ContactUs.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: 'Record not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
