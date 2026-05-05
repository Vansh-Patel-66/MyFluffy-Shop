import express from "express";
import * as rolecontroller from "../../controllers/admin/role.controller.js";
import * as permissioncontroller from "../../controllers/admin/permission.controller.js";
import * as rolepermissioncontroller from "../../controllers/admin/rolepermission.controller.js";

const router = express.Router();

router.post("/role", rolecontroller.createRole);
router.get("/role", rolecontroller.getRoleById);
router.put("/role", rolecontroller.updateRole);
router.delete("/role", rolecontroller.deleteRole);

router.post("/permission", permissioncontroller.createPermission);
router.get("/permission", permissioncontroller.getPermissionById);
router.put("/permission", permissioncontroller.updatePermission);
router.delete("/permission", permissioncontroller.deletePermission);

router.post("/rolepermission", rolepermissioncontroller.createRolePermission);
router.get("/rolepermission", rolepermissioncontroller.getRolePermissionById);
router.put("/rolepermission", rolepermissioncontroller.updateRolePermission);
router.delete("/rolepermission", rolepermissioncontroller.deleteRolePermission);

export default router;
