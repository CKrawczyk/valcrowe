# volcrowe
VOLCROWE data visualization


## setting up heroku secret key
```
heroku config:set NODE_ENV=production
heroku config:set SECRET_KEY=`openssl rand -base64 32`
heroku config:set DATABASE_URL=postgres://USER:PASSWORD@address:PORT/NAME
```
