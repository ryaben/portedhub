<template>
  <div class="library">
    <aside class="sidebar">
      <div class="sidebar-section">
        <h3>Search</h3>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search ports..."
          class="search-input"
        />
      </div>

      <div class="sidebar-section">
        <h3>Genre</h3>
        <div class="filter-group">
          <label v-for="genre in genres" :key="genre" class="filter-label">
            <input type="checkbox" :value="genre" v-model="selectedGenres" />
            {{ genre }}
          </label>
        </div>
      </div>

      <div class="sidebar-section">
        <h3>Type</h3>
        <div class="filter-group">
          <label class="filter-label">
            <input type="checkbox" v-model="showClones" />
            Clones
          </label>
          <label class="filter-label">
            <input type="checkbox" v-model="showCrossovers" />
            Crossovers
          </label>
          <label class="filter-label">
            <input type="checkbox" v-model="showOriginals" />
            Originals
          </label>
          <label class="filter-label">
            <input type="checkbox" v-model="showConsoles" />
            Consoles
          </label>
        </div>
      </div>

      <button @click="clearFilters" class="clear-filters">Clear Filters</button>
    </aside>

    <main class="main-content">
      <div class="results-header">
        <h2>Library</h2>
        <div class="results-controls">
          <p class="results-count">{{ filteredPorts.length }} ports found</p>
          <div class="display-controls">
            <div class="entries-per-page">
              <label for="entriesPerPage">Show:</label>
              <select
                id="entriesPerPage"
                v-model="itemsPerPage"
                @change="currentPage = 1"
              >
                <option :value="6">6</option>
                <option :value="12">12</option>
                <option :value="24">24</option>
                <option :value="48">48</option>
              </select>
            </div>
            <label
              v-if="displayMode === 'card'"
              class="card-size-control"
              for="cardSize"
            >
              <span>Card size</span>
              <input
                id="cardSize"
                :value="cardSize"
                type="range"
                min="220"
                max="440"
                step="5"
                aria-label="Card width"
                :aria-valuetext="`${cardSize} pixels`"
                @input="cardSize = Number($event.target.value)"
              />
              <output for="cardSize">{{ cardSize }}px</output>
            </label>
            <fieldset class="display-mode-toggle">
              <legend class="visually-hidden">Entry display</legend>
              <label class="display-mode-option">
                <input
                  v-model="displayMode"
                  type="radio"
                  name="displayMode"
                  value="card"
                />
                <span>
                  <svg aria-hidden="true" viewBox="0 0 20 20">
                    <rect x="2.5" y="2.5" width="6" height="6" rx="1" />
                    <rect x="11.5" y="2.5" width="6" height="6" rx="1" />
                    <rect x="2.5" y="11.5" width="6" height="6" rx="1" />
                    <rect x="11.5" y="11.5" width="6" height="6" rx="1" />
                  </svg>
                  <span class="visually-hidden">Cards</span>
                </span>
              </label>
              <label class="display-mode-option">
                <input
                  v-model="displayMode"
                  type="radio"
                  name="displayMode"
                  value="list"
                />
                <span>
                  <svg aria-hidden="true" viewBox="0 0 20 20">
                    <path d="M7.5 4h10M7.5 10h10M7.5 16h10" />
                    <circle cx="3.5" cy="4" r="1" />
                    <circle cx="3.5" cy="10" r="1" />
                    <circle cx="3.5" cy="16" r="1" />
                  </svg>
                  <span class="visually-hidden">List</span>
                </span>
              </label>
            </fieldset>
          </div>
        </div>
      </div>

      <div
        class="ports-grid"
        :class="{ 'ports-grid-list': displayMode === 'list' }"
        :style="{ '--card-size': `${cardSize}px` }"
      >
        <PortCard
          v-for="port in paginatedPorts"
          :key="port.id"
          :port="port"
          :display-mode="displayMode"
        />
      </div>

      <div v-if="filteredPorts.length === 0" class="no-results">
        <p>No ports match your filters. Try adjusting your search criteria.</p>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="pagination-button"
        >
          ← Previous
        </button>
        <div class="pagination-pages">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="{ active: currentPage === page }"
            class="pagination-page"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="pagination-button"
        >
          Next →
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import PortCard from "../components/PortCard.vue";

export default {
  name: "Library",
  components: {
    PortCard,
  },
  data() {
    return {
      searchQuery: "",
      selectedGenres: [],
      showClones: true,
      showCrossovers: true,
      showOriginals: true,
      showConsoles: true,
      ports: [],
      currentPage: 1,
      itemsPerPage: 12,
      cardSize: 300,
      displayMode: "card",
    };
  },
  computed: {
    genres() {
      const allGenres = this.ports.map((port) => port.genre);
      return [...new Set(allGenres)].sort();
    },
    filteredPorts() {
      return this.ports.filter((port) => {
        const matchesSearch =
          port.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          port.description
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());

        const matchesGenre =
          this.selectedGenres.length === 0 ||
          this.selectedGenres.includes(port.genre);

        const hasClone = port.type === "clone";
        const hasCrossover = port.type === "crossover";
        const hasOriginal = port.type === "original";
        const hasConsole = port.type === "console";
        const matchesType =
          (this.showClones && hasClone) ||
          (this.showCrossovers && hasCrossover) ||
          (this.showOriginals && hasOriginal) ||
          (this.showConsoles && hasConsole) ||
          (!hasClone && !hasCrossover && !hasOriginal && !hasConsole);

        return matchesSearch && matchesGenre && matchesType;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredPorts.length / this.itemsPerPage);
    },
    paginatedPorts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPorts.slice(start, end);
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    },
  },
  methods: {
    clearFilters() {
      this.searchQuery = "";
      this.selectedGenres = [];
      this.showClones = true;
      this.showCrossovers = true;
      this.showOriginals = true;
      this.showConsoles = true;
      this.currentPage = 1;
    },
    async loadPorts() {
      try {
        const response = await fetch("/games/index.json");
        const portList = await response.json();
        const ports = [];

        for (const portId of portList) {
          try {
            const portResponse = await fetch(`/games/${portId}/game.json`);
            const portData = await portResponse.json();
            ports.push({
              id: portId,
              ...portData,
              screenshot: `/games/${portId}/${encodeURIComponent(
                portData.screenshot || "screenshot.svg",
              )}`,
            });
          } catch (error) {
            console.error(`Error loading port ${portId}:`, error);
          }
        }

        this.ports = ports;
      } catch (error) {
        console.error("Error loading ports:", error);
      }
    },
  },
  mounted() {
    this.loadPorts();
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    selectedGenres() {
      this.currentPage = 1;
    },
    showClones() {
      this.currentPage = 1;
    },
    showCrossovers() {
      this.currentPage = 1;
    },
    showOriginals() {
      this.currentPage = 1;
    },
    showConsoles() {
      this.currentPage = 1;
    },
  },
};
</script>

<style scoped>
.library {
  display: flex;
  min-height: calc(100vh - 80px);
}

.sidebar {
  width: 300px;
  background: var(--bg-secondary);
  padding: 2rem;
  position: sticky;
  top: 80px;
  height: calc(100vh - 80px);
  overflow-y: auto;
  border-right: 1px solid var(--border-color);
}

.sidebar-section {
  margin-bottom: 2rem;
}

.sidebar-section h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
  padding: 0.5rem;
  border-radius: 6px;
}

.filter-label:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.filter-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--accent-primary);
  cursor: pointer;
}

.clear-filters {
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--gradient-3);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.clear-filters:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
}

.results-header {
  margin-bottom: 2.5rem;
}

.results-header h2 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.results-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.results-count {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
}

.entries-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.entries-per-page label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.entries-per-page select {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.entries-per-page select:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.display-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-size-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
}

.card-size-control input {
  width: 100px;
  accent-color: var(--accent-primary);
  cursor: pointer;
}

.card-size-control output {
  min-width: 3.5em;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.display-mode-toggle {
  display: flex;
  align-items: center;
  padding: 3px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-tertiary);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.display-mode-option {
  position: relative;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
}

.display-mode-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.display-mode-option > span {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.55rem;
  border-radius: 5px;
  transition: background 0.2s ease, color 0.2s ease;
}

.display-mode-option svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.display-mode-option input:checked + span {
  background: var(--bg-card);
  color: var(--text-primary);
  box-shadow: 0 1px 4px var(--shadow-color);
}

.display-mode-option input:focus-visible + span {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

.ports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(0, min(var(--card-size), 100%)));
  gap: 1.25rem;
}

.ports-grid-list {
  grid-template-columns: 1fr;
}

.no-results {
  text-align: center;
  padding: 6rem 2rem;
  color: var(--text-secondary);
  font-size: 1.2rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 2px dashed var(--border-color);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.pagination-button {
  padding: 0.75rem 1.5rem;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: var(--bg-primary);
  transform: translateY(-2px);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 0.5rem;
}

.pagination-page {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-color);
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.pagination-page:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

.pagination-page.active {
  background: var(--gradient-2);
  border-color: transparent;
  color: white;
}

@media (max-width: 768px) {
  .library {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .ports-grid {
    grid-template-columns: 1fr;
  }

  .results-controls {
    align-items: flex-start;
  }

  .display-controls {
    justify-content: flex-start;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .display-controls {
    align-items: flex-start;
  }

  .card-size-control {
    flex-wrap: wrap;
  }
}
</style>
