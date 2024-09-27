// src/components/TaskList.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskList from './TaskList';
import { TaskService } from '../services/TaskService';

// Mock TaskService
jest.mock('../services/TaskService');

const mockTasks = [
    {
        id: 130,
        assignedTo: 'Shubham',
        status: 'In Progress',
        dueDate: '2024-10-12',
        priority: 'Low',
        description: 'Learn to dance',
        comments: 'This task is enjoyable.',
    },
    {
        id: 131,
        assignedTo: 'Piyush',
        status: 'In Progress',
        dueDate: '2024-10-15',
        priority: 'High',
        description: 'Learn to swim',
        comments: 'He is improving his swimming skills.',
    },
];

describe('TaskList Component', () => {
    beforeEach(() => {
        TaskService.getAllTasks.mockResolvedValue(mockTasks);
        TaskService.createTask.mockImplementation((task) =>
            Promise.resolve({ id: 3, ...task })
        );
        TaskService.updateTask.mockImplementation((task) => Promise.resolve(task));
        TaskService.deleteTask.mockResolvedValue(1);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders task list correctly', async () => {
        render(<TaskList />);

        expect(TaskService.getAllTasks).toHaveBeenCalledTimes(1);

        // Wait for tasks to load
        await waitFor(() => {
            expect(screen.getByText('Shubham')).toBeInTheDocument();
            expect(screen.getByText('Piyush')).toBeInTheDocument();
        });
    });

    test('can add a new task', async () => {
        render(<TaskList />);

        // Wait for tasks to load
        await waitFor(() => {
            expect(screen.getByText('Shubham')).toBeInTheDocument();
        });

        // Open add task modal
        fireEvent.click(screen.getByText('New Task'));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/Assigned To/i), {
            target: { value: 'Ajinkya' },
        });
        fireEvent.change(screen.getByLabelText(/Status/i), {
            target: { value: 'Pending' },
        });
        fireEvent.change(screen.getByLabelText(/Due Date/i), {
            target: { value: '2024-11-01' },
        });
        fireEvent.change(screen.getByLabelText(/Priority/i), {
            target: { value: 'Medium' },
        });
        fireEvent.change(screen.getByLabelText(/Comments/i), {
            target: { value: 'This is a new task.' },
        });

        // Submit the form
        fireEvent.click(screen.getByText('Save'));

        // Ensure createTask was called
        await waitFor(() => {
            expect(TaskService.createTask).toHaveBeenCalledWith({
                assignedTo: 'Ajinkya',
                status: 'Pending',
                dueDate: '2024-11-01',
                priority: 'Medium',
                comments: 'This is a new task.',
            });
        });

        // Wait for the new task to appear
        await waitFor(() => {
            expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        });
    });

    test('can delete a task', async () => {
        render(<TaskList />);

        // Wait for tasks to load
        await waitFor(() => {
            expect(screen.getByText('Shubham')).toBeInTheDocument();
        });

        // Click delete button on first task
        fireEvent.click(screen.getAllByText('Delete')[0]);

        // Confirm deletion
        fireEvent.click(screen.getByText('Delete'));

        // Ensure deleteTask was called
        await waitFor(() => {
            expect(TaskService.deleteTask).toHaveBeenCalledWith(1);
        });

        // Wait for the task to be removed
        await waitFor(() => {
            expect(screen.queryByText('Shubham')).not.toBeInTheDocument();
        });
    });

    test('can view task details', async () => {
        render(<TaskList />);

        // Wait for tasks to load
        await waitFor(() => {
            expect(screen.getByText('Shubham')).toBeInTheDocument();
        });

        // Click view button on first task
        fireEvent.click(screen.getAllByText('View')[0]);

        // Check if modal is displayed with task description
        await waitFor(() => {
            expect(screen.getByText('Task Description')).toBeInTheDocument();
            expect(screen.getByText('Learn to dance')).toBeInTheDocument();
            expect(screen.getByText('Shubham')).toBeInTheDocument();
        });

        // Close the modal
        fireEvent.click(screen.getByText('×'));

        // Ensure modal is closed
        await waitFor(() => {
            expect(screen.queryByText('Task Description')).not.toBeInTheDocument();
        });
    });
});
