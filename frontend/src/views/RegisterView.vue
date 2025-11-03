<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card card">
        <div class="auth-header">
          <div class="auth-logo">⚽</div>
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Join Sports Shop today</p>
        </div>

        <AlertMessage
          v-if="authStore.error"
          :message="authStore.error"
          type="error"
          @close="authStore.error = null"
        />

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="input"
              placeholder="John Doe"
              required
            />
          </div>

          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="input"
              placeholder="your@email.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="input"
              placeholder="••••••••"
              minlength="6"
              required
            />
          </div>

          <div class="form-group">
            <label for="address" class="form-label">Address (Optional)</label>
            <input
              id="address"
              v-model="address"
              type="text"
              class="input"
              placeholder="123 Main St, City, Country"
            />
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn btn-primary btn-block"
          >
            {{ authStore.loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="auth-footer">
          <p class="auth-footer-text">
            Already have an account?
            <router-link to="/login" class="auth-link">Sign in</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AlertMessage from '@/components/AlertMessage.vue';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const address = ref('');

const handleRegister = async () => {
  const success = await authStore.register(
    email.value,
    password.value,
    name.value,
    address.value
  );
  if (success) {
    router.push('/');
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-container {
  width: 100%;
  max-width: 28rem;
}

.auth-card {
  padding: 2rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.auth-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.btn-block {
  width: 100%;
  margin-top: 0.5rem;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-footer-text {
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.auth-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
