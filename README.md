# Kpx

Kpx is a proxy based on **Ultraviolet**, featuring end-to-end encryption for all files, optional user accounts with hashed passwords, and a **one-session-per-account policy** to prevent server overload. It includes a customizable fake frontend to help avoid detection, ensuring that no proxy files are stored in publicly accessible folders—so unauthenticated users cannot access any pages.  

On the server side, a built-in **Markov babbler** randomizes elements on pages, helping avoid basic fingerprinting attempts. Categorized logs are included for easier debugging.

---

## Requirements

- Must be run over **HTTPS** in the browser; otherwise, the `crypto` function will not be accessible to the website.  
- The main Node.js server must run on **port 8080**. Using a reverse proxy to route from 8080 to 443 is highly recommended for production setups.

---

## Current Status

This project is still under development, and errors may occur. It has been tested on and is designed to work with **Google Chrome**.

### Known Potential Issues

- **Bad file loading timing**: May cause pages to break on the client side. This usually does not occur but is a potential issue.

---

## Getting Started

Run the server with:

```bash
npm start