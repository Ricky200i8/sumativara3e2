import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Task, TaskAPI } from "../services/api";
import { StorageService } from "../lib/storage";

interface TasksContextType {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string | number, task: Task) => Promise<void>;
  deleteTask: (id: string | number) => Promise<void>;
  isLoading: boolean;
  userEmail: string;
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("🔐 Obteniendo usuario actual...");
      const u = await StorageService.getCurrentUser();
      
      if (u?.email) {
        console.log(`✅ Usuario encontrado: ${u.email}`);
        setEmail(u.email);
      } else {
        console.warn("⚠️ No hay usuario logueado");
        setEmail(""); // Limpiar el email si no hay usuario
        setTasks([]); // Limpiar las tareas
      }
    };
    fetchUser();

    // Recargar el usuario cada vez que la app se enfoca
    const interval = setInterval(fetchUser, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadTasks = useCallback(async () => {
    if (!email) {
      console.warn("⚠️ No se puede cargar tareas sin email");
      return;
    }

    setIsLoading(true);
    console.log(`🔄 Cargando tareas para: ${email}`);
    
    try {
      const data = await TaskAPI.getTasks(email);
      console.log(`✅ ${data.length} tareas cargadas`);
      console.log('📋 IDs de tareas:', data.map(t => ({ id: t.id, type: typeof t.id })));
      setTasks(data);
    } catch (error) {
      console.error("❌ Error al cargar tareas:", error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (email) {
      loadTasks();
    }
  }, [email, loadTasks]);

  async function addTask(task: Task) {
    if (!email) {
      console.error("❌ No hay email para crear tarea");
      return;
    }

    try {
      const taskWithEmail = { ...task, userEmail: email };
      const newTask = await TaskAPI.createTask(taskWithEmail);
      setTasks((prev) => [...prev, newTask]);
      console.log("✅ Tarea agregada al estado local");
    } catch (error) {
      console.error("❌ Error al agregar tarea:", error);
      throw error;
    }
  }

  async function updateTask(id: string | number, task: Task) {
    try {
      console.log('🔄 Context: Actualizando tarea con ID:', id, 'tipo:', typeof id);
      const updated = await TaskAPI.updateTask(id, task);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      console.log("✅ Tarea actualizada en el estado local");
    } catch (error) {
      console.error("❌ Error al actualizar tarea:", error);
      throw error;
    }
  }

  async function deleteTask(id: string | number) {
    try {
      await TaskAPI.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      console.log("✅ Tarea eliminada del estado local");
    } catch (error) {
      console.error("❌ Error al eliminar tarea:", error);
      throw error;
    }
  }

  const value = {
    tasks,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    isLoading,
    userEmail: email,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};