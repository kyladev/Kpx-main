import * as fs from 'node:fs';
import * as path from 'node:path';

//turn to false to not require logging in
export const require_pass = true;

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

    const cookieHeader = request.headers.cookie || '';
    if (cookieHeader.includes('Session=Valid')) {
      return;
    } else {
      const logMsg = "user been kicked out: " + new Date() + "\n";
      fs.appendFile(logFilePath, logMsg, () => {
        console.log("kick off logged: " + new Date());
      });
      reply.redirect('/error');
    }
  };
}
