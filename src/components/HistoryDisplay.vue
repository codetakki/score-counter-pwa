<template>
  <v-btn icon>
    <v-icon>mdi-history</v-icon>
    <v-dialog activator="parent" eager fullscreen>
      <template #default="{isActive}">
        <v-card class="d-flex flex-column" height="100vh">
          <v-card-title class="d-flex">History <v-spacer />
            <v-btn density="compact" icon="mdi-close" @click="isActive.value = false" /></v-card-title>
          <v-card-text class=" flex-grow-1 h-100 overflow-y-scroll">
            <div class="ga-2 ga-2 d-flex flex-column">
              <template
                v-for="(entry, i) in savedHistory"
                :key="entry.id + i"
              >
                <v-card
                  v-if="scoreCardsById[entry.id]"
                  :color="scoreCardsById[entry.id].color"
                  density="compact"
                >
                  <v-card-title class="d-flex w-100">
                    {{ scoreCardsById[entry.id].playerName }}
                    <v-spacer />
                    <div class="text-caption">{{ new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(entry.timestamp)) }}</div>
                  </v-card-title>
                  <v-card-text class="text-h6">
                    <v-icon>{{ entry.oldValue < entry.newValue ? 'mdi-plus' : 'mdi-minus' }}</v-icon> {{ Math.abs(entry.oldValue - entry.newValue) }}
                    ({{ entry.oldValue }}<v-icon>mdi-arrow-right</v-icon>{{ entry.newValue }})
                  </v-card-text>
                </v-card>
              </template>
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </v-btn>

</template>

<script setup lang="ts">
  import type { ScoreStateObj } from '@/types.ts'
  import { type useDebouncedRefHistory, useSessionStorage } from '@vueuse/core'
  import { computed } from 'vue'

  type History = ReturnType<
    typeof useDebouncedRefHistory<ScoreStateObj[]>
  >['history']['value']
  const props = defineProps({
    history: {
      type: Array as () => History,
      required: true,
    },
    scoreCards: {
      type: Array as () => ScoreStateObj[],
      required: true,
    },
  })

  const scoreCardsById = computed(() => {
    const result: { [id: string]: ScoreStateObj } = {}
    for (const card of props.scoreCards) {
      result[card.id] = card
    }
    return result
  })

  const scoreHistory = computed(() => {
    const result: {
      id: string
      oldValue: number
      newValue: number
      timestamp: number
    }[] = []

    for (const [i, snapshot] of [...props.history].reverse().entries()) {
      if (i === 0) continue
      const previousSnap = [...props.history].reverse()[i - 1]

      for (const [_i, entry] of snapshot.snapshot.entries()) {
        if (!scoreCardsById.value[entry.id]) continue
        const previousEntry = previousSnap.snapshot.find(
          e => e.id === entry.id,
        )
        if (!previousEntry) {
          continue
        }
        if (entry.score !== previousEntry.score) {
          result.push({
            oldValue: previousEntry.score,
            newValue: entry.score,
            id: entry.id,
            timestamp: snapshot.timestamp,
          })
          console.log('name', entry.id, 'oldValue', previousEntry.score, 'newValue', entry.score)
        }
      }
    }
    return result.reverse()
  })
  const savedHistory = useSessionStorage<typeof scoreHistory.value>('savedHistory', [])
  watch(scoreHistory, newValue => {
    const mergedHistory = [...new Set([...(savedHistory.value ?? []), ...((newValue ?? []))])].sort(
      (a, b) => b.timestamp - a.timestamp,
    )
    savedHistory.value = Array.from(new Set(mergedHistory.map(item => JSON.stringify(item)))).map(item => JSON.parse(item)).filter(entry => scoreCardsById.value[entry.id])
  }, { deep: true })
</script>
