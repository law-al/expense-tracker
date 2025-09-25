import type { Request, Response } from 'express';
import { compareSync, hashSync } from 'bcrypt';
import { prismaClient } from '../utils/prisma-client.js';
import { BadRequestError } from '../exceptions/bad-request.js';
import { ChangeUserPasswordSchema } from '../schema/index.js';

export const getMe = async (req: Request, res: Response) => {};

export const updateMe = async (req: Request, res: Response) => {};

export const deleteMe = async (req: Request, res: Response) => {};

export const changePassword = async (req: Request, res: Response) => {
  if (!req.user) return;

  ChangeUserPasswordSchema.parse(req.body);

  const { currentPassword, newPassword } = req.body;

  const user = await prismaClient.user.findUnique({
    where: {
      id: +req.user.id,
    },
  });

  if (!user) throw new BadRequestError('User not found');

  const isPasswordValid = compareSync(currentPassword, user.password);

  if (!isPasswordValid)
    throw new BadRequestError('Current password is incorrect');

  if (currentPassword === newPassword)
    throw new BadRequestError(
      'New password must be different from current password'
    );

  if (!newPassword || newPassword.length < 6)
    throw new BadRequestError(
      'New password must be at least 6 characters long'
    );

  await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashSync(newPassword, 12),
      passwordChangedAt: new Date(),
    },
  });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
};
