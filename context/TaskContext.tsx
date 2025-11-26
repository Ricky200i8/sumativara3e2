// context/TaskContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { taskApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext'; // asumiendo que tienes uno

type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (id: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  refreshTasks: () => Promise<void>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // tu contexto de auth

  const refreshTasks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await taskApi.getAll(user.id);
      setTasks(data.sort((a, b) => b.id - a.id)); // más nuevas primero
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, [user]);

  const addTask = async (task: Omit<Task, "id">) => {
    const newTask = await taskApi.create(task);
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = async (id: number, changes: Partial<Task>) => {
    const updated = await taskApi.update(id, changes);
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };

  const deleteTask = async (id: number) => {
    await taskApi.delete(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, refreshTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks debe usarse dentro de TaskProvider");
  return context;
};