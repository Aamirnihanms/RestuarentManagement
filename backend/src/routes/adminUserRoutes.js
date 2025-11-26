import express from "express";
import {
  getAllUsers,
  softDeleteUser,
  restoreUser,
  getAllEmployees,
} from "../controllers/userAdminController.js";
import protect,{ adminOnly } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.get("/employees", protect, adminOnly, getAllEmployees);
router.put("/:id/delete", protect, adminOnly, softDeleteUser);
router.put("/:id/restore", protect, adminOnly, restoreUser);

export default router;
