import Role from "../../models/role.model.js";

export const createRole = async (req, res) => {
  try {
    const newRecord = await Role.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const record = await Role.findByPk(req.params.id);
    if (record) res.status(200).json(record);
    else res.status(404).json({ error: "Record not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const [updated] = await Role.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedRecord = await Role.findByPk(req.params.id);
      res.status(200).json(updatedRecord);
    } else res.status(404).json({ error: "Record not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const deleted = await Role.destroy({ where: { id: req.params.id } });
    if (deleted) res.status(204).send();
    else res.status(404).json({ error: "Record not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
