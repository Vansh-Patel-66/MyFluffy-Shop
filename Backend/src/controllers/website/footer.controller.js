import FooterContent from "../../models/footer.model.js";

export const createFooterContent = async (req, res) => {
  try {
    const newRecord = await FooterContent.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFooterContents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const records = await FooterContent.findAll();

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedRecords = records.slice(startIndex, endIndex);

    res.status(200).json({
      total: records.length,
      page: parseInt(page),
      limit: parseInt(limit),
      data: paginatedRecords,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFooterContentById = async (req, res) => {
  try {
    const record = await FooterContent.findByPk(req.params.id);
    if (record) res.status(200).json(record);
    else res.status(404).json({ error: "Record not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFooterContent = async (req, res) => {
  try {
    const [updated] = await FooterContent.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedRecord = await FooterContent.findByPk(req.params.id);
      res.status(200).json(updatedRecord);
    } else res.status(404).json({ error: "Record not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFooterContent = async (req, res) => {
  try {
    const deleted = await FooterContent.destroy({
      where: { id: req.params.id },
    });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: "Record not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
