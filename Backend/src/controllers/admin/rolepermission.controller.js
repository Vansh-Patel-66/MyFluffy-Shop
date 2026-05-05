import rolecontroller from "../role.controller";

export const createRolePermission = async (req, res) => {
  try {
    const newRecord = await RolePermission.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRolePermissionById = async (req, res) => {
  try {
    const record = await RolePermission.findByPk(req.params.id);
    if (record) res.status(200).json(record);
    else res.status(404).json({ error: "Record not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
