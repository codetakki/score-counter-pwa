<template>
  <slot
    ref="btn"
    name="activator"
    :reveal="reveal"
  >
    <v-btn
      v-if="!noButton"
      v-bind="$attrs"
      @click="reveal"
    >
      {{ label }}
    </v-btn>
  </slot>
  <v-dialog
    v-model="showDialog"
    persistent
    width="300"
    @update:model-value="close"
  >
    <v-card
      :text="message"
      :title="title "
    >
      <v-card-actions class="d-flex">
        <v-spacer />
        <v-btn @click="close">
          {{ cancelText }}
        </v-btn>
        <v-btn
          id="confirm-dialog-button"
          color="primary"
          variant="flat"
          @click="confirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  defineProps({
    message: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    label: {
      type: String,
      default: '',
    },
    noButton: {
      type: Boolean,
      default: false,
    },
  })

  const showDialog = ref(false)
  const emit = defineEmits(['confirm', 'close'])

  const reveal = () => {
    showDialog.value = true
  }
  const close = () => {
    showDialog.value = false
    emit('close')
  }
  const confirm = () => {
    showDialog.value = false
    emit('confirm')
  }
  defineExpose({
    reveal,
  })
</script>
