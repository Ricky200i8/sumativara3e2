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
      console.log('💾 Intentando guardar usuario:', user.email);
      const existingUsers = await this.getUsers();
      
      // Verificar si el email ya existe
      if (existingUsers.some(u => u.email === user.email)) {
        console.warn('⚠️ El usuario ya existe:', user.email);
        return false;
      }
      
      const updatedUsers = [...existingUsers, user];
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      console.log('✅ Usuario guardado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error saving user:', error);
      return false;
    }
  },

  // Obtener todos los usuarios
  async getUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      console.log(`📋 Total de usuarios registrados: ${users.length}`);
      return users;
    } catch (error) {
      console.error('❌ Error getting users:', error);
      return [];
    }
  },

  // Verificar credenciales de login
  async verifyLogin(email: string, password: string): Promise<User | null> {
    try {
      console.log('🔐 Verificando login para:', email);
      const users = await this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        console.log('✅ Credenciales válidas');
      } else {
        console.warn('⚠️ Credenciales inválidas');
      }
      
      return user || null;
    } catch (error) {
      console.error('❌ Error verifying login:', error);
      return null;
    }
  },

  // Guardar sesión actual
  async setCurrentUser(user: User): Promise<void> {
    try {
      console.log('💾 Guardando sesión para:', user.email);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      console.log('✅ Sesión guardada correctamente');
    } catch (error) {
      console.error('❌ Error setting current user:', error);
    }
  },

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    try {
      console.log('🔍 Buscando usuario actual...');
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      
      if (userJson) {
        const user = JSON.parse(userJson);
        console.log('✅ Usuario actual encontrado:', user.email);
        return user;
      }
      
      console.warn('⚠️ No hay usuario logueado');
      return null;
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      console.log('🚪 Cerrando sesión...');
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('❌ Error logging out:', error);
    }
  },

  // Limpiar todo (útil para desarrollo)
  async clearAll(): Promise<void> {
    try {
      console.log('🗑️ Limpiando todo el almacenamiento...');
      await AsyncStorage.multiRemove([USERS_KEY, CURRENT_USER_KEY]);
      console.log('✅ Almacenamiento limpiado');
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
    }
  },

  // Verificar si hay sesión activa
  async isLoggedIn(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      console.error('❌ Error checking login status:', error);
      return false;
    }
  }
};