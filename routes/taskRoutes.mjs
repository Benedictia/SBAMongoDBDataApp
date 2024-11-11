import express from 'express';
import Task from '../models/task.mjs';

const router = express.Router();

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

// POST a new task
router.post('/', async (req, res) => {
  const { title, description, dueDate, status } = req.body;

  try {
    // Check if a task with the same title already exists
    const existingTask = await Task.findOne({ title });

    if (existingTask) {
      // If a task with the same title exists, send a proper error message
      return res.status(400).json({ message: 'Task with this title already exists.' });
    }

    // Create a new task with the provided fields
    const newTask = new Task({
      title,
      description,
      dueDate,
      status: status || 'Not Yet Started',  
    });

    // Save the new task to the database
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    // Handle unexpected errors
    console.error(err); 
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
});

// GET a specific task by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task', error: err.message });
  }
});

// PATCH - Update task status and due date by task ID
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, dueDate } = req.body;

  try {
    // Find the task by ID and update the status and due date
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { 
        status: status || undefined,  
        dueDate: dueDate || undefined   
      },
      { new: true }  
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
});

// PUT (update) a task with all fields (title, description, status, completed, etc.)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate, completed } = req.body;

  try {
    // Find the task by ID and update the fields
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status, dueDate, completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: 'Error updating task', error: err.message });
  }
});

// DELETE a task by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
});

export default router;
