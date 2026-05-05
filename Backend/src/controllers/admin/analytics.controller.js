import Analytics from '../../models/analytics.model.js';

export const getAnalytics = async (req, res) => {
  try {
    const records = await Analytics.findAll();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnalyticsById = async (req, res) => {
  try {
    const record = await Analytics.findByPk(req.params.id);
    if (record) {
      res.status(200).json(record);
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
