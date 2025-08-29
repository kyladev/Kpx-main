# Kpx

Kpx is a proxy based on **Scramjet**, featuring end-to-end encryption for all files, optional user accounts with hashed passwords, and a **one-session-per-account policy** to prevent server overload. It includes a customizable fake frontend to help avoid detection, ensuring that no proxy files are stored in publicly accessible folders so unauthenticated users cannot access any pages.  

Development for switching to Scramjet is currently happening on the `Scramjet-Version` branch, Ultraviolet will soon not be supported by this project.

For more detailed instructions on setup, see the **Setup** section at the bottom.

---

## Requirements

- Must be run over **HTTPS** in the browser; otherwise, the `crypto` function will not be accessible to the website.  
- The main Node.js server must run on **port 8080**. Using a reverse proxy to route from 8080 to 443 is highly recommended for production setups.

---

## Current Status

This project is still under development, and errors may occur. It has been tested on and is designed to work with **Google Chrome**.

### Known Potential Issues

- **Bad file loading timing**: May cause pages to break on the client side. This usually does not occur but is a potential issue.

- **Custom colors**: I just haven't fixed them yet, this will be done soon.

---

## Setup

First, you need an SSL certificate if you are not accessing this proxy on the same computer you host it on. If you do host on the same computer, simply run the code below, and go to `http://localhost:8080`.

```bash
node src/server.js
```

If you are not, then you can either go with 2 options (assuming you host on your own computer); You can host with https or http on the main server, either way, you will need a reverse proxy. I have made one for this exact purpose at `https://github.com/kyladev/NodeJS-Reverse-Proxy`. You will need an SSL certificate for this.

Run the reverse proxy with the example command in the README of the project, and start the server with the either of these 2:

```bash
npm start
```
```bash
node src/index.js --use-https
```

If using the second option, you will need to replace the path for SSL certificates to your own in `src/server.js`. You also will need to do this with the reverse proxy. 

Note: testing and development is done on a Unix system.

What is likely is that it will not work because of the permissions needed to access the SSL certificates. A quick fix is to just run it as root, but this may be unsecure. You can also disable the permissions needed to access it, but that means your certificates could get stolen.

It is reccomended that you create a user group with access to the certificates, give them ownership instead of the root, and then disable logging in for them.