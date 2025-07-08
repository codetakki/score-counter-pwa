/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
  defaults: {
    global: {
      rounded: 'lg',
    },
    VAppBar: {
      rounded: 'none',
    },
    VBtn: {
      variant: 'flat',
    },
    VCombobox: {
      elevation: 0,
      flat: true,
      variant: 'solo-filled',
    },
    VTextField: {
      elevation: 0,
      flat: true,
      variant: 'solo-filled',
    },
    VSelect: {
      elevation: 0,
      flat: true,
      variant: 'solo-filled',
    },
    VAutocomplete: {
      elevation: 0,
      flat: true,
      variant: 'solo-filled',
    },
    VCard: {
      variant: 'flat',
    },
    VDialog: {
      maxWidth: '800',
    },
  },
})
