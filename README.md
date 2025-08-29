# Kpx

Kpx is a proxy based on **Scramjet**, featuring end-to-end encryption for all files, optional user accounts with hashed passwords, and a **one-session-per-account policy** to prevent server overload. It includes a customizable fake frontend to help avoid detection, ensuring that no proxy files are stored in publicly accessible folders so unauthenticated users cannot access any pages.  

Development for Ultraviolet, and a depricated version can be found on the `old-ultraviolet` branch.

For more detailed instructions on setup, see the **Setup** and **SSL Certificates** section at the bottom.

A live demo is usually available at `https://kpx-demo.knetwork.dev:8081/`, rate limited to 1000 requests per minute.

---

## Requirements

- Must be run over **HTTPS** in the browser; otherwise, the `crypto` function will not be accessible to the website.  
- The main Node.js server must run on **port 8080**. The server code includes a built-in reverse proxy if you want to access it from outside the same computer you host on, but that means you need an **SSL Certificate** for a domain name you will use.

---

## Deployment

This proxy must be deployed on non-static hosting platforms, such examples are self-hosting on your own computer (a guide on that is provided here), deploying to a cloud provider (AWS, Google Cloud Run, etc.), and just any platform that allows running a NodeJS server.

---

## Current Status

This project is still under development, and errors may occur. It has been tested on and is designed to work with **Google Chrome**.

### Known Potential Issues

- **Bad file loading timing**: May cause pages to break on the client side. This usually does not occur but is a potential issue.

---

## Setup

First, you need an SSL certificate if you are not accessing this proxy on the same computer you host it on. If you do host on the same computer, simply run the code below, and go to `http://localhost:8080`.

```bash
npm start
```

If you are not, then you can simply run the command below after setting up your SSL certifcate (see the "SSL Certificates" section below).

**Note: Change the path of the SSL certificate in the `src/run-settings.js` file**

```bash
node src/server.js --use-https
```

**Note: testing and development is done on a Unix system.**

What is likely is that it will not work because of the permissions needed to access the SSL certificates. A quick fix is to just run it as root, but this may be unsecure. You can also disable the permissions needed to access it, but that means your certificates could get stolen.

It is reccomended that you create a user group with access to the certificates, give them ownership instead of the root, and then disable logging in for them.

Otherwise, for a quick fix, just run the NodeJS app as root/admin.

---

## SSL Certificates

**This guide is for if you are self hosting. If you use a cloud provider, SSL will usualy be handled by them**

You will need a domain name for this. Getting started, you can use free domains from places like [NoIP](https://www.noip.com/), or you can buy your own.

For SSL certificates, I highly suggest using Certbot. Visit their site with the link below, and follow the instructions for "other" software, on whatever OS you are running in the "system" box. Follow the setup for a standalone SSL certificate with your domain name.

Now you need to find your public IP. To do this, simply go to [this website](https://whatsmyip.org), and set that as the IP where the domain name you have will be pointing to, with a type A DNS record.

## General config

To create new users, follow this format:

```bash
node util/makenewuser.js <username> <password>
```

Both arguments must be strings.

To configure most things, just go to the `src/run-settings.js` file.
