"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client configuration
 * Provides client-side authentication functions.
 * No baseURL: the client calls /api/auth on the current origin, so the same build
 * works on localhost, Vercel preview and the production domain.
 */
export const authClient = createAuthClient();

/**
 * Client-side authentication hooks
 * Only Google OAuth is available
 */
export const { signIn, signOut, useSession, getSession } = authClient;
