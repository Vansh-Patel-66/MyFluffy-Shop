import Permission from "../../models/permission.model.js";

export const createPermission = async (req, res) => {
  try {
    const newRecord = await Permission.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getPermissionById = async (req, res) => {
  try {
    const record = await Permission.findByPk(req.params.id);
    if (record) res.status(200).json(record);
    else res.status(404).json({ error: "Record not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const [updated] = await Permission.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedRecord = await Permission.findByPk(req.params.id);
      res.status(200).json(updatedRecord);
    } else res.status(404).json({ error: "Record not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const deleted = await Permission.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: "Record not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
