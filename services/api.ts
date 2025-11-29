import axios from "axios";

export const API_URL =
  "https://3000-firebase-sumativara3e2-1763406693823.cluster-ocv3ypmyqfbqysslgd7zlhmxek.cloudworkstations.dev/tasks";

export interface Task {
  id?: string | number; // Acepta tanto string como number
  title: string;
  description: string;
  completed: boolean;
  userEmail: string;
}

export const TaskAPI = {
  async getTasks(email: string): Promise<Task[]> {
    try {
      const res = await axios.get(API_URL, {
        params: { userEmail: email },
      });
      return res.data;
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      return [];
    }
  },

  async createTask(task: Task): Promise<Task> {
    try {
      const res = await axios.post(API_URL, task);
      return res.data;
    } catch (error) {
      console.error("Error creando tarea:", error);
      throw error;
    }
  },

  async updateTask(id: string | number, task: Task): Promise<Task> {
    try {
      console.log('🔄 Actualizando tarea con ID:', id);
      console.log('🔍 Tipo de ID:', typeof id);
      console.log('📦 Datos a enviar:', task);
      
      // El ID puede ser string o number, no convertir
      console.log('📌 ID original:', id);
      
      const cleanTask = {
        title: task.title,
        description: task.description,
        completed: task.completed,
        userEmail: task.userEmail,
      };
      
      const url = `${API_URL}/${id}`;
      console.log('🌐 URL final:', url);
      console.log('✨ Datos a enviar:', JSON.stringify(cleanTask, null, 2));
      
      const res = await axios.put(url, cleanTask);
      
      console.log('✅ Respuesta exitosa:', res.data);
      return res.data;
    } catch (error) {
      console.error("❌ ===== ERROR UPDATE =====");
      console.error("Error completo:", error);
      
      if (axios.isAxiosError(error)) {
        console.error('📛 Status:', error.response?.status);
        console.error('📛 URL:', error.config?.url);
        console.error('📛 Método:', error.config?.method);
        console.error('📛 Data enviada:', error.config?.data);
        console.error('📛 Respuesta servidor:', error.response?.data);
      }
      
      throw error;
    }
  },

  async deleteTask(id: string | number): Promise<void> {
    try {
      console.log('🗑️ Eliminando tarea con ID:', id);
      await axios.delete(`${API_URL}/${id}`);
      console.log('✅ Tarea eliminada');
    } catch (error) {
      console.error("❌ Error eliminando tarea:", error);
      throw error;
    }
  },
};