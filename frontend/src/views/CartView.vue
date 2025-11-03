<template>
  <div class="cart-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Carrito de Compras</h1>
      </div>

      <AlertMessage
        v-if="cartStore.error"
        :message="cartStore.error"
        type="error"
        @close="cartStore.error = null"
      />

      <LoadingSpinner v-if="cartStore.loading" message="Cargando carrito..." />

      <div v-else-if="cartStore.items.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega algunos productos para comenzar tu compra</p>
        <router-link to="/products" class="btn btn-primary">
          Ver Productos
        </router-link>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item.productId" class="cart-item card">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" @error="handleImageError" />
            </div>
            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <div class="item-price">${{ item.price.toFixed(2) }}</div>
              <div class="item-quantity">
                Cantidad: <strong>{{ item.quantity }}</strong>
              </div>
            </div>
            <div class="item-total">
              <div class="total-label">Subtotal</div>
              <div class="total-price">${{ (item.price * item.quantity).toFixed(2) }}</div>
              <button
                @click="removeItem(item.productId)"
                class="btn btn-danger btn-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary card">
          <h3 class="summary-title">Resumen del Pedido</h3>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${{ cartStore.total.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row summary-total">
            <span>Total</span>
            <span>${{ cartStore.total.toFixed(2) }}</span>
          </div>
          <router-link to="/checkout" class="btn btn-primary btn-block">
            Proceder al Pago
          </router-link>
          <router-link to="/products" class="btn btn-outline btn-block">
            Continuar Comprando
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import AlertMessage from '@/components/AlertMessage.vue';

const cartStore = useCartStore();

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/150?text=Producto';
};

const removeItem = async (productId) => {
  await cartStore.removeFromCart(productId);
};

onMounted(() => {
  cartStore.fetchCart();
});
</script>

<style scoped>
.cart-page {
  padding: 2rem 0;
  min-height: calc(100vh - 4rem);
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
}

.empty-cart {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.empty-cart h3 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.empty-cart p {
  color: var(--color-text-light);
  margin-bottom: 2rem;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 150px 1fr auto;
  gap: 1.5rem;
  padding: 1.5rem;
  align-items: center;
}

.item-image {
  width: 150px;
  height: 150px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--color-background);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
}

.item-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.item-quantity {
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.item-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.total-label {
  font-size: 0.75rem;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.total-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.cart-summary {
  position: sticky;
  top: 5rem;
  padding: 1.5rem;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.summary-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 1rem 0;
}

.summary-total {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 1rem;
}

.btn-block {
  width: 100%;
  margin-top: 1rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.813rem;
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-item {
    grid-template-columns: 100px 1fr;
    gap: 1rem;
  }

  .item-image {
    width: 100px;
    height: 100px;
  }

  .item-total {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
}
</style>
