import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { LayoutList, Activity, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await createTask(taskData);
      setTasks([response.data, ...tasks]);
    } catch (err) {
      console.error('Failed to create task:', err);
      alert('Failed to create task');
    }
  };

  const handleUpdateTask = async (id, updatedData) => {
    try {
      const response = await updateTask(id, updatedData);
      setTasks(tasks.map(task => task.id === id ? response.data : task));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <LayoutList className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Task Sheet</h1>
            <p className="text-gray-500 mt-1">Manage your daily tasks and productivity</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">{inProgressCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-green-500" />
          </div>
        </div>
      </div>

      <TaskForm onSubmit={handleCreateTask} />

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          Your Tasks
          <span className="bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-sm font-medium">{tasks.length}</span>
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center">
            {error}
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
            <LayoutList className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
