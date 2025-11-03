<template>
  <div class="product-card card">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" @error="handleImageError" />
      <div v-if="product.stock < 10" class="stock-badge">
        Only {{ product.stock }} left
      </div>
    </div>
    <div class="product-content">
      <div class="product-category">{{ formatCategory(product.category) }}</div>
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-footer">
        <div class="product-price">${{ product.price.toFixed(2) }}</div>
        <button
          @click="handleAddToCart"
          :disabled="loading || product.stock === 0"
          class="btn btn-primary btn-sm"
        >
          <span v-if="loading">Adding...</span>
          <span v-else-if="product.stock === 0">Out of Stock</span>
          <span v-else>Add to Cart</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['added']);

const cartStore = useCartStore();
const loading = ref(false);

const formatCategory = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const handleImageError = (event) => {
  event.target.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(props.product.name)}`;
};

const handleAddToCart = async () => {
  loading.value = true;
  const success = await cartStore.addToCart(props.product.id, 1);
  loading.value = false;

  if (success) {
    emit('added', props.product);
  }
};
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 75%;
  overflow: hidden;
  background-color: var(--color-background);
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stock-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: var(--color-warning);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 600;
}

.product-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
}

.product-category {
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.product-description {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 1rem;
  flex: 1;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.813rem;
}
</style>
