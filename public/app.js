
// Fetch all tasks from the server
async function fetchTasks() {
    try {
      const response = await fetch('/tasks');
      const tasks = await response.json();
      displayTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }
  
  // Display tasks on the webpage
  function displayTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; 
  
    tasks.forEach(task => {
      const taskItem = document.createElement('div');
      taskItem.classList.add('task-item');
      taskItem.innerHTML = `
        <div>
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p>Status: ${task.completed ? 'Completed' : 'Not Completed'}</p>
        </div>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      `;
      taskList.appendChild(taskItem);
    });
  }
  
  // Add a new task
  async function addTask(title, description) {
    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      const newTask = await response.json();
      fetchTasks(); 
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
  
  // Delete a task
  async function deleteTask(id) {
    try {
      await fetch(`/tasks/${id}`, { method: 'DELETE' });
      fetchTasks(); 
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
  
  // Event listener to add task
  document.getElementById('add-task-btn').addEventListener('click', () => {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
  
    if (title && description) {
      addTask(title, description);
    } else {
      alert('Please fill in both the title and description!');
    }
  });
  
  
  fetchTasks();
  