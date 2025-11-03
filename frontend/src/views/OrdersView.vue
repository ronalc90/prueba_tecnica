<template>
  <div class="orders-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Mis Pedidos</h1>
        <p class="page-subtitle">Historial de todas tus compras</p>
      </div>

      <AlertMessage
        v-if="error"
        :message="error"
        type="error"
        @close="error = ''"
      />

      <LoadingSpinner v-if="loading" message="Cargando pedidos..." />

      <div v-else-if="orders.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No tienes pedidos aún</h3>
        <p>Realiza tu primera compra para ver tus pedidos aquí</p>
        <router-link to="/products" class="btn btn-primary">
          Explorar Productos
        </router-link>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card card">
          <div class="order-header">
            <div class="order-info">
              <div class="order-id">Pedido #{{ order.id.slice(0, 8) }}</div>
              <div class="order-date">{{ formatDate(order.createdAt) }}</div>
            </div>
            <div class="order-status">
              <span :class="['status-badge', order.status]">
                {{ formatStatus(order.status) }}
              </span>
            </div>
          </div>

          <div class="order-items">
            <div v-for="item in order.items" :key="item.productId" class="order-item">
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-details">
                  Cantidad: {{ item.quantity }} × ${{ item.price.toFixed(2) }}
                </div>
              </div>
              <div class="item-total">
                ${{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-details">
              <div class="detail-row">
                <span class="detail-label">Dirección de envío:</span>
                <span class="detail-value">{{ order.shippingAddress }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Método de pago:</span>
                <span class="detail-value">{{ formatPaymentMethod(order.paymentMethod) }}</span>
              </div>
            </div>
            <div class="order-total">
              <span class="total-label">Total:</span>
              <span class="total-amount">${{ order.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ordersAPI } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import AlertMessage from '@/components/AlertMessage.vue';

const orders = ref([]);
const loading = ref(false);
const error = ref('');

const fetchOrders = async () => {
  try {
    loading.value = true;
    error.value = '';

    const response = await ordersAPI.getAll();
    orders.value = response.data;
  } catch (err) {
    error.value = err.error?.message || 'Error al cargar los pedidos';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatStatus = (status) => {
  const statusMap = {
    completed: 'Completado',
    pending: 'Pendiente',
    processing: 'Procesando',
    cancelled: 'Cancelado'
  };
  return statusMap[status] || status;
};

const formatPaymentMethod = (method) => {
  const methodMap = {
    credit_card: 'Tarjeta de Crédito',
    debit_card: 'Tarjeta de Débito',
    paypal: 'PayPal'
  };
  return methodMap[method] || method;
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.orders-page {
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
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--color-text-light);
  font-size: 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--color-text-light);
  margin-bottom: 2rem;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  padding: 1.5rem;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.order-id {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.order-date {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.status-badge {
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-md);
  font-size: 0.813rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.completed {
  background-color: #d1fae5;
  color: #065f46;
}

.status-badge.pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-badge.processing {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-badge.cancelled {
  background-color: #fee2e2;
  color: #991b1b;
}

.order-items {
  margin-bottom: 1.5rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.order-item:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.item-details {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.item-total {
  font-weight: 600;
  color: var(--color-text);
}

.order-footer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  font-size: 0.875rem;
}

.detail-label {
  color: var(--color-text-light);
  margin-right: 0.5rem;
}

.detail-value {
  color: var(--color-text);
  font-weight: 500;
}

.order-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.total-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.total-amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .order-footer {
    grid-template-columns: 1fr;
  }

  .order-total {
    align-items: flex-start;
    margin-top: 1rem;
  }
}
</style>
