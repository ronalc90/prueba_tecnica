import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI } from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  const initAuth = () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
    }
  };

  const login = async (email, password) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await authAPI.login(email, password);

      user.value = response.data.user;
      token.value = response.data.token;

      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));

      return true;
    } catch (err) {
      error.value = err.error?.message || 'Login failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const register = async (email, password, name, address) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await authAPI.register(email, password, name, address);

      user.value = response.data.user;
      token.value = response.data.token;

      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));

      return true;
    } catch (err) {
      error.value = err.error?.message || 'Registration failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  initAuth();

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout
  };
});
