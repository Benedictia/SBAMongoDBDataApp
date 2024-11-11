
import mongoose from 'mongoose';

// Define task schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'], 
    unique: true, 
    minlength: [3, 'Title must be at least 3 characters long'], 
    maxlength: [100, 'Title must be at most 100 characters long'], 
    trim: true 
  },
  description: {
    type: String,
    required: [true, 'Description is required'], 
    minlength: [10, 'Description must be at least 10 characters long'], 
    maxlength: [500, 'Description must be at most 500 characters long'], 
    trim: true 
  },
  completed: {
    type: Boolean,
    default: false, 
  }
}, { timestamps: true }); 

// Create an index on the 'completed' field to speed up queries for filtering completed tasks
taskSchema.index({ completed: 1 });



const Task = mongoose.model('Task', taskSchema);

export default Task;

