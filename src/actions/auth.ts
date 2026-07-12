'use server';

import { prisma } from '@/lib/prisma';

export async function loginAction(email: string, password: string) {
  try {
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    // In a real production app, use bcrypt.compare()
    // For this simulation, we check plain text (based on seeder)
    if (user.password !== password) {
      return { success: false, message: 'Incorrect password.' };
    }

    // Return user data (excluding password)
    return {
      success: true,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An error occurred during login.' };
  }
}
