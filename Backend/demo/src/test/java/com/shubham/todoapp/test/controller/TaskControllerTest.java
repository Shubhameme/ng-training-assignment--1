package com.shubham.todoapp.test.controller;

import com.shubham.todoapp.controller.TaskController;
import com.shubham.todoapp.entity.Task;
import com.shubham.todoapp.repository.TaskRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.Optional;

@WebMvcTest(TaskController.class)
public class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @SuppressWarnings("removal")
    @MockBean
    private TaskRepository taskRepository;

    @Test
    public void testGetAllTasks() throws Exception {
        Task task1 = new Task(1L, "Shubham", "In Progress", "2024-10-12", 
                              "Low", "Learn to dance", "This task is enjoyable.");
        Task task2 = new Task(2L, "Piyush", "In Progress", "2024-10-15", 
                              "High", "Learn to swim", "He is improving his swimming skills.");

        Mockito.when(taskRepository.findAll()).thenReturn(Arrays.asList(task1, task2));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].assignedTo").value("Shubham"))
                .andExpect(jsonPath("$[1].assignedTo").value("Piyush"));
    }

    @Test
    public void testCreateTask() throws Exception {
        Task task = new Task(null, "Alice", "Pending", "2024-11-01", 
                             "High", "Complete project documentation", 
                             "Ensure all sections are covered.");
        Task savedTask = new Task(3L, "Alice", "Pending", "2024-11-01", 
                                  "High", "Complete project documentation", 
                                  "Ensure all sections are covered.");

        Mockito.when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        String taskJson = "{"
                + "\"assignedTo\":\"Alice\","
                + "\"status\":\"Pending\","
                + "\"dueDate\":\"2024-11-01\","
                + "\"priority\":\"High\","
                + "\"description\":\"Complete project documentation\","
                + "\"comments\":\"Ensure all sections are covered.\""
                + "}";

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(taskJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3)) // Corrected expectation
                .andExpect(jsonPath("$.assignedTo").value("Alice"));
    }

    @Test
    public void testUpdateTask() throws Exception {
        Long taskId = 1L; // Consistent ID

        Task existingTask = new Task(taskId, "Shubham", "In Progress", "2024-10-12", 
                                     "Low", "Learn to dance", "This task is enjoyable.");
        Task updatedTask = new Task(taskId, "Shubham", "Completed", "2024-10-12", 
                                    "Low", "Learn to dance", "Task completed successfully.");

        Mockito.when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));
        Mockito.when(taskRepository.save(any(Task.class))).thenReturn(updatedTask);

        String updatedTaskJson = "{"
                + "\"assignedTo\":\"Shubham\","
                + "\"status\":\"Completed\","
                + "\"dueDate\":\"2024-10-12\","
                + "\"priority\":\"Low\","
                + "\"description\":\"Learn to dance\","
                + "\"comments\":\"Task completed successfully.\""
                + "}";

        mockMvc.perform(put("/api/tasks/" + taskId) // Include ID in URL
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedTaskJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Completed"))
                .andExpect(jsonPath("$.comments").value("Task completed successfully."));
    }

    @Test
    public void testDeleteTask() throws Exception {
        Long taskId = 1L; // Consistent ID

        Task existingTask = new Task(taskId, "Shubham", "In Progress", "2024-10-12", 
                                     "Low", "Learn to dance", "This task is enjoyable.");

        Mockito.when(taskRepository.findById(taskId)).thenReturn(Optional.of(existingTask));

        mockMvc.perform(delete("/api/tasks/" + taskId)) // Use consistent ID
                .andExpect(status().isOk());

        Mockito.verify(taskRepository, Mockito.times(1)).delete(existingTask);
    }

    @Test
    public void testGetTaskById_NotFound() throws Exception {
        Long taskId = 10L; // Consistent ID with request

        Mockito.when(taskRepository.findById(taskId)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/tasks/" + taskId)) // Use taskId = 10
                .andExpect(status().isNotFound());
    }
}
