import axios from "axios";

export const API_URL =
  "https://3000-firebase-sumativara3e2-1763406693823.cluster-ocv3ypmyqfbqysslgd7zlhmxek.cloudworkstations.dev/tasks";

export interface Task {
  id?: number;
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

  async updateTask(id: number, task: Task): Promise<Task> {
    try {
      const res = await axios.put(`${API_URL}/${id}`, task);
      return res.data;
    } catch (error) {
      console.error("Error actualizando tarea:", error);
      throw error;
    }
  },

  async deleteTask(id: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  },
};
