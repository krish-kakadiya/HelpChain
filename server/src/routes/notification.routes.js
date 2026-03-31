import express from "express";
import {
  getNotifications,
  markSeen,
  markAllSeen,
  getUnseenCount,
} from "../controller/notification.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(auth);

router.get("/", getNotifications);
router.get("/unseen-count", getUnseenCount);
router.patch("/mark-all-seen", markAllSeen);
router.patch("/:id/seen", markSeen);

export default router;