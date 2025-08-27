import bcrypt from "bcrypt";
import { readFile, writeFile } from 'fs/promises';
const usersFilePath = 'src/userdata.json';
const saltRounds = 10;

export async function createUser(user, password) {
    console.log("Creating user...");
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const data = await readFile(usersFilePath, 'utf-8');
    const json = JSON.parse(data);
    json.Users[user] = {
        passwordHash: hashedPassword,
        lastlogin: null
    };
    await writeFile(usersFilePath, JSON.stringify(json, null, 2), 'utf-8');

    console.log(`Created new user ${user}`);
}