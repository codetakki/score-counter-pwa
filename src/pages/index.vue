<template>
  <v-app-bar density="comfortable">
    <v-app-bar-title>
      <div style="width: min-content;">
        <span v-if="scoreMode === 'high'">📈 {{ leadingScoreCard?.playerName }}</span>
        <span v-else-if="scoreMode==='low'">📉 {{ lastScoreCard?.playerName }}</span>
        <span v-else-if="scoreMode==='sum'">Σ {{ totalScore }}</span>
        <v-menu activator="parent">
          <v-list width="200">
            <v-list-subheader>Choose winner</v-list-subheader>
            <v-list-item
              v-for="{title, value} in scoringModes"
              :key="value"
              :active="scoreMode === value"
              :title="title"
              :value="value"
              @click="scoreMode = value"
            />
          </v-list>
        </v-menu>
      </div>
    </v-app-bar-title>
    <v-spacer />
    <v-btn
      icon="mdi-plus-box"
      @click="addPlayer"
    />
    <HistoryDisplay :history="history" :score-cards="scoreStateCards" />
    <v-btn icon="mdi-dots-vertical">
      <v-icon>mdi-dots-vertical</v-icon>
      <v-menu activator="parent">
        <v-list>
          <v-list-item title="Change quick add values" @click="editQuickScore = !editQuickScore" />
          <v-list-item class="text-error" title="Reset scores" @click="resetScores" />
          <v-list-item class="text-error" title="Delete all counters" @click="clearAllConfirm?.reveal" />
          <v-divider />
          <v-list-item title="About" to="/about" />

        </v-list>
      </v-menu>
    </v-btn>

  </v-app-bar>
  <v-main>
    <v-container
      v-if="scoreStateCards.length > 0"
      class="d-flex flex-column ga-2"
      style="height: 100%"
    >
      <template
        v-for="scoreCard, i in scoreStateCards"
        :key="Math.random()+i"
      >
        <ScoreCountCard
          :colors="colors"
          :model-value="scoreCard"
          :quick-add-scores="quickAddScores"
          @remove="scoreStateCards.splice(i, 1)"
          @update:model-value="scoreStateCards[i] = $event"
        />
      </template>
    </v-container>
    <v-container v-else class="d-flex justify-center align-center h-100 text-center">
      <div class="text-medium-emphasis">Add players with the <v-icon>mdi-plus-box</v-icon></div>
    </v-container>
  </v-main>
  <Confirm
    ref="clearAllConfirm"
    message="Are you sure you want to delete all score cards?"
    no-button
    title="Delete all"
    @confirm="scoreStateCards=[]"
  />
  <v-dialog v-model="editQuickScore" activator="#quickAccessMenuButton" max-width="364">
    <v-card title="Quick add values">
      <v-card-text>
        <v-row dense>
          <v-col v-for="i, index in quickAddScores" :key="index" cols="4">
            <v-text-field
              color="primary"
              hide-details
              :model-value="i"
              prefix="±"
              type="number"
              variant="outlined"
              @update:model-value="quickAddScores[index] = Number($event)"
            /></v-col>
        </v-row>
      </v-card-text></v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import type { ScoreStateObj } from '@/types'
  import { useDebouncedRefHistory, useLocalStorage } from '@vueuse/core'
  import { randomNames } from '@/data'

  const editQuickScore = ref(false)
  const scoreStateCards = useLocalStorage<ScoreStateObj[]>('scoreState', [])
  const { history } = useDebouncedRefHistory(scoreStateCards, { deep: true, debounce: 1000 })

  const clearAllConfirm = useTemplateRef('clearAllConfirm')
  const addPlayer = () => {
    scoreStateCards.value.push({
      playerName: pickRandomName(),
      score: 0,
      color: pickRandomColor(),
      id: uuid(),
    })
  }
  const uuid = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.trunc(Math.random() * 16)
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  const quickAddScores = useLocalStorage<number[]>('quickAddScores', [
    10,
    15,
    25,
    50,
    100,
    200,
  ])
  const colors = [
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
  ]

  const pickRandomColor = () => {
    const pickAbleColors = colors.filter(c => !scoreStateCards.value.map(s => s.color).includes(c))
    if (pickAbleColors.length === 0) {
      const randomIndex = Math.floor(Math.random() * colors.length)
      return colors[randomIndex]
    }
    const randomIndex = Math.floor(Math.random() * pickAbleColors.length)
    return pickAbleColors[randomIndex]
  }
  const scoringModes = [{ title: '📈 Highest', value: 'high' }, { title: '📉 Lowest', value: 'low' }, { title: 'Σ Total player sum', value: 'sum' }] as const
  const scoreMode = useLocalStorage<'high' | 'low' | 'sum'>('scoreMode', 'high')

  const leadingScoreCard = computed(() => {
    const highestScore = Math.max(...scoreStateCards.value.map(s => s.score))
    return scoreStateCards.value.find(s => s.score === highestScore)
  })
  const lastScoreCard = computed(() => {
    const highestScore = Math.min(...scoreStateCards.value.map(s => s.score))
    return scoreStateCards.value.find(s => s.score === highestScore)
  })
  const totalScore = computed(() => scoreStateCards.value.reduce((acc, curr) => acc + curr.score, 0))

  const pickRandomName = () => {
    const pickAbleNames = randomNames.en.filter(n => !scoreStateCards.value.map(s => s.playerName).includes(n))
    if (pickAbleNames.length === 0) {
      const randomIndex = Math.floor(Math.random() * randomNames.en.length)
      return randomNames.en[randomIndex]
    }
    const randomIndex = Math.floor(Math.random() * pickAbleNames.length)
    return pickAbleNames[randomIndex]
  }

  const resetScores = () => {
    for (const entry of scoreStateCards.value) {
      entry.score = 0
    }
  }
</script>
