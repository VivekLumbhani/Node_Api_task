const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Task = require('./models/task'); 
const { connectToDb, getDb } = require("./db");
const userRoute=require('./user')
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log(`server listening on port no ${PORT}`);
    })
    db = getDb();
  }
})

app.use('/user',userRoute)

// Create a new task

app.post('/getNewTask',(req,res)=>{
  const tasks=req.body;
  console.log("tasks body is "+JSON.stringify(tasks) );
  db.collection('tasks')
  .insertOne(tasks)
  .then(result=>{
      res.status(201).json(result)
  })
  .catch(err=>{
      res.status(500).json({err:'error'})
  })
})
app.use(express.json());

// Retrieve a list of all tasks

app.get('/gettasks', (req, res) => {
    db.collection('tasks')
      .find()
      .sort({_id: 1})
      .toArray()
      .then((tasks) => {
        res.status(200).json(tasks);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  });
  

// Retrieve a single task by ID
app.get('/getSingleTask/:id', (req, res) => {
  const taskId = req.params.id;
  console.log("task id is " + taskId);
  try {
    const objectId = new mongoose.Types.ObjectId(taskId);  // Convert taskId to ObjectId

    console.log("object is " + objectId);
    db.collection('tasks')
      .findOne({ _id: objectId })
      .then((task) => {
        if (task) {
          res.status(200).json(task);
        } else {
          res.status(404).json({ error: "Task not found" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid ObjectId" });
  }
});


// Update an existing task (including marking as completed)
app.put('/updateTask/:id', (req, res) => {
  const idToUpdate = req.params.id;
  const data = req.body;
  const newvalues = { $set: data };

  console.log("task id is " + idToUpdate);

  try {
    const objectId = new mongoose.Types.ObjectId(idToUpdate);

    console.log("object is " + JSON.stringify(newvalues));

    db.collection('tasks')
      .updateOne({ _id: objectId }, newvalues, function (err, result) {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log(result);
          res.status(200).json({ message: "Task updated successfully" });
        }
      });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid ObjectId" });
  }
});


// Delete task
app.delete('/delete_task/:id', (req, res) => {
  const idToDelete = req.params.id;
  try {
    const objectId = new mongoose.Types.ObjectId(idToDelete);

    db.collection('tasks').deleteOne({ _id: objectId }, function (err, obj) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("1 doc deleted");
        res.status(200).json({ message: "Task deleted successfully" });
      }
    });
  } catch (error) {
    console.log("error is " + error);
    res.status(400).json({ error: "Invalid ObjectId" });
  }
});


