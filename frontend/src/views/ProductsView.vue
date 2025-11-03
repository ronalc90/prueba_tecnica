<template>
  <div class="products-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Our Products</h1>
        <p class="page-subtitle">Discover the best sports equipment for your needs</p>
      </div>

      <div class="filters-section">
        <div class="search-box">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            class="input"
            placeholder="Search products..."
          />
        </div>

        <div class="category-filters">
          <button
            @click="handleCategoryChange('')"
            :class="['filter-btn', { active: !productsStore.filters.category }]"
          >
            All
          </button>
          <button
            v-for="category in categories"
            :key="category"
            @click="handleCategoryChange(category)"
            :class="['filter-btn', { active: productsStore.filters.category === category }]"
          >
            {{ formatCategory(category) }}
          </button>
        </div>
      </div>

      <AlertMessage
        v-if="productsStore.error"
        :message="productsStore.error"
        type="error"
        @close="productsStore.error = null"
      />

      <AlertMessage
        v-if="successMessage"
        :message="successMessage"
        type="success"
        @close="successMessage = ''"
      />

      <LoadingSpinner v-if="productsStore.loading" message="Loading products..." />

      <div v-else-if="productsStore.products.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search query</p>
      </div>

      <div v-else class="products-grid">
        <ProductCard
          v-for="product in productsStore.products"
          :key="product.id"
          :product="product"
          @added="handleProductAdded"
        />
      </div>

      <div v-if="productsStore.pagination.totalPages > 1" class="pagination">
        <button
          @click="changePage(productsStore.pagination.page - 1)"
          :disabled="productsStore.pagination.page === 1"
          class="btn btn-outline"
        >
          Previous
        </button>

        <div class="pagination-info">
          Page {{ productsStore.pagination.page }} of {{ productsStore.pagination.totalPages }}
        </div>

        <button
          @click="changePage(productsStore.pagination.page + 1)"
          :disabled="productsStore.pagination.page === productsStore.pagination.totalPages"
          class="btn btn-outline"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProductsStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';
import ProductCard from '@/components/ProductCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import AlertMessage from '@/components/AlertMessage.vue';

const productsStore = useProductsStore();
const cartStore = useCartStore();

const searchQuery = ref('');
const successMessage = ref('');

const categories = [
  'soccer', 'basketball', 'tennis', 'running', 'yoga',
  'boxing', 'swimming', 'cycling', 'golf', 'baseball',
  'volleyball', 'fitness', 'skateboarding', 'football', 'hockey'
];

const formatCategory = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const handleCategoryChange = (category) => {
  productsStore.setCategory(category);
};

let searchTimeout;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    productsStore.setSearch(searchQuery.value);
  }, 500);
};

const changePage = (page) => {
  productsStore.setPage(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleProductAdded = (product) => {
  successMessage.value = `${product.name} added to cart!`;
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
};

onMounted(() => {
  productsStore.fetchProducts();
  cartStore.fetchCart();
});
</script>

<style scoped>
.products-page {
  padding: 2rem 0;
  min-height: calc(100vh - 4rem);
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-light);
}

.filters-section {
  margin-bottom: 2rem;
}

.search-box {
  margin-bottom: 1.5rem;
}

.category-filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text-light);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-btn.active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--color-text-light);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.pagination-info {
  font-weight: 500;
  color: var(--color-text);
}

@media (max-width: 640px) {
  .page-title {
    font-size: 2rem;
  }

  .category-filters {
    gap: 0.5rem;
  }

  .filter-btn {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
}
</style>
