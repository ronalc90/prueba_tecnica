<template>
  <div v-if="message" :class="['alert', `alert-${type}`]">
    <span class="alert-icon">{{ icon }}</span>
    <span class="alert-text">{{ message }}</span>
    <button v-if="dismissible" @click="$emit('close')" class="alert-close">✕</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: true
  }
});

defineEmits(['close']);

const icon = computed(() => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  return icons[props.type];
});
</script>

<style scoped>
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  border-left: 4px solid;
  margin-bottom: 1rem;
}

.alert-success {
  background-color: #f0fdf4;
  color: var(--color-success);
  border-color: var(--color-success);
}

.alert-error {
  background-color: #fef2f2;
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.alert-warning {
  background-color: #fffbeb;
  color: var(--color-warning);
  border-color: var(--color-warning);
}

.alert-info {
  background-color: #eff6ff;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.alert-icon {
  font-weight: 700;
  font-size: 1.125rem;
}

.alert-text {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
}

.alert-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: currentColor;
  opacity: 0.7;
  transition: opacity 0.2s;
  font-size: 1rem;
}

.alert-close:hover {
  opacity: 1;
}
</style>
