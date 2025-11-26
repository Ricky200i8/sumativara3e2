export const API_URL = "192.168.45.211:3000";

export interface Task {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  userEmail: string; // Para filtrar tareas por usuario logueado
}

export const TaskAPI = {
  async getTasks(email: string): Promise<Task[]> {
    const res = await fetch(`${API_URL}/tasks?userEmail=${email}`);
    return res.json();
  },

  async createTask(task: Task): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return res.json();
  },

  async updateTask(id: number, task: Task): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return res.json();
  },

  async deleteTask(id: number): Promise<void> {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
  },
};
