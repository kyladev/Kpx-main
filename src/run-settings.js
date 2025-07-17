import { userSessions } from './server.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

//turn to false to not require logging in
export const require_pass = false;

//for testing (proxy doesn't work):
export const publicPath = process.cwd();

//for release (must be in ultraviolet static path):
//export const publicPath = process.cwd() + "/Ultraviolet-Static/public/";

const logFilePath = path.join(path.resolve('./src'), 'logs.txt'); // Absolute path

export function authMiddleware() {
  return async function (request, reply) {
    if (require_pass === false) {
      console.log("kick off bypassed (testing mode)");
      return;
    }

    // Verify signed cookies
    const signedSession = request.unsignCookie(request.cookies.Session);
    const signedUser = request.unsignCookie(request.cookies.User);

    if (!signedSession?.valid || !signedUser?.valid) {
      console.log("Tampered or missing cookies.");
      reply.clearCookie('Session');
      reply.clearCookie('User');
      return reply.redirect('/error');
    }

    const sessionId = signedSession.value;
    const username = signedUser.value;

    // Verify single session per user
    if (userSessions.get(username) === sessionId) {
      return; // authenticated
    }

    // Invalid session or kicked due to multiple logins
    const logMsg = `User ${username} kicked out at ${new Date()}\n`;
    fs.appendFile(logFilePath, logMsg, () => {
      console.log("Kick out logged:", new Date());
    });

    reply.clearCookie('Session');
    reply.clearCookie('User');
    reply.redirect('/error');
  };
}



//for admin pages

export function authMiddlewareAdmin() {
  return async function (request, reply) {
    if (require_pass === false) {
      console.log("kick off bypassed on admin page(testing mode)");
      return;
    }

    // Verify signed cookies
    const signedSession = request.unsignCookie(request.cookies.Session);
    const signedUser = request.unsignCookie(request.cookies.User);

    if (!signedSession?.valid || !signedUser?.valid) {
      console.log("Tampered or missing cookies.");
      reply.clearCookie('Session');
      reply.clearCookie('User');
      return reply.redirect('/admin/login');
    }

    const sessionId = signedSession.value;
    const username = signedUser.value;

    // Verify single session per user
    if (userSessions.get(username) === sessionId) {
      return; // authenticated
    }

    // Invalid session or kicked due to multiple logins
    const logMsg = `User on admin page ${username} kicked out at ${new Date()}\n`;
    fs.appendFile(logFilePath, logMsg, () => {
      console.log("Kick out on admin page logged:", new Date());
    });

    reply.clearCookie('Session');
    reply.clearCookie('User');
    reply.redirect('/admin/login');
  };
}
