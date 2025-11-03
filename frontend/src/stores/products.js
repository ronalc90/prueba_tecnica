import { defineStore } from 'pinia';
import { ref } from 'vue';
import { productsAPI } from '@/services/api';

export const useProductsStore = defineStore('products', () => {
  const products = ref([]);
  const currentProduct = ref(null);
  const pagination = ref({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const filters = ref({
    category: '',
    search: ''
  });
  const loading = ref(false);
  const error = ref(null);

  const fetchProducts = async () => {
    try {
      loading.value = true;
      error.value = null;

      const params = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...(filters.value.category && { category: filters.value.category }),
        ...(filters.value.search && { search: filters.value.search })
      };

      const response = await productsAPI.getAll(params);

      products.value = response.data.products;
      pagination.value = response.data.pagination;
    } catch (err) {
      error.value = err.error?.message || 'Failed to fetch products';
    } finally {
      loading.value = false;
    }
  };

  const fetchProductById = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await productsAPI.getById(id);
      currentProduct.value = response.data;
    } catch (err) {
      error.value = err.error?.message || 'Failed to fetch product';
    } finally {
      loading.value = false;
    }
  };

  const setPage = (page) => {
    pagination.value.page = page;
    fetchProducts();
  };

  const setCategory = (category) => {
    filters.value.category = category;
    pagination.value.page = 1;
    fetchProducts();
  };

  const setSearch = (search) => {
    filters.value.search = search;
    pagination.value.page = 1;
    fetchProducts();
  };

  return {
    products,
    currentProduct,
    pagination,
    filters,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    setPage,
    setCategory,
    setSearch
  };
});
