<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <router-link to="/" class="logo">
        <span class="logo-icon">⚽</span>
        <span class="logo-text">Sports Shop</span>
      </router-link>

      <div class="nav-links">
        <router-link to="/products" class="nav-link">Products</router-link>
        <router-link to="/orders" class="nav-link">Orders</router-link>
        <router-link to="/cart" class="nav-link cart-link">
          <span class="cart-icon">🛒</span>
          <span v-if="cartStore.itemCount > 0" class="cart-badge">
            {{ cartStore.itemCount }}
          </span>
        </router-link>
        <button @click="handleLogout" class="btn btn-outline btn-sm">
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 700;
  font-size: 1.25rem;
}

.logo-icon {
  font-size: 1.75rem;
}

.logo-text {
  background: linear-gradient(135deg, var(--color-primary), #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--color-text-light);
  font-weight: 500;
  transition: color 0.2s;
  position: relative;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link.router-link-active {
  color: var(--color-primary);
}

.cart-link {
  position: relative;
}

.cart-icon {
  font-size: 1.25rem;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--color-danger);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 1.25rem;
  text-align: center;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.813rem;
}

@media (max-width: 640px) {
  .logo-text {
    display: none;
  }

  .nav-links {
    gap: 1rem;
  }

  .nav-link span {
    display: none;
  }
}
</style>
