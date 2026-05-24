import { auth } from "@/auth";

/**
 * Ensures the caller is authenticated and holds an administrative role
 * ("ADMIN", "OWNER", "STAFF").
 * Throws an Error if unauthorized.
 */
export async function requireAdmin() {
  const session = await auth();
  
  if (!session || !session.user) {
    throw new Error("Unauthorized: Please log in to perform this action.");
  }
  
  if (!["ADMIN", "OWNER", "STAFF"].includes(session.user.role)) {
    throw new Error("Forbidden: Admin privileges are required to perform this action.");
  }

  return session;
}
