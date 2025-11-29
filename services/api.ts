import axios from "axios";

export const API_URL =
  "https://3000-firebase-sumativara3e2-1763406693823.cluster-ocv3ypmyqfbqysslgd7zlhmxek.cloudworkstations.dev/tasks";
export const USERS_URL =
  "https://3000-firebase-sumativara3e2-1763406693823.cluster-ocv3ypmyqfbqysslgd7zlhmxek.cloudworkstations.dev/users";

export interface Task {
  id?: string | number;
  title: string;
  description: string;
  completed: boolean;
  userEmail: string;
}

export interface User {
  id?: string | number;
  name: string;
  email: string;
  password: string;
  createdAt?: string;
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

// API de Usuarios
export const UserAPI = {
  async register(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      console.log('📝 Registrando usuario:', user.email);
      
      // Verificar si el email ya existe
      const existingUsers = await axios.get(USERS_URL, {
        params: { email: user.email }
      });

      if (existingUsers.data.length > 0) {
        throw new Error('EMAIL_EXISTS');
      }

      // Crear usuario
      const newUser = {
        ...user,
        createdAt: new Date().toISOString()
      };

      const res = await axios.post(USERS_URL, newUser);
      console.log('✅ Usuario registrado:', res.data);
      return res.data;
    } catch (error) {
      console.error('❌ Error registrando usuario:', error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<User | null> {
    try {
      console.log('🔐 Intentando login:', email);
      
      const res = await axios.get(USERS_URL, {
        params: { email }
      });

      if (res.data.length === 0) {
        console.log('❌ Usuario no encontrado');
        return null;
      }

      const user = res.data[0];
      
      if (user.password !== password) {
        console.log('❌ Contraseña incorrecta');
        return null;
      }

      console.log('✅ Login exitoso');
      return user;
    } catch (error) {
      console.error('❌ Error en login:', error);
      return null;
    }
  },

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const res = await axios.get(USERS_URL, {
        params: { email }
      });

      return res.data.length > 0 ? res.data[0] : null;
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      return null;
    }
  }
};