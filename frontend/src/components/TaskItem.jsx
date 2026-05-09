import React, { useState } from 'react';
import { Calendar, Trash2, CheckCircle2, Circle, Clock, Edit2, X, Check } from 'lucide-react';
import { format } from 'date-fns';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editDueDate, setEditDueDate] = useState(task.due_date || '');

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleStatus = () => {
    const nextStatus = task.status === 'completed' ? 'pending' : 
                       task.status === 'pending' ? 'in-progress' : 'completed';
    onUpdate(task.id, { ...task, status: nextStatus });
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    onUpdate(task.id, {
      ...task,
      title: editTitle,
      description: editDescription,
      due_date: editDueDate || null
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditDueDate(task.due_date || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-primary/40 p-5 group flex flex-col gap-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-lg font-semibold rounded-lg border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Task title"
          autoFocus
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full text-sm text-gray-700 rounded-lg border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Description"
          rows="2"
        />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="w-full sm:w-auto text-sm rounded-lg border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editTitle.trim()}
              className="px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group flex items-start gap-4">
      <button 
        onClick={toggleStatus}
        className="mt-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full transition-transform hover:scale-110"
      >
        {getStatusIcon()}
      </button>

      <div className="flex-1 min-w-0">
        <h3 className={`text-lg font-semibold truncate ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1 text-gray-600 text-sm line-clamp-2">{task.description}</p>
        )}
        
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor()}`}>
            {task.status.replace('-', ' ').toUpperCase()}
          </span>
          
          {task.due_date && (
            <span className="inline-flex items-center text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {format(new Date(task.due_date), 'MMM d, yyyy')}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="text-gray-400 hover:text-primary focus:opacity-100 p-2 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-primary"
          title="Edit task"
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-500 focus:opacity-100 p-2 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          title="Delete task"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
