import { SESSION_TIMEOUT, CLEANUP_INTERVAL } from "./run-settings.js";
import { userSessions } from "./server.js";
const MAX_SESSION_LIFETIME = 60 * 60 * 1000; // 60m absolute lifetime

// Add or update a session
export function setUserSession(user, sessionId) {
  userSessions.set(user, {
    sessionId,
    lastActive: Date.now()
  });
}

// Mark session as active (e.g. on request)
export function touchUserSession(user) {
  const session = userSessions.get(user);
  if (session) {
    session.lastActive = Date.now();
  }
}

export function cleanupOldSessions() {
  const now = Date.now();
  for (const [user, session] of userSessions.entries()) {
    const idleExpired = now - session.lastActive > SESSION_TIMEOUT;
    const lifetimeExpired = now - session.createdAt > MAX_SESSION_LIFETIME;

    if (idleExpired || lifetimeExpired) {
      userSessions.delete(user);
      logToFile(
        'info',
        `Deleted session for ${user}. Reason: ${idleExpired ? 'idle timeout' : 'max lifetime'}. Last active: ${session.lastActive}, Created: ${session.createdAt}`
      );
    }
  }
}