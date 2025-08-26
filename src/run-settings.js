import { userSessions } from './server.js';
import { appendFile } from 'fs/promises';

//turn to false to not require logging in
export const require_pass = true;

//root of everything publicly accessible
export const publicPath = process.cwd() + "/public";
export const rootPath = process.cwd();

//session cleanup timing and session timeout
export const SESSION_TIMEOUT = 15 * 60 * 1000; 
export const CLEANUP_INTERVAL = 5 * 60 * 1000;

//log file path
// export const logFilePath = path.join(path.resolve('./src'), 'logs.txt'); // Absolute path

export function logToFile(level, message) {
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

    // Verify single session per user
    if (userSessions.get(username) === sessionId) {
      logToFile("info", `user authenticated by middleware from ${request.ip} with session ID ${sessionId} and username ${username}`);
      return; // authenticated
    }

    // Invalid session or kicked due to multiple logins
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

  // Verify single session per user
  if (userSessions.get(username) === sessionId) {
    logToFile("info", `user returned as logged in by login checker from ${request.ip} with session ID ${sessionId} and username ${username}`);
    return true;
  }

  // Invalid session or kicked due to multiple logins
  logToFile("info", `User ${username} returned as logged out by login checker at ${request.ip} due to invalid or multiple sessions`)

  return false;
}

//for admin pages

// export function authMiddlewareAdmin() {
//   return async function (request, reply) {
//     if (require_pass === false) {
//       console.log("kick off bypassed on admin page(testing mode)");
//       return;
//     }

//     // Verify signed cookies
//     const signedSession = request.unsignCookie(request.cookies.Session);
//     const signedUser = request.unsignCookie(request.cookies.User);

//     if (!signedSession?.valid || !signedUser?.valid) {
//       console.log("Tampered or missing cookies.");
//       reply.clearCookie('Session');
//       reply.clearCookie('User');
//       return reply.redirect('/admin/login');
//     }

//     const sessionId = signedSession.value;
//     const username = signedUser.value;

//     // Verify single session per user
//     if (userSessions.get(username) === sessionId) {
//       return; // authenticated
//     }

//     // Invalid session or kicked due to multiple logins
//     const logMsg = `User on admin page ${username} kicked out at ${new Date()}\n`;
//     fs.appendFile(logFilePath, logMsg, () => {
//       console.log("Kick out on admin page logged:", new Date());
//     });

//     reply.clearCookie('Session');
//     reply.clearCookie('User');
//     reply.redirect('/admin/login');
//   };
// }
