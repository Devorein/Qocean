# Qocean

A self hosted MERN quiz app for making learning fun and effective.

Since its self hosted you'll host the app on your own server aka localhost and your own database, so that none can view your credentials and private data, but it needs a bit more effort from you to work.

## Installation Guidelines

1. Clone or download the experiment branch. It always has the latest commits.
2. Go into the Qocean directory by typing `cd Qocean` .
3. Make sure you have **node.js** installed on your machine.
4. Install all the dependencies by running `npm i` .
5. Create config and public folders in your project directory,

   1. Inside config folder create a file named config.env (its rerquired as it contains all the configuration info for the app).
   2. Inside public folder create another folder name uploads (it contains all the images uploaded via the image upload system of the app).

6. Create a mongodb atlas account and cloud cluster, and provide the url to the config file.
7. After all that just type `npm run dev` to start the server and the clie# Qocean.

MERN app for making killer quiz to enhance learning

Since its self hosted you'll host the app on your own server aka localhost and your own database, so that none can view your credentials and private data, but it needs a bit more effort from you to work.

### Configuration file

Make sure your configuration file have the following key and value pairs separated by =

`PORT` =any valid port

`NODE_ENV` =development|production|testing

`MONGO_URI` =mongodb atlas cluster url

`FILE_UPLOAD_SIZE` =max file upload size in bytes

`FILE_UPLOAD_PATH` = ./public/uploads

`JWT_SECRET` =any strong password

`JWT_EXPIRE` =see jwt documentation for more info, tldr; use `day_number` d to specify how many days the token will last

`JWT_COOKIE_EXPIRE` =same as `JWT_EXPIRE` without the d

## Features

Take a look at this <a href="./docs/features.md">file</a> to see all the available features of the app and the api.

## API Documentation

Take a look at this <a href="./docs/api/index.html">file</a> to understand the api structure. At the moment its using REST but support for graphql is already on the roadmap.
