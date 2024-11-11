import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; 
import path from 'path';
import Task from './models/task.mjs';  
import taskRoutes from './routes/taskRoutes.mjs';  
// Load environment variables from .env

dotenv.config();  
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(process.cwd(), 'public')));

// Task routes for CRUD operations
app.use('/tasks', taskRoutes);

// MongoDB connection URI (from environment variable)
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/task-manager';  

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected!');
    
    // Seed database with tasks if it's empty
    seedDatabase();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Function to seed the database with 10 tasks
async function seedDatabase() {
  const taskCount = await Task.countDocuments();
  
  if (taskCount === 0) {
    // Create an array of tasks
    const tasks = [
      { title: "Task 1", description: "Complete the project proposal" },
      { title: "Task 2", description: "Read the next chapter of 'The Pragmatic Programmer'" },
      { title: "Task 3", description: "Buy groceries for the week" },
      { title: "Task 4", description: "Clean the house" },
      { title: "Task 5", description: "Write blog post on MongoDB" },
      { title: "Task 6", description: "Attend team meeting at 2 PM" },
      { title: "Task 7", description: "Fix bug in task manager API" },
      { title: "Task 8", description: "Call mom to check in" },
      { title: "Task 9", description: "Prepare slides for the upcoming presentation" },
      { title: "Task 10", description: "Meditate for 10 minutes" }
    ];

    // Insert tasks into the database
    try {
      await Task.insertMany(tasks);
      console.log('10 tasks created!');
    } catch (error) {
      console.error('Error creating tasks:', error);
    }
  }
}

// Serve the HTML page at the root (optional if you want a web interface)
app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
