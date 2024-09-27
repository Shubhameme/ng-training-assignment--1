import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tasks'; // Backend Java Application URL

export const TaskService = {
  getAllTasks: () => {
    return axios.get(API_URL)
      .then(response => response.data) // Return the data from the response
      .catch(error => {
        console.error("Error fetching tasks:", error);
        throw error; // Propagate error for handling in component
      });
  },

  createTask: (task) => {
    return axios.post(API_URL, task)
      .then(response => response.data) // Return the created task
      .catch(error => {
        console.error("Error creating task:", error);
        throw error; // Propagate error for handling in component
      });
  },

  updateTask: (updatedTask) => {
    return axios.put(`${API_URL}/${updatedTask.id}`, updatedTask)
      .then(response => response.data) // Return the updated task
      .catch(error => {
        console.error("Error updating task:", error);
        throw error; // Propagate error for handling in component
      });
  },

  deleteTask: (id) => {
    return axios.delete(`${API_URL}/${id}`)
      .then(() => id) // Return the ID of the deleted task
      .catch(error => {
        console.error("Error deleting task:", error);
        throw error; // Propagate error for handling in component
      });
  }
};
