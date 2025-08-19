import bcrypt from "bcrypt";
import { readFile, writeFile } from 'fs/promises';
const usersFilePath = 'src/userdata.json';
const saltRounds = 10; // A higher number is more secure but slower

export async function createUser(user, password) {
    console.log("Creating user...");
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Read and parse the existing user data
    const data = await readFile(usersFilePath, 'utf-8');
    const json = JSON.parse(data);

    // Add the new user with the hashed password
    json.Users[user] = {
        passwordHash: hashedPassword,
        lastlogin: null
    };

    // Write the updated data back to the file
    await writeFile(usersFilePath, JSON.stringify(json, null, 2), 'utf-8');

    console.log("Registration successful!");
}