import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../services/api';

const CURRENT_USER_KEY = '@current_user';

export const StorageService = {
  // Guardar usuario actual en sesión
  async setCurrentUser(user: User): Promise<void> {
    try {
      const userData = JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        // NO guardar password en AsyncStorage por seguridad
      });
      await AsyncStorage.setItem(CURRENT_USER_KEY, userData);
      console.log('✅ Sesión guardada:', user.email);
    } catch (error) {
      console.error('❌ Error guardando sesión:', error);
      throw error;
    }
  },

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
      
      if (!userData) {
        console.log('⚠️ No hay sesión activa');
        return null;
      }

      const user = JSON.parse(userData);
      console.log('✅ Sesión recuperada:', user.email);
      return user;
    } catch (error) {
      console.error('❌ Error obteniendo sesión:', error);
      return null;
    }
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      throw error;
    }
  },

  // Verificar si hay sesión activa
  async hasActiveSession(): Promise<boolean> {
    try {
      const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userData !== null;
    } catch (error) {
      console.error('❌ Error verificando sesión:', error);
      return false;
    }
  }
};