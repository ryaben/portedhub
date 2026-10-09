import { ref, watch } from 'vue'

const THEME_KEY = 'portedhub-theme'
const themes = ['dark', 'light']

const currentTheme = ref(localStorage.getItem(THEME_KEY) || 'dark')

watch(currentTheme, (newTheme) => {
  localStorage.setItem(THEME_KEY, newTheme)
  document.documentElement.setAttribute('data-theme', newTheme)
})

export function useTheme() {
  const toggleTheme = () => {
    const currentIndex = themes.indexOf(currentTheme.value)
    currentTheme.value = themes[(currentIndex + 1) % themes.length]
  }

  const setTheme = (theme) => {
    if (themes.includes(theme)) {
      currentTheme.value = theme
    }
  }

  return {
    currentTheme,
    toggleTheme,
    setTheme,
    themes
  }
}
