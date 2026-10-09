<template>
  <div class="home">
    <section class="hero">
      <img src="/portedhub.png" alt="PortedHub" class="hero-logo" />
      <p class="slogan">100% browser, 0% downloads</p>
      <p class="entries-count">{{ totalPorts }} ports in library</p>
      <router-link to="/library" class="cta-button"
        >Explore Library</router-link
      >
    </section>

    <section class="gallery">
      <h2 class="section-title">Featured Ports</h2>
      <div class="gallery-grid">
        <PortCard
          v-for="port in featuredPorts"
          :key="port.id"
          :port="port"
        />
      </div>
    </section>

    <section class="about">
      <h2 class="section-title">About PortedHub</h2>
      <div class="about-content">
        <p>
          PortedHub is a curated library of PC and console ports that run as
          fully functional browser games. Thanks to advances in AI and
          web technologies, classic and modern games are being adapted to run
          entirely in your browser with no downloads or installations required.
        </p>
        <p>
          Our mission is to showcase these incredible ports, giving credit to
          the creators who make it possible, and providing a central hub for
          gamers to discover and play these browser-based recreations.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import PortCard from '../components/PortCard.vue'

const featuredPortIds = [
  'claude-of-duty-vibe-slops-ii',
  'cs-1.6',
  'cod-bo-1-zombies'
]

export default {
  name: "Home",
  components: {
    PortCard
  },
  data() {
    return {
      featuredPorts: [],
      totalPorts: 0
    };
  },
  methods: {
    async loadPorts() {
      try {
        const response = await fetch('/games/index.json')
        const portList = await response.json()
        const ports = []

        for (const portId of portList) {
          try {
            const portResponse = await fetch(`/games/${portId}/game.json`)
            const portData = await portResponse.json()
            ports.push({
              id: portId,
              ...portData,
              screenshot: `/games/${portId}/${encodeURIComponent(
                portData.screenshot || "screenshot.svg"
              )}`
            })
          } catch (error) {
            console.error(`Error loading port ${portId}:`, error)
          }
        }

        this.featuredPorts = ports.filter(port =>
          featuredPortIds.includes(port.id)
        )
        this.totalPorts = ports.length
      } catch (error) {
        console.error('Error loading ports:', error)
      }
    }
  },
  mounted() {
    this.loadPorts()
  }
};
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: var(--gradient-1);
  padding: 8rem 2rem 6rem;
  text-align: center;
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(225, 29, 45, 0.20) 0%, transparent 45%),
              radial-gradient(circle at 80% 50%, rgba(247, 179, 196, 0.16) 0%, transparent 45%),
              radial-gradient(circle at 50% 0%, rgba(255, 138, 61, 0.18) 0%, transparent 50%);
  pointer-events: none;
}

.hero-logo {
  display: block;
  width: min(96vw, 1100px);
  height: auto;
  margin: 0 auto 1.5rem;
  filter: drop-shadow(0 0 20px rgba(255, 61, 61, 0.4));
}

.slogan {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-weight: 500;
  position: relative;
}

.entries-count {
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  color: var(--accent-primary);
  font-weight: 600;
  position: relative;
}

.entries-count::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--accent-primary);
  border-radius: 50%;
  margin-right: 0.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.cta-button {
  display: inline-block;
  background: var(--button-brand-bg);
  color: var(--button-brand-text);
  padding: 1.25rem 3rem;
  border-radius: 12px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 800;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow-color);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(217, 16, 45, 0.45);
}

.cta-button:hover::before {
  left: 100%;
}

.gallery {
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-primary);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 100px;
  height: 4px;
  background: var(--gradient-2);
  margin: 1rem auto 0;
  border-radius: 2px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  justify-content: center;
}

.about {
  padding: 6rem 2rem;
  background: var(--bg-secondary);
  position: relative;
}

.about::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.about-content p {
  font-size: 1.15rem;
  line-height: 1.9;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-weight: 400;
}

@media (max-width: 768px) {
  .title {
    font-size: 3rem;
  }

  .slogan {
    font-size: 1.2rem;
  }

  .cta-button {
    padding: 1rem 2rem;
    font-size: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
