const express = require('express');
const router = express.Router();

const Task = require('../models/Task');

//Get all Tasks
router.get('/',async(req,res) =>{
    const tasks = await Task.find();
    res.json(tasks);
});

//Add tasks
router.post('/',async(req,res) =>{
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
});

//Update tasks
router.put('/:id',async(req,res)=>{
    const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true});
    res.json(task);
});

//Delete tasks
router.delete('/:id',async(req,res)=>{
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

module.exports = router;