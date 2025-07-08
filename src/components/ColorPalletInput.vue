<template>
  <div class="d-flex align-center">
    <v-item-group
      v-model="modelValue"
      class="d-flex align-center flex-grow-1"
      mandatory
    >
      <v-item
        v-for="color in colors"
        :key="color"
        v-slot="{ isSelected, toggle }"
        :value="color"
      >
        <div
          class="w-100 flex-grow-1"
          :style="{ height: isSelected ? '75px' : '50px', 'background-color': color }"
          @click="toggle"
        />
      </v-item>
    </v-item-group>
    <v-btn class="ml-2" :color="modelValue" icon>
      <v-icon size="large">mdi-palette</v-icon>
      <v-dialog activator="parent">
        <template #default="{isActive}">
          <div class="w-100 d-flex justify-center">
            <v-card>
              <v-color-picker v-model="modelValue" elevation="0" hide-inputs mode="hex" />
              <v-card-actions class="d-flex justify-end">
                <v-btn @click="isActive.value = false">Done</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </template>
      </v-dialog>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    colors: {
      type: Array as () => string[],
      default: () => [
        '#F44336',
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFEB3B',
        '#FFC107',
        '#FF9800',
        '#FF5722',
        '#9E9E9E',
        '#795548',
      ],
    },
  })
  const modelValue = defineModel<string>('modelValue')
</script>
