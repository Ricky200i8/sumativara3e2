import { createContext, useContext, useEffect, useState } from "react";
import { Task, TaskAPI } from "../services/api";
import { StorageService } from "../lib/storage";

interface TasksContextType {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: number, task: Task) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | null>(null);

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be inside Provider");
  return ctx;
};

export const TasksProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [email, setEmail] = useState("");

  // Obtener usuario
  useEffect(() => {
    const fetchUser = async () => {
      const u = await StorageService.getCurrentUser();
      if (u?.email) setEmail(u.email);
    };
    fetchUser();
  }, []);

  // Cargar tareas SOLO cuando email esté listo
  useEffect(() => {
    if (email) {
      loadTasks();
    }
  }, [email]);

  async function loadTasks() {
    if (!email) return;
    const data = await TaskAPI.getTasks(email);
    setTasks(data);
  }

  async function addTask(task: Task) {
    const newTask = await TaskAPI.createTask(task);
    setTasks((prev) => [...prev, newTask]);
  }

  async function updateTask(id: number, task: Task) {
    const updated = await TaskAPI.updateTask(id, task);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }

  async function deleteTask(id: number) {
    await TaskAPI.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const value = { tasks, loadTasks, addTask, updateTask, deleteTask };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};
