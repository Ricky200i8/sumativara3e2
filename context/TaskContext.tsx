import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Task, TaskAPI } from "../services/api";
import { StorageService } from "../lib/storage";

interface TasksContextType {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: number, task: Task) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
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

  // Obtener usuario al montar el componente
  useEffect(() => {
    const fetchUser = async () => {
      console.log("🔐 Obteniendo usuario actual...");
      const u = await StorageService.getCurrentUser();
      
      if (u?.email) {
        console.log(`✅ Usuario encontrado: ${u.email}`);
        setEmail(u.email);
      } else {
        console.warn("⚠️ No hay usuario logueado");
      }
    };
    fetchUser();
  }, []);

  // useCallback para evitar recrear la función en cada render
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
      setTasks(data);
    } catch (error) {
      console.error("❌ Error al cargar tareas:", error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [email]); // Solo se recrea cuando cambia el email

  // Cargar tareas cuando el email esté disponible
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

  async function updateTask(id: number, task: Task) {
    try {
      const updated = await TaskAPI.updateTask(id, task);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      console.log("✅ Tarea actualizada en el estado local");
    } catch (error) {
      console.error("❌ Error al actualizar tarea:", error);
      throw error;
    }
  }

  async function deleteTask(id: number) {
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