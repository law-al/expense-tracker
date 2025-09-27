import { Router } from 'express';
import { protect } from '../middleware/protect.middleware.js';
import { asyncHandler } from '../utils/catch-async.js';
import {
  getNotifications,
  deleteAllNotifications,
  deleteNotification,
  markAsRead,
  markAsReadAll,
} from '../controllers/notification.controller.js';

const notificationRoute = Router();

notificationRoute.get('/fetch', protect, asyncHandler(getNotifications));
notificationRoute.post('/mark-as-read/:id', protect, asyncHandler(markAsRead));
notificationRoute.post(
  '/mark-as-read-all',
  protect,
  asyncHandler(markAsReadAll)
);
notificationRoute.delete('/:id', protect, asyncHandler(deleteNotification));
notificationRoute.delete(
  '/delete-all',
  protect,
  asyncHandler(deleteAllNotifications)
);

export default notificationRoute;
