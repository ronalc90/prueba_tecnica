<template>
  <div class="checkout-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Finalizar Compra</h1>
      </div>

      <AlertMessage
        v-if="error"
        :message="error"
        type="error"
        @close="error = ''"
      />

      <AlertMessage
        v-if="successMessage"
        :message="successMessage"
        type="success"
        :dismissible="false"
      />

      <div v-if="!orderCompleted" class="checkout-content">
        <div class="checkout-form card">
          <h2 class="section-title">Información de Envío</h2>
          <form @submit.prevent="handleCheckout">
            <div class="form-group">
              <label for="shippingAddress" class="form-label">
                Dirección de Envío *
              </label>
              <textarea
                id="shippingAddress"
                v-model="shippingAddress"
                class="input"
                rows="3"
                placeholder="Calle, número, ciudad, código postal, país"
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label for="paymentMethod" class="form-label">
                Método de Pago *
              </label>
              <select
                id="paymentMethod"
                v-model="paymentMethod"
                class="input"
                required
              >
                <option value="">Selecciona un método de pago</option>
                <option value="credit_card">Tarjeta de Crédito</option>
                <option value="debit_card">Tarjeta de Débito</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            <button
              type="submit"
              :disabled="loading || cartStore.items.length === 0"
              class="btn btn-primary btn-block"
            >
              {{ loading ? 'Procesando...' : 'Confirmar Pedido' }}
            </button>
          </form>
        </div>

        <div class="order-summary card">
          <h2 class="section-title">Resumen del Pedido</h2>

          <div class="summary-items">
            <div v-for="item in cartStore.items" :key="item.productId" class="summary-item">
              <div class="summary-item-info">
                <div class="summary-item-name">{{ item.name }}</div>
                <div class="summary-item-qty">Cantidad: {{ item.quantity }}</div>
              </div>
              <div class="summary-item-price">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row">
            <span>Subtotal</span>
            <span>${{ cartStore.total.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Envío</span>
            <span>Gratis</span>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-total">
            <span>Total</span>
            <span>${{ cartStore.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div v-else class="order-success">
        <div class="success-icon">✓</div>
        <h2>¡Pedido Completado!</h2>
        <p>Tu pedido ha sido procesado exitosamente.</p>
        <p class="order-id">Número de pedido: {{ completedOrder.id }}</p>
        <p v-if="emailPreviewUrl" class="email-preview">
          <a :href="emailPreviewUrl" target="_blank" class="btn btn-outline">
            Ver Correo de Confirmación
          </a>
        </p>
        <div class="success-actions">
          <router-link to="/products" class="btn btn-primary">
            Seguir Comprando
          </router-link>
          <router-link to="/orders" class="btn btn-outline">
            Ver Mis Pedidos
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import AlertMessage from '@/components/AlertMessage.vue';

const cartStore = useCartStore();

const shippingAddress = ref('');
const paymentMethod = ref('');
const loading = ref(false);
const error = ref('');
const successMessage = ref('');
const orderCompleted = ref(false);
const completedOrder = ref(null);
const emailPreviewUrl = ref('');

const handleCheckout = async () => {
  try {
    loading.value = true;
    error.value = '';

    const result = await cartStore.checkout(shippingAddress.value, paymentMethod.value);

    completedOrder.value = result.order;
    emailPreviewUrl.value = result.emailPreview;
    successMessage.value = result.message;
    orderCompleted.value = true;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    error.value = err.error?.message || 'Error al procesar el pedido';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  cartStore.fetchCart();
});
</script>

<style scoped>
.checkout-page {
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

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.checkout-form,
.order-summary {
  padding: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.btn-block {
  width: 100%;
  margin-top: 1rem;
}

.order-summary {
  position: sticky;
  top: 5rem;
}

.summary-items {
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item-info {
  flex: 1;
}

.summary-item-name {
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.summary-item-qty {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.summary-item-price {
  font-weight: 600;
  color: var(--color-text);
}

.summary-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 1rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: var(--color-text);
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 1rem;
  color: var(--color-text);
}

.order-success {
  text-align: center;
  padding: 4rem 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.success-icon {
  width: 80px;
  height: 80px;
  background-color: var(--color-success);
  color: white;
  font-size: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.order-success h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.order-success p {
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.order-id {
  font-weight: 600;
  color: var(--color-text);
  font-size: 1.125rem;
  margin-top: 1rem;
}

.email-preview {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .success-actions {
    flex-direction: column;
  }

  .success-actions .btn {
    width: 100%;
  }
}
</style>
