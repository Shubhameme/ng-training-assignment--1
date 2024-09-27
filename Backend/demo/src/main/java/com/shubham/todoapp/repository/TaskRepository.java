package com.shubham.todoapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shubham.todoapp.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
}

