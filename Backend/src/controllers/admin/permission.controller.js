import Permission from "../../models/permission.model";

export const createPermission = async (req, res) => {
  try {
    const newRecord = await Permission.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
