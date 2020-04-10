# Backend

This folder contains the backend of the application and uses the following technologies :

* Node JS
* Express JS
* Passport JS (local, jwt, facebook, google)
* Mongo DB
* Docker

## Commands to run the backend
```bash
# Run all commands from the back folder which contains the backend Dockerfile
docker build . -t backend-app
docker run backend-app
```
## Additional informations

### How to secure your Express JS app ?

* Use of Helmet package, to secure HTTP headers from security leaks
```js
    let helmet = require('helmet');
    app.use(helmet());
```

### Links

[Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)