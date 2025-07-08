<template>
  <v-app-bar density="comfortable">
    <v-app-bar-title> 🏆️ {{ leadingScoreCard?.playerName || leadingScoreCard?.playerName }}</v-app-bar-title>
    <v-spacer />
    <v-btn
      icon="mdi-plus-box"
      @click="addPlayer"
    />
    <v-btn icon="mdi-dots-vertical">
      <v-icon>mdi-dots-vertical</v-icon>
      <v-menu activator="parent">
        <v-list>
          <v-list-item class="text-error" prepend-icon="mdi-delete" title="Delete all counters" @click="clearAllConfirm?.reveal" />

        </v-list>
      </v-menu>
    </v-btn>
  </v-app-bar>
  <v-main>
    <v-container
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
          @remove="scoreStateCards.splice(i, 1)"
          @update:model-value="scoreStateCards[i] = $event"
        />
      </template>
    </v-container>
  </v-main>
  <Confirm ref="clearAllConfirm" message="Are you sure you want to delete all score cards?" title="Delete all" @confirm="scoreStateCards=[]" />

</template>
<script setup lang="ts">
  import type { ScoreStateObj } from '@/types'
  import { randomNames } from '@/data'
  const scoreStateCards = ref<ScoreStateObj[]>([])

  const clearAllConfirm = useTemplateRef('clearAllConfirm')
  const addPlayer = () => {
    scoreStateCards.value.push({
      playerName: pickRandomName(),
      score: 0,
      color: pickRandomColor(),
      id: crypto.randomUUID(),
    })
  }
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
  const leadingScoreCard = computed(() => {
    const highestScore = Math.max(...scoreStateCards.value.map(s => s.score))
    return scoreStateCards.value.find(s => s.score === highestScore)
  })
  const pickRandomName = () => {
    const pickAbleNames = randomNames.en.filter(n => !scoreStateCards.value.map(s => s.playerName).includes(n))
    if (pickAbleNames.length === 0) {
      const randomIndex = Math.floor(Math.random() * randomNames.en.length)
      return randomNames.en[randomIndex]
    }
    const randomIndex = Math.floor(Math.random() * pickAbleNames.length)
    return pickAbleNames[randomIndex]
  }
</script>
