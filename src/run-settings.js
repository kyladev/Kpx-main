import { userSessions } from './server.js';
import { appendFile } from 'fs/promises';

//
//CONFIG
//

//Paths to SSL certificates
export const TLS_KEY = "/etc/letsencrypt/live/testhostdomain.ddns.net/privkey.pem";
export const TLS_CERT = "/etc/letsencrypt/live/testhostdomain.ddns.net/fullchain.pem";

export const loggingEnabled = true; //if logging is enabled

export const rateLimit = 1000; //this is how many requests can be made by someone per minute in the rate limiter

//turn to false to not require logging in
export const require_pass = true;

//root of everything publicly accessible
export const publicPath = process.cwd() + "/public";
export const rootPath = process.cwd();

//session cleanup timing and session timeout
export const SESSION_TIMEOUT = 15 * 60 * 1000; //how long it takes for a session to timeout (default is 15 minutes)
export const CLEANUP_INTERVAL = 5 * 60 * 1000; //the interval of when to clean old sessions, deleting them (default is 5 minutes)

//password/username length requirements
export const min_username_len = 3;
export const max_username_len = 30;
export const min_password_len = 8;
export const max_password_len = 128;

//
//END OF CONFIG
//

export function logToFile(level, message) {
    if (!loggingEnabled) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level.toUpperCase()}] ${message}\n`;

    let filePath;
    switch (level) {
        case 'error':
            filePath = 'logs/errors.log';
            break;
        case 'warning':
            filePath = 'logs/warnings.log';
            break;
        case 'important':
            filePath = 'logs/important.log';
            break;
        case 'info':
        default:
            filePath = 'logs/info.log';
            break;
    }

    appendFile(filePath, logMessage, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
}

export function authMiddleware() {
  return async function (request, reply) {
    if (require_pass === false) {
      logToFile("important", `TESTING: cookie authentication middleware bypassed by ${request.ip} due to testing mode (this is dangerous)`);
      return;
    }

    //no authentication cookies
    if (!request.cookies.Session || !request.cookies.User) {
      return reply.redirect('/login');
    }

    const signedSession = request.unsignCookie(request.cookies.Session);
    const signedUser = request.unsignCookie(request.cookies.User);

    if (!signedSession?.valid || !signedUser?.valid) {
      logToFile("info", `tampered or missing cookies found by middleware from ${request.ip} with session cookie ${signedSession} and user cookie ${userSessions}`);
      reply.clearCookie('Session');
      reply.clearCookie('User');
      return reply.redirect('/login');
    }

    const sessionId = signedSession.value;
    const username = signedUser.value;

    if (userSessions.get(username) === sessionId) {
      logToFile("info", `user authenticated by middleware from ${request.ip} with session ID ${sessionId} and username ${username}`);
      return;
    }

    //invalid session or kicked from multiple logins
    logToFile("info", `User ${username} kicked out by middleware at ${request.ip} due to invalid session or multiple sessions\n`)

    reply.clearCookie('Session');
    reply.clearCookie('User');
    reply.redirect('/login');
  };
}

export async function isUserLoggedIn(request) {
  if (require_pass === false) {
    logToFile("important", `TESTING: cookie authentication by login checker bypassed from ${request.ip} due to testing mode (this is dangerous)`);
    return true;
  }

  if (!request.cookies.Session || !request.cookies.User) {
    return false;
  }

  const signedSession = request.unsignCookie(request.cookies.Session);
  const signedUser = request.unsignCookie(request.cookies.User);

  if (!signedSession?.valid || !signedUser?.valid) {
    logToFile("info", `tampered or missing cookies found by login checker from ${request.ip} with session cookie ${signedSession} and user cookie ${userSessions}`);
    return false;
  }

  const sessionId = signedSession.value;
  const username = signedUser.value;

  //verify this is the only session
  if (userSessions.get(username) === sessionId) {
    logToFile("info", `user returned as logged in by login checker from ${request.ip} with session ID ${sessionId} and username ${username}`);
    return true;
  }

  //invalid session or kicked due to multiple logins
  logToFile("info", `User ${username} returned as logged out by login checker at ${request.ip} due to invalid or multiple sessions`)

  return false;
}