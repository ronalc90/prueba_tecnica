import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { cartAPI, checkoutAPI } from '@/services/api';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref(null);

  const itemCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  const fetchCart = async () => {
    try {
      loading.value = true;
      error.value = null;

      const response = await cartAPI.get();

      items.value = response.data.items || [];
      total.value = response.data.total || 0;
    } catch (err) {
      error.value = err.error?.message || 'Failed to fetch cart';
    } finally {
      loading.value = false;
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await cartAPI.add(productId, quantity);

      items.value = response.data.items;
      total.value = response.data.total;

      return true;
    } catch (err) {
      error.value = err.error?.message || 'Failed to add to cart';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await cartAPI.remove(productId);

      items.value = response.data.items;
      total.value = response.data.total;
    } catch (err) {
      error.value = err.error?.message || 'Failed to remove from cart';
    } finally {
      loading.value = false;
    }
  };

  const checkout = async (shippingAddress, paymentMethod) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await checkoutAPI.process(shippingAddress, paymentMethod);

      items.value = [];
      total.value = 0;

      return response.data;
    } catch (err) {
      error.value = err.error?.message || 'Checkout failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    items,
    total,
    loading,
    error,
    itemCount,
    fetchCart,
    addToCart,
    removeFromCart,
    checkout
  };
});
