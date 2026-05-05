import rolecontroller from "../";
import permissioncontroller from "../permission.controller";
import rolepermissioncontroller from "../rolepermission.controller";

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
