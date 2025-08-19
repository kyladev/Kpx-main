import { createUser } from "./adduser.js";

const [arg1, arg2] = process.argv.slice(2);

if (!arg1 || !arg2) {
  console.error("Usage: node makenewuser.js <string1> <string2>");
  process.exit(1);
}

async function main() {
  try {
    await createUser(arg1, arg2);
    console.log(`Created user '${arg1}'`);
  } catch (e) {
    console.error("Error creating user:", e);
  }
  process.exit(0);
}

main();