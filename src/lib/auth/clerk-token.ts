type ClerkTokenGetter = (options: { template: string }) => Promise<string | null>;

export async function getSupabaseAccessToken(getToken: ClerkTokenGetter) {
  try {
    return await getToken({ template: "supabase" });
  } catch (error) {
    const clerkError = error as { status?: number; longMessage?: string; message?: string };
    const message = clerkError.longMessage || clerkError.message || "";

    if (clerkError.status === 404 && message.includes("JWT template")) {
      return null;
    }

    throw error;
  }
}

export const SUPABASE_JWT_SETUP_MESSAGE =
  "Supabase access is not configured. Create a Clerk JWT template named 'supabase', or configure SUPABASE_SERVICE_ROLE_KEY on the server.";
