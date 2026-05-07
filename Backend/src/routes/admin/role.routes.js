import express from "express";
import * as rolecontroller from "../../controllers/admin/role.controller.js";
import * as permissioncontroller from "../../controllers/admin/permission.controller.js";
import * as rolepermissioncontroller from "../../controllers/admin/rolepermission.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role and permission management
 */

/**
 * @swagger
 * /api/role/role:
 *   post:
 *     summary: Create role
 *     tags: [Roles]
 *   get:
 *     summary: Get role
 *     tags: [Roles]
 *   put:
 *     summary: Update role
 *     tags: [Roles]
 *   delete:
 *     summary: Delete role
 *     tags: [Roles]
 */
router.post("/role", rolecontroller.createRole);
router.get("/role", rolecontroller.getRoleById);
router.put("/role", rolecontroller.updateRole);
router.delete("/role", rolecontroller.deleteRole);

/**
 * @swagger
 * /api/role/permission:
 *   post:
 *     summary: Create permission
 *     tags: [Roles]
 *   get:
 *     summary: Get permission
 *     tags: [Roles]
 *   put:
 *     summary: Update permission
 *     tags: [Roles]
 *   delete:
 *     summary: Delete permission
 *     tags: [Roles]
 */
router.post("/permission", permissioncontroller.createPermission);
router.get("/permission", permissioncontroller.getPermissionById);
router.put("/permission", permissioncontroller.updatePermission);
router.delete("/permission", permissioncontroller.deletePermission);

/**
 * @swagger
 * /api/role/rolepermission:
 *   post:
 *     summary: Create role permission mapping
 *     tags: [Roles]
 *   get:
 *     summary: Get role permission mapping
 *     tags: [Roles]
 *   put:
 *     summary: Update role permission mapping
 *     tags: [Roles]
 *   delete:
 *     summary: Delete role permission mapping
 *     tags: [Roles]
 */
router.post("/rolepermission", rolepermissioncontroller.createRolePermission);
router.get("/rolepermission", rolepermissioncontroller.getRolePermissionById);
router.put("/rolepermission", rolepermissioncontroller.updateRolePermission);
router.delete("/rolepermission", rolepermissioncontroller.deleteRolePermission);

export default router;
