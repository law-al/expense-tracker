import type { Request, Response } from 'express';
import { prismaClient } from '../utils/prisma-client.js';
import { BadRequestError } from '../exceptions/bad-request.js';

export const getNotifications = async (req: Request, res: Response) => {
  if (!req.user) return;

  const notification = await prismaClient.notification.findMany({
    where: {
      userId: +req.user?.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    success: true,
    message: 'Notifications fetched successfully',
    data: notification,
  });
};

export const markAsRead = async (req: Request, res: Response) => {
  if (!req.user) return;

  const notifIds = req.body.notifIds as number[];
  if (!notifIds || notifIds.length === 0)
    throw new BadRequestError('Notification ids are required');

  await prismaClient.notification.updateMany({
    where: {
      id: { in: notifIds },
      userId: +req.user?.id,
    },
    data: {
      isRead: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Notifications marked as read',
  });
};

export const markAsReadAll = async (req: Request, res: Response) => {
  if (!req.user) return;
  await prismaClient.notification.updateMany({
    where: {
      userId: +req.user?.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
};

export const deleteNotification = async (req: Request, res: Response) => {
  if (!req.user) return;
  const { id } = req.params;
  if (!id) throw new BadRequestError('Notification id is required');
  await prismaClient.notification.deleteMany({
    where: {
      id: +id,
      userId: +req.user?.id,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
};

export const deleteAllNotifications = async (req: Request, res: Response) => {
  if (!req.user) return;
  await prismaClient.notification.deleteMany({
    where: {
      userId: +req.user?.id,
    },
  });

  res.status(200).json({
    success: true,
    message: 'All notifications deleted successfully',
  });
};
