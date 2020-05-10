const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Lod env variables
dotenv.config({path:"./config/config.env"});

// Load models
const Quiz = require("./models/Quiz");

// Connect to db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const quizes = JSON.parse(fs.readFileSync(`${__dirname}/data/quiz.json`,'UTF-8'));

// Import into db
const importData = async()=>{
  try{
    await Quiz.create(quizes);
    console.log(`Quizes imported ...`.green.inverse);
    process.exit();
  }catch(err){
    console.error(err);
    process.exit();
  }
}

const deleteData = async()=>{
  try{
    await Quiz.deleteMany();
    console.log(`Quizes destroyed ...`.red.inverse);
    process.exit();
  }catch(err){
    console.error(err);
    process.exit();
  }
}

if(process.argv[2] === "-i") importData();
else if(process.argv[2] === "-d") deleteData();