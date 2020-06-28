# Qocean

A self hosted MERN quiz app for making learning fun and effective.

Since its self hosted you'll host the app on your own server aka localhost and your own database, so that none can view your credentials and private data, but it needs a bit more effort from you to work.

## Requirements  

* Node  
* NPM  

## Usage Guidelines

1. Clone or download the experiment branch. It always has the latest commits.
2. Navigate to the client folder and install the dependencies by running `npm i` .
3. In the public folder create another folder named `uploads` , this is where all the uploaded files will be stored.
4. Navigate to the server folder and install its dependencies by running `npm i` .
5. Inside config folder create a file named config.env (its required as it contains all the configuration info for the app).
6. Create a mongodb atlas account and cloud cluster, and provide the url to the config.env file.
7. To start both the client and the server navigate to the respective directory and run `npm start` 

MERN app for making killer quiz to enhance learning

Since its self hosted you'll host the app on your own server aka localhost and your own database, so that none can view your credentials and private data, but it needs a bit more effort from you to work.

### Configuration file

Make sure your configuration file have the following key and value pairs separated by =

`PORT` =any valid port

`NODE_ENV` =development|production|testing

`MONGO_URI` =mongodb atlas cluster url

`FILE_UPLOAD_SIZE` =max file upload size in bytes

`JWT_SECRET` =any strong password

`JWT_EXPIRE` =see jwt documentation for more info, tldr; use `day_number` d to specify how many days the token will last

`JWT_COOKIE_EXPIRE` =same as `JWT_EXPIRE` without the d

## Features

Take a look at this <a href="./server/docs/features.md">file</a> to see all the available features of the app and the api.

## API Documentation

### Rest

Take a look at this <a href="./docs/api/REST/index.html">file</a> to understand the rest api structure.

### Graphql

To generate a static graphql documentation, install `graphqhdoc` , navigate to the server dir and run `graphdoc` 
