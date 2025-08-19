import { SESSION_TIMEOUT, CLEANUP_INTERVAL } from "./run-settings.js";
import { userSessions } from "./server.js";

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

// Periodic cleanup
export function cleanupOldSessions() {
  const now = Date.now();
  for (const [user, session] of userSessions.entries()) {
    if (now - session.lastActive > SESSION_TIMEOUT) {
      userSessions.delete(user);
      logToFile('info', `Deleted stale session for ${user}, last active at ${session.lastActive}`);
    }
  }
}