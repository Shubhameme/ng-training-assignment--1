import React, { useState, useEffect } from 'react';

const TaskForm = ({ task, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        assignedTo: '',
        status: '',
        dueDate: '',
        priority: '',
        description: '',
        comments: ''
    });

    // When the component mounts or task changes, update the form fields with task data
    useEffect(() => {
        if (task) {
            setFormData(task);
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Assigned To</label>
                <input
                    type="text"
                    name="assignedTo"
                    className="form-control"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Status</label>
                <select
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Status</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Not Started">Not Started</option>
                </select>
            </div>

            <div className="form-group">
                <label>Due Date</label>
                <input
                    type="date"
                    name="dueDate"
                    className="form-control"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Priority</label>
                <select
                    name="priority"
                    className="form-control"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    required
                ></textarea>
            </div>

            <div className="form-group">
                <label>Comments</label>
                <textarea
                    name="comments"
                    className="form-control"
                    value={formData.comments}
                    onChange={handleChange}
                    rows="4"
                    required
                ></textarea>
            </div>

            <div className="mt-3">
                <button type="submit" className="btn btn-success me-2">
                    {task && task.id ? 'Update Task' : 'Add Task'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
