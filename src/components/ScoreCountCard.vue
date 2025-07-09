<template>
  <v-card
    class="d-flex flex-column"
    :color="scoreCard.color"
    height="100%"
    max-height="200"
  >
    <div
      class="text-h5 text-right"
      :style="{
        'background-color': lightenColor(scoreCard.color)
      }"
    >
      <div class="text-center position-absolute w-100">
        {{ scoreCard.playerName }}
      </div>
      <v-btn
        color="transparent"
        density="comfortable"
        icon
        size="small"
      >
        <v-icon>mdi-pencil</v-icon>
        <v-dialog activator="parent">
          <template #default="{isActive}">
            <v-card>
              <v-card-title class="d-flex align-center" :style="{'background-color': scoreCard.color}">
                Edit<v-spacer />
                <v-btn
                  color="error"
                  density="comfortable"
                  icon="mdi-delete"
                  variant="text"
                  @click="emit('remove', scoreCard)"
                />
              </v-card-title>
              <v-card-text class="pa-4">
                <v-text-field
                  v-model="scoreCard.playerName"
                  label="Name"
                />
                <v-text-field
                  v-model.number="scoreCard.score"
                  label="Score"
                  type="number"
                />
                <color-pallet-input
                  v-model="scoreCard.color"
                  :colors="colors"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn @click="isActive.value = false">Done</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </v-btn>
    </div>
    <div
      class="d-flex align-center flex-grow-1 justify-center"
      style="min-height: 90px;"
    >
      <v-btn
        v-on-long-press.prevent="() => {scoreDialog = true; scoreMode='-'}"
        class="flex-grow-1 pl-4 bg-transparent"
        height="100%"
        icon="mdi-minus"
        style="justify-content: left;"
        @click="scoreCard.score--"
      />
      <div
        class="text-h1 text-center pa-3"
        style="position: absolute; z-index: 1;"
        @click.stop="console.log('click score')"
      >
        <b>{{ scoreCard.score }}</b>
        <v-dialog v-model="scoreDialog" activator="parent" max-width="364">
          <v-card :color="scoreCard.color">
            <v-card-title class="text-center">{{ `${scoreCard.playerName}: ${scoreCard.score}` }}</v-card-title>
            <v-card-text class="bg-surface">
              <v-row dense>
                <v-col v-for="i in quickAddScores" :key="i" cols="">
                  <v-btn
                    class="text-h4 border-primary border border-md border-opacity-100"
                    height="64"
                    width="100%"
                    @click="changeScore(i, scoreMode)"
                  >{{ scoreMode }}{{ i }}</v-btn>
                </v-col>
              </v-row>
              <div class="d-flex align-center mt-4 ga-2">
                <v-btn-toggle v-model="scoreMode" class="border border-md border-opacity-100 border-primary">
                  <v-btn value="-">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                  <v-btn value="+">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-btn-toggle>
                <v-text-field
                  v-model.number="freeScore"
                  class="text-center"
                  density="comfortable"
                  hide-details
                  placeholder="123..."
                  type="number"
                  width="0"
                  @keydown.enter.prevent="changeScore(freeScore || 0, scoreMode)"
                  @keyup.enter.prevent="changeScore(freeScore || 0, scoreMode)"
                >
                  <template #prepend-inner>{{ scoreMode }}</template>
                </v-text-field>
                <v-expand-x-transition>
                  <v-btn
                    color="success"
                    :disabled="!freeScore"
                    icon="mdi-check-bold"
                    variant="text"
                    @click="changeScore(freeScore || 0, scoreMode)"
                  />
                </v-expand-x-transition>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
      <v-btn
        v-on-long-press.prevent="() => {scoreDialog = true; scoreMode='+'}"
        class="flex-grow-1 d-flex pr-4 bg-transparent"
        height="100%"
        icon="mdi-plus"
        style="justify-content: right;"
        @click="scoreCard.score++"
      />
    </div>
  </v-card>
</template>

<script setup lang="ts">
  import type { ScoreStateObj } from '@/types'
  import { vOnLongPress } from '@vueuse/components'

  defineProps({
    colors: {
      type: Array as () => string[],
      default: () => [],
    },
    quickAddScores: {
      type: Array as () => number[],
      default: () => [
        10,
        15,
        25,
        50,
        100,
        200,
      ],
    },
  })
  const scoreCard = defineModel<ScoreStateObj>('modelValue', { required: true })
  const scoreDialog = ref<boolean>(false)
  const scoreMode = ref<'+' | '-'>('+')
  const freeScore = ref<number | undefined>()
  const changeScore = (score: number, mode: '+' | '-') => {
    if (mode === '+') {
      scoreCard.value.score += score
    } else if (mode === '-') {
      scoreCard.value.score -= score
    }
    scoreDialog.value = false
    scoreMode.value = '+'
    freeScore.value = undefined
  }
  const emit = defineEmits<{
    (e: 'remove', payload: ScoreStateObj): void
  }>()

  const lightenColor = (color: string, percent = 10): string => {
    const num = Number.parseInt(color.slice(1), 16)
    const amt = Math.round(2.55 * percent)
    const r = (num >> 16) + amt
    const g = ((num >> 8) & 0x00_FF) + amt
    const b = (num & 0x00_00_FF) + amt
    return `#${(0x1_00_00_00 + (r < 255 ? (r < 1 ? 0 : r) : 255) * 0x1_00_00 + (g < 255 ? (g < 1 ? 0 : g) : 255) * 0x1_00 + (b < 255 ? (b < 1 ? 0 : b) : 255)).toString(16).slice(1)}`
  }
</script>
