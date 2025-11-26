import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@zod_users';
const CURRENT_USER_KEY = '@zod_current_user';

export interface User {
  name: string;
  email: string;
  password: string;
}

export const StorageService = {
  // Guardar nuevo usuario
  async saveUser(user: User): Promise<boolean> {
    try {
      const existingUsers = await this.getUsers();
      
      // Verificar si el email ya existe
      if (existingUsers.some(u => u.email === user.email)) {
        return false;
      }
      
      const updatedUsers = [...existingUsers, user];
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  },

  // Obtener todos los usuarios
  async getUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  },

  // Verificar credenciales de login
  async verifyLogin(email: string, password: string): Promise<User | null> {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      return user || null;
    } catch (error) {
      console.error('Error verifying login:', error);
      return null;
    }
  },

  // Guardar sesión actual
  async setCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  },

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },

  // Limpiar todo (útil para desarrollo)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([USERS_KEY, CURRENT_USER_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};