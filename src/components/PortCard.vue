<template>
  <div class="port-card" :class="{ 'port-card-list': displayMode === 'list' }">
    <div v-if="displayMode === 'card'" class="port-screenshot">
      <img :src="port.screenshot" :alt="port.title" />
    </div>
    <div class="port-info">
      <h3 class="port-title">{{ port.title }}</h3>
      <p class="port-genre">{{ port.genre }}</p>
      <p v-if="displayMode === 'card'" class="port-description">
        {{ port.description }}
      </p>

      <div class="port-details">
        <div class="port-header">
          <span v-if="port.type === 'clone'" class="badge clone">Clone</span>
          <span v-if="port.type === 'crossover'" class="badge crossover">Crossover</span>
          <span v-if="port.type === 'original'" class="badge original">Original</span>
          <span v-if="port.type === 'console'" class="badge console">Console</span>
          <div class="port-creator">
            <span class="creator-label">By:</span>
            <a
              v-if="port.creator.social"
              :href="port.creator.social"
              target="_blank"
              rel="noopener noreferrer"
              class="creator-link"
            >
              {{ port.creator.name }}
            </a>
            <span v-else class="creator-name">{{ port.creator.name }}</span>
          </div>
        </div>
        <a :href="port.website" target="_blank" rel="noopener noreferrer" class="play-button">
          Play Now →
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PortCard',
  props: {
    port: {
      type: Object,
      required: true
    },
    displayMode: {
      type: String,
      default: 'card',
      validator: (value) => ['card', 'list'].includes(value)
    }
  }
}
</script>

<style scoped>
.port-card {
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.port-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px var(--shadow-color);
  border-color: var(--accent-primary);
}

.port-card-list:hover {
  transform: translateY(-2px);
}

.port-screenshot {
  aspect-ratio: 16/9;
  overflow: hidden;
  position: relative;
}

.port-screenshot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.port-card:hover .port-screenshot img {
  transform: scale(1.05);
}

.port-info {
  padding: 1.25rem;
}

.port-title {
  font-size: 1.25rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-weight: 800;
  line-height: 1.3;
}

.port-genre {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}

.port-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.port-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

.port-card-list .port-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  padding: 0.75rem 1rem;
}

.port-card-list .port-title,
.port-card-list .port-genre {
  margin: 0;
}

.port-card-list .port-details {
  margin: 0;
  margin-left: auto;
  padding: 0;
  border: 0;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.port-card-list .port-header {
  gap: 0.5rem;
}

.port-card-list .badge {
  padding: 0.3rem 0.65rem;
}

.port-card-list .play-button {
  white-space: nowrap;
}

.port-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.35rem 0.875rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge.clone {
  background: linear-gradient(135deg, #ff2a3a 0%, #d9102d 100%);
  color: #fff;
}

.badge.crossover {
  background: linear-gradient(135deg, #dfe4ea 0%, #a8afb8 100%);
  color: #1b1d21;
}

.badge.original {
  background: linear-gradient(135deg, #f7b3c4 0%, #f06d8d 100%);
  color: #1b1d21;
}

.badge.console {
  background: linear-gradient(135deg, #ff8a3d 0%, #f46a73 100%);
  color: #fff;
}

.port-creator {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.creator-label {
  color: var(--text-muted);
}

.creator-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.creator-link:hover {
  color: var(--accent-secondary);
}

.creator-name {
  color: var(--text-primary);
  font-weight: 600;
}

.play-button {
  display: inline-block;
  background: var(--button-brand-bg);
  color: var(--button-brand-text);
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 800;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 8px var(--shadow-color);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.2);
}

.play-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(217, 16, 45, 0.35);
}

@media (max-width: 900px) {
  .port-card-list .port-details {
    flex-basis: 100%;
    margin-left: 0;
    justify-content: space-between;
  }
}

@media (max-width: 560px) {
  .port-card-list .port-details {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
