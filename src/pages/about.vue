<template>
  <v-card class="ma-3">
    <v-card-title>This is a scoring app</v-card-title>
    <v-card-text>
      <p>
        This web app is inspired by the great ad free android app "<a
          href="https://play.google.com/store/apps/details?id=ua.napps.scorekeeper&hl=en"
          target="_blank"
        >Score Counter</a>", please check it out and support the developer.

      </p>
      <br>
      <div class="d-flex flex-column ga-4">
        <v-btn
          block
          color="primary"
          href="https://github.com/codetakki/score-counter-spa"
          prepend-icon="mdi-github"
          target="_blank"
          text="Source code"
        />
        <v-btn
          block
          color="primary"
          href="https://www.linkedin.com/in/tarek-auf-der-strasse-4854331b1/"
          prepend-icon="mdi-linkedin"
          target="_blank"
          variant="outlined"
        >Tarek Auf der Strasse</v-btn>
        <p>
          This app was built using
          <a
            href="https://vuetifyjs.com/en/getting-started/quick-start/"
            target="_blank"
          >Vuetify</a>
          and
          <a href="https://vuejs.org/" target="_blank">Vue</a>.
        </p>
        <v-btn block prepend-icon="mdi-arrow-left" to="/" variant="outlined">Back to scoring!</v-btn>
        Other projects:

        <div v-for="p in otherProjects" :key="p.href">
          <v-btn block variant="outlined" v-bind="p"  />
          <div class="text-caption">{{ p.description }}</div>
        </div>

      </div></v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
  const otherProjects = [
    {
      text: '🍽️ Where to Eat',
      description: 'Let randomness decied your next meal, using OpenStreetMap and your current location',
      href: 'https://wheretoeat.takki.org',

    },
    {
      text: '🗺️ Geo wiki',
      description: 'Find wikipedia articles based on there real world location',
      href: 'https://geowiki.takki.org',
    },
    {
      text: '🤫 Secret project',
      description: 'A super secret project, dont tell anyone!',
      href: 'https://takki.org',
    },
  ]
</script>
