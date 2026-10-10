<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo" aria-label="PortedHub home">
          <img src="/portedhub.png" alt="PortedHub" class="nav-logo-image" />
        </router-link>
        <div class="nav-right">
          <router-link to="/library" class="nav-link">Library</router-link>
          <button
            @click="toggleTheme"
            class="theme-toggle"
            :title="
              currentTheme === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            "
          >
            <svg
              v-if="currentTheme === 'dark'"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          <div class="nav-contact-links">
            <a
              href="https://x.com/portedhub"
              class="nav-contact-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="PortedHub on X"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.3-8.4L1.8 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z"
                />
              </svg>
              <span>@portedhub</span>
            </a>
            <a
              href="mailto:portedhub@gmail.com"
              class="nav-contact-link"
              aria-label="Email PortedHub"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M3 5h18v14H3z" />
                <path d="m3 6 9 7 9-7" />
              </svg>
              <span>portedhub@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useTheme } from "./composables/useTheme";

const { currentTheme, toggleTheme } = useTheme();
</script>

<style scoped>
.navbar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(21, 25, 50, 0.8);
}

[data-theme="light"] .navbar {
  background: rgba(255, 255, 255, 0.8);
}

.nav-container {
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.nav-logo-image {
  display: block;
  height: 52px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(255, 71, 71, 0.3));
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-contact-links {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.nav-contact-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.nav-contact-link:hover {
  color: var(--accent-primary);
}

.nav-contact-link:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

.nav-contact-link svg {
  width: 16px;
  height: 16px;
  flex: none;
  fill: currentColor;
}

.nav-contact-link:last-child svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: var(--bg-tertiary);
}

.nav-link:hover {
  background: var(--accent-primary);
  color: var(--bg-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.theme-toggle {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: var(--accent-secondary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.theme-toggle svg {
  transition: transform 0.3s ease;
}

.theme-toggle:hover svg {
  transform: rotate(180deg);
}

@media (max-width: 600px) {
  .navbar {
    padding: 0.75rem 1rem;
  }

  .nav-logo-image {
    width: min(42vw, 200px);
    height: auto;
  }

  .nav-right {
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.6rem 0.75rem;
  }

  .nav-contact-links {
    gap: 0.15rem;
  }

  .nav-contact-link {
    justify-content: center;
    padding: 0.1rem;
  }

  .nav-contact-link span {
    display: none;
  }

  .nav-contact-link svg {
    width: 18px;
    height: 18px;
  }
}
</style>
