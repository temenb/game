import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// export const createUser = async (email: string, password: string) => {
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) throw new Error('User already exists');
//
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await prisma.user.create({
//         data: { email, password: hashedPassword },
//     });
//
//     await publishToQueue(process.env.RABBITMQ_QUEUE_USER_CREATED!, {
//         userId: user.id,
//     });
//
//     return user;
// };
//
// export const login = async (email: string, password: string) => {
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user || !user.password) throw new Error('Invalid credentials');
//
//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) throw new Error('Invalid credentials');
//
//     const accessToken = generateAccessToken(user.id);
//     const refreshToken = generateRefreshToken(user.id);
//     const userId = user.id;
//
//     await prisma.user.update({
//         where: { id: user.id },
//         data: { refreshToken },
//     });
//
//     return { accessToken, refreshToken, userId };
// };
//
// export const refreshTokens = async (token: string) => {
//     const decoded = verifyRefreshToken(token) as any;
//     const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
//     if (!user || user.refreshToken !== token) throw new Error('Invalid refresh token');
//
//     const newAccessToken = generateAccessToken(user.id);
//     const newRefreshToken = generateRefreshToken(user.id);
//
//     await prisma.user.update({
//         where: { id: user.id },
//         data: { refreshToken: newRefreshToken },
//     });
//
//     return { accessToken: newAccessToken, refreshToken: newRefreshToken };
// };
//
// export const logout = async (userId: string) => {
//     await prisma.user.update({
//         where: { id: userId },
//         data: { refreshToken: null },
//     });
// };
//
// export const forgotPassword = async (userId: string) => {
//     // await prisma.user.update({
//     //     where: { id: userId },
//     //     data: { refreshToken: null },
//     // });
// };
//
// export const resetPassword = async (userId: string) => {
//     // await prisma.user.update({
//     //     where: { id: userId },
//     //     data: { refreshToken: null },
//     // });
// };
//
// // export const getProfile = async (userId: string) => {
// //     const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, createdAt: true } });
// //     return user;
// // };
