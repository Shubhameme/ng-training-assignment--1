import React, { useState, useEffect } from 'react';
import { TaskService } from '../services/TaskService';
import TaskForm from './TaskForm';
import DeleteModal from './DeleteModal';
import 'bootstrap/dist/css/bootstrap.min.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [taskToView, setTaskToView] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const tasks = await TaskService.getAllTasks();
            setTasks(tasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleAddTask = async (newTask) => {
        try {
            await TaskService.createTask(newTask);
            await fetchTasks();
            setShowModal(false);
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleEditTask = async (updatedTask) => {
        try {
            await TaskService.updateTask(updatedTask);
            await fetchTasks();
            setTaskToEdit(null);
            setShowModal(false);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTask = async () => {
        try {
            await TaskService.deleteTask(taskToDelete.id);
            await fetchTasks();
            setTaskToDelete(null);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Enhanced filtering function to search through multiple fields(You can search by using any field in the form)
    const filteredTasks = tasks.filter((task) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            task.description.toLowerCase().includes(searchLower) ||
            task.assignedTo.toLowerCase().includes(searchLower) ||
            task.comments.toLowerCase().includes(searchLower) ||
            task.status.toLowerCase().includes(searchLower) ||
            task.dueDate.toLowerCase().includes(searchLower) ||
            task.priority.toLowerCase().includes(searchLower)
        );
    });

    const openDeleteModal = (task) => {
        setTaskToDelete(task);
    };

    const openEditModal = (task) => {
        setTaskToEdit(task);
        setIsEditing(true);
        setShowModal(true);
    };

    const openViewModal = (task) => {
        setTaskToView(task);
        setShowViewModal(true);
    };

    return (
        <div className="container">
            <h2 className="my-4">To-Do List</h2>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search tasks... (Any Field)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button className="btn btn-primary mb-3" onClick={() => {
                setIsEditing(false);
                setShowModal(true);
            }}>
                New Task
            </button>

            <table className="table table-striped table-bordered table-responsive-sm mt-4">
                <thead className="thead-dark">
                    <tr>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Priority</th>
                        <th>Comments</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.assignedTo}</td>
                            <td>{task.status}</td>
                            <td>{task.dueDate}</td>
                            <td>{task.priority}</td>
                            <td>{task.comments}</td>
                            <td>
                                <button className="btn btn-sm btn-info me-2" onClick={() => openViewModal(task)}>
                                    View
                                </button>
                                <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(task)}>
                                    Edit
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => openDeleteModal(task)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for adding/editing task */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Edit Task' : 'Add New Task'}</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <TaskForm
                                    task={isEditing ? taskToEdit : {}}
                                    onSave={isEditing ? handleEditTask : handleAddTask}
                                    onCancel={() => setShowModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for viewing task description */}
            {showViewModal && taskToView && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Task Description</h5>
                                <button type="button" className="close" onClick={() => setShowViewModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Description:</strong> {taskToView.description}</p>
                                <p><strong>Assigned To:</strong> {taskToView.assignedTo}</p>
                                <p><strong>Status:</strong> {taskToView.status}</p>
                                <p><strong>Due Date:</strong> {taskToView.dueDate}</p>
                                <p><strong>Priority:</strong> {taskToView.priority}</p>
                                <p><strong>Comments:</strong> {taskToView.comments}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirmation modal */}
            {taskToDelete && (
                <DeleteModal
                    taskName={taskToDelete.description}
                    onConfirm={handleDeleteTask}
                    onCancel={() => setTaskToDelete(null)}
                />
            )}
        </div>
    );
};

export default TaskList;
