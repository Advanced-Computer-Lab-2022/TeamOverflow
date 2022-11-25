var express = require('express');
var router = express.Router();
const Exercise= require('../models/Exercise');
const { default: mongoose } = require("mongoose");

router.post('/excersise', async function(req, res) {
    const add = new Exercise({
        question:req.body.question,
        answer:req.body.answer,
        correctIndex:req.body.correctIndex
      })
   
        
      try{
        const newExercise =  await exercise.save()
        res.status(201).json(newExercise)
      }catch(err){
        res.status(400).json({message: err.message}) 
      }
})