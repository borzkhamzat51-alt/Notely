<template>
  <div class="sheets-list">
    <!-- Header Section -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <h1>
            <span class="music-symbol">🎼</span>
            Musical Sheets Library
          </h1>
          <p>Discover and explore our collection of authentic sheet music</p>
        </div>
        
        <!-- Search and Filters -->
        <div class="controls">
          <div class="search-box">
            <span class="search-icon">♫</span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search sheets by title, composer, or instrument..."
              class="search-input"
            >
          </div>
          
          <div class="filter-group">
            <select v-model="selectedInstrument" class="filter-select">
              <option value="">All Instruments</option>
              <option value="piano">Piano</option>
              <option value="guitar">Guitar</option>
              <option value="violin">Violin</option>
              <option value="cello">Cello</option>
              <option value="flute">Flute</option>
              <option value="saxophone">Saxophone</option>
              <option value="trumpet">Trumpet</option>
              <option value="voice">Voice</option>
            </select>
            
            <select v-model="selectedGenre" class="filter-select">
              <option value="">All Genres</option>
              <option value="classical">Classical</option>
              <option value="baroque">Baroque</option>
              <option value="romantic">Romantic</option>
              <option value="jazz">Jazz</option>
              <option value="blues">Blues</option>
              <option value="contemporary">Contemporary</option>
            </select>

            <select v-model="selectedDifficulty" class="filter-select">
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="virtuoso">Virtuoso</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <!-- Stats -->
      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <h3>{{ filteredSheets.length }}</h3>
            <p>Sheet Scores</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎹</div>
          <div class="stat-info">
            <h3>{{ uniqueInstruments }}</h3>
            <p>Instruments</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👤</div>
          <div class="stat-info">
            <h3>{{ uniqueComposers }}</h3>
            <p>Composers</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <h3>{{ uniquePeriods }}</h3>
            <p>Musical Periods</p>
          </div>
        </div>
      </div>

      <!-- Add New Sheet Button -->
      <div class="add-sheet-section">
        <button class="btn-add-sheet" @click="addNewSheet">
          <span class="btn-icon">+</span>
          Add New Sheet Music
        </button>
      </div>

      <!-- Sheets Grid -->
      <div class="sheets-grid">
        <div 
          v-for="sheet in filteredSheets" 
          :key="sheet._id" 
          class="sheet-card"
        >
          <!-- Sheet Music Preview -->
          <div class="sheet-preview">
            <div class="staff">
              <div class="staff-lines"></div>
              <div class="clef">{{ getClef(sheet.instrument) }}</div>
              <div class="time-signature">{{ getTimeSignature(sheet.genre) }}</div>
              <div class="notes">
                <span v-for="(note, index) in getPreviewNotes(sheet)" 
                      :key="index" 
                      class="note"
                      :style="getNoteStyle(note, index)">
                  {{ note.symbol }}
                </span>
              </div>
              <div class="dynamic">{{ getDynamicMarking(sheet.difficulty) }}</div>
            </div>
            <div class="preview-overlay">
              <div class="preview-title">{{ sheet.title }}</div>
              <div class="preview-composer">{{ sheet.composer }}</div>
            </div>
          </div>

          <!-- Sheet Info -->
          <div class="sheet-info">
            <div class="sheet-header">
              <h3 class="sheet-title">{{ sheet.title }}</h3>
              <div class="sheet-meta-primary">
                <span class="composer">by {{ sheet.composer }}</span>
                <span class="period">{{ sheet.period }}</span>
              </div>
            </div>

            <div class="sheet-details">
              <div class="detail-row">
                <span class="detail-label">Instrument:</span>
                <span class="detail-value">
                  <span class="instrument-icon">{{ getInstrumentIcon(sheet.instrument) }}</span>
                  {{ formatInstrument(sheet.instrument) }}
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Genre:</span>
                <span class="detail-value">{{ sheet.genre }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Key:</span>
                <span class="detail-value">{{ sheet.key || 'C Major' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tempo:</span>
                <span class="detail-value">{{ sheet.tempo || 'Moderato' }}</span>
              </div>
            </div>

            <div class="sheet-footer">
              <div class="difficulty-badge" :class="sheet.difficulty">
                <span class="difficulty-icon">🎵</span>
                {{ formatDifficulty(sheet.difficulty) }}
              </div>
              <div class="sheet-actions">
                <button class="btn-view" @click="viewSheet(sheet._id)">
                  <span class="btn-icon">🎼</span>
                  View Score
                </button>
                <button class="btn-download" @click="downloadSheet(sheet)">
                  <span class="btn-icon">⬇️</span>
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredSheets.length === 0" class="empty-state">
        <div class="empty-icon">🎵</div>
        <h3>No sheet music found</h3>
        <p>Try adjusting your search criteria or add a new sheet</p>
        <button class="btn-primary" @click="addNewSheet">Add New Sheet</button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading sheet music...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SheetsList',
  data() {
    return {
      loading: false,
      searchQuery: '',
      selectedInstrument: '',
      selectedGenre: '',
      selectedDifficulty: '',
      sheets: []
    };
  },
  computed: {
    filteredSheets() {
      return this.sheets.filter(sheet => {
        const matchesSearch = sheet.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            sheet.composer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            sheet.instrument.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesInstrument = !this.selectedInstrument || sheet.instrument === this.selectedInstrument;
        const matchesGenre = !this.selectedGenre || sheet.genre === this.selectedGenre;
        const matchesDifficulty = !this.selectedDifficulty || sheet.difficulty === this.selectedDifficulty;
        
        return matchesSearch && matchesInstrument && matchesGenre && matchesDifficulty;
      });
    },
    uniqueInstruments() {
      const instruments = new Set(this.sheets.map(sheet => sheet.instrument));
      return instruments.size;
    },
    uniqueComposers() {
      const composers = new Set(this.sheets.map(sheet => sheet.composer));
      return composers.size;
    },
    uniquePeriods() {
      const periods = new Set(this.sheets.map(sheet => sheet.period));
      return periods.size;
    }
  },
  async created() {
    await this.loadSheets();
    
    // Listen for storage events to update when sheets are added from other tabs
    window.addEventListener('storage', this.handleStorageChange);
  },
  mounted() {
    // Refresh when component becomes visible again (returning from form)
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  },
  methods: {
    async loadSheets() {
      this.loading = true;
      try {
        // First try to get from localStorage (where newly created sheets are saved)
        const localSheets = localStorage.getItem('mockSheets');
        if (localSheets) {
          this.sheets = JSON.parse(localSheets);
          this.loading = false;
          return;
        }

        // If no localStorage data, try the API
        const response = await fetch('http://localhost:5000/api/sheets', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.sheets = data;
          // Save to localStorage for future use
          localStorage.setItem('mockSheets', JSON.stringify(data));
        } else {
          throw new Error('Failed to load sheets');
        }
      } catch (error) {
        console.error('Error loading sheets:', error);
        // Fallback to realistic sheet music data
        this.sheets = this.getRealisticSheets();
        // Save to localStorage for future use
        localStorage.setItem('mockSheets', JSON.stringify(this.sheets));
      } finally {
        this.loading = false;
      }
    },

    getRealisticSheets() {
      return [
        { 
          _id: '1', 
          title: 'Sonata No. 14 "Moonlight"', 
          composer: 'Ludwig van Beethoven', 
          instrument: 'piano',
          genre: 'classical',
          period: 'Classical',
          difficulty: 'intermediate',
          key: 'C♯ Minor',
          tempo: 'Adagio sostenuto',
          description: 'First movement of the famous Moonlight Sonata, featuring arpeggiated triplets and melancholic melody.',
          duration: '6:00',
          pages: 5,
          uploadDate: '2024-01-15'
        },
        { 
          _id: '2', 
          title: 'Cello Suite No. 1', 
          composer: 'Johann Sebastian Bach', 
          instrument: 'cello',
          genre: 'baroque',
          period: 'Baroque',
          difficulty: 'advanced',
          key: 'G Major',
          tempo: 'Moderato',
          description: 'Prelude from the first cello suite, consisting of arpeggiated chords and flowing sixteenth notes.',
          duration: '2:30',
          pages: 3,
          uploadDate: '2024-01-12'
        },
        { 
          _id: '3', 
          title: 'Clair de Lune', 
          composer: 'Claude Debussy', 
          instrument: 'piano',
          genre: 'impressionist',
          period: 'Impressionist',
          difficulty: 'advanced',
          key: 'D♭ Major',
          tempo: 'Andante très expressif',
          description: 'Third movement of Suite bergamasque, known for its atmospheric and dream-like quality.',
          duration: '5:00',
          pages: 7,
          uploadDate: '2024-01-10'
        },
        { 
          _id: '4', 
          title: 'Violin Concerto in D Major', 
          composer: 'Pyotr Ilyich Tchaikovsky', 
          instrument: 'violin',
          genre: 'romantic',
          period: 'Romantic',
          difficulty: 'virtuoso',
          key: 'D Major',
          tempo: 'Allegro moderato',
          description: 'First movement of one of the most technically demanding violin concertos in repertoire.',
          duration: '18:00',
          pages: 24,
          uploadDate: '2024-01-08'
        },
        { 
          _id: '5', 
          title: 'Gymnopédie No. 1', 
          composer: 'Erik Satie', 
          instrument: 'piano',
          genre: 'contemporary',
          period: 'Modern',
          difficulty: 'beginner',
          key: 'D Major',
          tempo: 'Lent et douloureux',
          description: 'Famous minimalist piece with simple melody and chordal accompaniment.',
          duration: '3:30',
          pages: 2,
          uploadDate: '2024-01-05'
        },
        { 
          _id: '6', 
          title: 'The Four Seasons: Spring', 
          composer: 'Antonio Vivaldi', 
          instrument: 'violin',
          genre: 'baroque',
          period: 'Baroque',
          difficulty: 'intermediate',
          key: 'E Major',
          tempo: 'Allegro',
          description: 'First movement depicting spring with bird songs and flowing streams.',
          duration: '3:20',
          pages: 8,
          uploadDate: '2024-01-03'
        },
        { 
          _id: '7', 
          title: 'Nocturne Op. 9 No. 2', 
          composer: 'Frédéric Chopin', 
          instrument: 'piano',
          genre: 'romantic',
          period: 'Romantic',
          difficulty: 'intermediate',
          key: 'E♭ Major',
          tempo: 'Andante',
          description: 'One of Chopin\'s most famous nocturnes with beautiful lyrical melody.',
          duration: '4:30',
          pages: 4,
          uploadDate: '2024-01-01'
        },
        { 
          _id: '8', 
          title: 'Canon in D', 
          composer: 'Johann Pachelbel', 
          instrument: 'strings',
          genre: 'baroque',
          period: 'Baroque',
          difficulty: 'intermediate',
          key: 'D Major',
          tempo: 'Moderato',
          description: 'Canon for three violins and basso continuo with famous chord progression.',
          duration: '5:20',
          pages: 6,
          uploadDate: '2023-12-28'
        }
      ];
    },

    getClef(instrument) {
      const clefs = {
        piano: '𝄡', // Grand staff
        violin: '𝄞', // Treble clef
        cello: '𝄢', // Bass clef
        flute: '𝄞',
        saxophone: '𝄞',
        trumpet: '𝄞',
        voice: '𝄞',
        guitar: '𝄞',
        strings: '𝄡'
      };
      return clefs[instrument] || '𝄞';
    },

    getTimeSignature(genre) {
      const signatures = {
        classical: '4/4',
        baroque: '4/4',
        romantic: '3/4',
        jazz: '4/4',
        blues: '4/4',
        contemporary: '4/4',
        impressionist: '4/4'
      };
      return signatures[genre] || '4/4';
    },

    getPreviewNotes(sheet) {
      // Generate random notes for preview based on piece characteristics
      const noteSets = {
        piano: [
          { symbol: '𝅘𝅥', position: 0 },
          { symbol: '𝅘𝅥𝅮', position: 1 },
          { symbol: '𝅘𝅥', position: 2 },
          { symbol: '𝅘𝅥𝅯', position: 3 },
          { symbol: '𝅘𝅥', position: 1 }
        ],
        violin: [
          { symbol: '𝅘𝅥', position: 0 },
          { symbol: '𝅘𝅥𝅮', position: 2 },
          { symbol: '𝅘𝅥', position: 1 },
          { symbol: '𝅘𝅥𝅮', position: 3 }
        ],
        cello: [
          { symbol: '𝅘𝅥', position: 2 },
          { symbol: '𝅘𝅥', position: 1 },
          { symbol: '𝅘𝅥𝅮', position: 0 },
          { symbol: '𝅘𝅥', position: 3 }
        ],
        default: [
          { symbol: '𝅘𝅥', position: 1 },
          { symbol: '𝅘𝅥𝅮', position: 2 },
          { symbol: '𝅘𝅥', position: 0 },
          { symbol: '𝅘𝅥𝅮', position: 1 }
        ]
      };
      
      return noteSets[sheet.instrument] || noteSets.default;
    },

    getNoteStyle(note, index) {
      const left = 40 + (index * 25);
      const top = 20 + (note.position * 8);
      return {
        left: `${left}px`,
        top: `${top}px`
      };
    },

    getDynamicMarking(difficulty) {
      const dynamics = {
        beginner: 'p',
        intermediate: 'mf',
        advanced: 'f',
        virtuoso: 'ff'
      };
      return dynamics[difficulty] || 'mf';
    },

    getInstrumentIcon(instrument) {
      const icons = {
        piano: '🎹',
        guitar: '🎸',
        violin: '🎻',
        cello: '🎻',
        flute: '🎵',
        saxophone: '🎷',
        trumpet: '🎺',
        voice: '🎤',
        strings: '🎻'
      };
      return icons[instrument] || '🎵';
    },

    formatInstrument(instrument) {
      return instrument.charAt(0).toUpperCase() + instrument.slice(1);
    },

    formatDifficulty(difficulty) {
      const names = {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        virtuoso: 'Virtuoso'
      };
      return names[difficulty] || difficulty;
    },

    viewSheet(sheetId) {
      this.$router.push(`/sheets/${sheetId}`);
    },

    downloadSheet(sheet) {
      // In a real app, this would download the PDF
      console.log('Downloading sheet:', sheet.title);
      alert(`Downloading ${sheet.title} by ${sheet.composer}`);
    },

    clearFilters() {
      this.searchQuery = '';
      this.selectedInstrument = '';
      this.selectedGenre = '';
      this.selectedDifficulty = '';
    },

     addNewSheet() {
    console.log('Navigating to sheet creation form...');
    this.$router.push('/sheets/create').catch(err => {
      // Ignore navigation duplicates
      if (err.name !== 'NavigationDuplicated') {
        console.error('Navigation error:', err);
      }
    });
  },

    // Add this method to refresh the list when returning from form
    refreshSheets() {
      this.loadSheets();
    },

    // Handle storage events (when sheets are added from other tabs)
    handleStorageChange(event) {
      if (event.key === 'mockSheets') {
        console.log('Storage changed, refreshing sheets...');
        this.refreshSheets();
      }
    },

    // Handle visibility change (when returning to this tab)
    handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        console.log('Page visible, refreshing sheets...');
        this.refreshSheets();
      }
    }
  },

  // Add this to watch for route changes and refresh when coming back from form
  watch: {
    '$route'(to, from) {
      // Refresh when returning from the form page
      if ((from.path === '/sheets/new' && to.path === '/sheets') || 
          (from.name === 'SheetForm' && to.name === 'SheetsList')) {
        console.log('Returned from form, refreshing sheets...');
        setTimeout(() => {
          this.refreshSheets();
        }, 100);
      }
    }
  }
};
</script>

<style scoped>
/* Your existing styles remain exactly the same - no changes needed */
.sheets-list {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.8s ease-out;
}

.page-header::before {
  content: '♪ ♫ ♬ ♩ ♭ ♮ ♯';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 2rem;
  opacity: 0.1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  animation: floatSymbols 20s infinite linear;
}

.header-content h1 {
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slideInFromTop 0.6s ease-out;
}

.music-symbol {
  font-size: 2.5rem;
  animation: pulse 2s infinite;
}

.header-content p {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  font-weight: 300;
  animation: slideInFromTop 0.8s ease-out;
}

/* Controls */
.controls {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: end;
  animation: slideInFromBottom 0.8s ease-out;
}

.search-box {
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.search-input:focus + .search-icon {
  transform: translateY(-50%) scale(1.2);
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  background: white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 140px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filter-select:focus {
  outline: none;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  animation: fadeIn 1s ease-out;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  border: 1px solid #e1e5e9;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
  transition: transform 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.stat-info p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
  font-weight: 500;
}

/* Add New Sheet Section */
.add-sheet-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
  animation: fadeIn 1.2s ease-out;
}

.btn-add-sheet {
  background: #000000;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.btn-add-sheet::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s;
}

.btn-add-sheet:active::after {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
}

.btn-add-sheet:hover {
  background: #333333;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Sheets Grid */
.sheets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.sheet-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e1e5e9;
  display: flex;
  flex-direction: column;
  animation: cardAppear 0.5s ease-out;
  animation-fill-mode: both;
}

.sheet-card:nth-child(1) { animation-delay: 0.1s; }
.sheet-card:nth-child(2) { animation-delay: 0.2s; }
.sheet-card:nth-child(3) { animation-delay: 0.3s; }
.sheet-card:nth-child(4) { animation-delay: 0.4s; }
.sheet-card:nth-child(5) { animation-delay: 0.5s; }
.sheet-card:nth-child(6) { animation-delay: 0.6s; }
.sheet-card:nth-child(7) { animation-delay: 0.7s; }
.sheet-card:nth-child(8) { animation-delay: 0.8s; }

.sheet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  border-color: #000000;
}

/* Sheet Preview */
.sheet-preview {
  height: 180px;
  background: #fffaf0;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #e1e5e9;
}

.staff {
  position: relative;
  height: 100%;
  background: 
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 19px,
      #000000 19px,
      #000000 20px
    );
  background-size: 100% 20px;
  animation: staffSlide 20s linear infinite;
}

.staff-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
}

.clef {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 3rem;
  font-family: 'Arial Unicode MS', sans-serif;
  animation: clefBounce 3s infinite;
}

.time-signature {
  position: absolute;
  left: 80px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  font-weight: bold;
  color: #000000;
}

.notes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.note {
  position: absolute;
  font-size: 2rem;
  font-family: 'Arial Unicode MS', sans-serif;
  color: #000000;
  animation: noteFloat 4s infinite ease-in-out;
}

.note:nth-child(1) { animation-delay: 0s; }
.note:nth-child(2) { animation-delay: 0.5s; }
.note:nth-child(3) { animation-delay: 1s; }
.note:nth-child(4) { animation-delay: 1.5s; }
.note:nth-child(5) { animation-delay: 2s; }

.dynamic {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: #000000;
  font-style: italic;
  animation: dynamicPulse 2s infinite;
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  color: white;
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.sheet-preview:hover .preview-overlay {
  transform: translateY(0);
}

.preview-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.preview-composer {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Sheet Info */
.sheet-info {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.sheet-header {
  margin-bottom: 1rem;
}

.sheet-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.sheet-card:hover .sheet-title {
  color: #333333;
}

.sheet-meta-primary {
  display: flex;
  justify-content: between;
  align-items: center;
  gap: 1rem;
}

.composer {
  color: #000000;
  font-weight: 500;
  font-size: 0.95rem;
}

.period {
  background: #f0f0f0;
  color: #333333;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Sheet Details */
.sheet-details {
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
  transition: all 0.3s ease;
}

.detail-row:hover {
  background: #f8f9fa;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  border-radius: 4px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: #666666;
  font-size: 0.9rem;
  font-weight: 500;
}

.detail-value {
  color: #000000;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.instrument-icon {
  font-size: 1.1rem;
}

/* Sheet Footer */
.sheet-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.difficulty-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.difficulty-badge.beginner {
  background: #f0f0f0;
  color: #333333;
  border: 1px solid #d0d0d0;
}

.difficulty-badge.intermediate {
  background: #e0e0e0;
  color: #000000;
  border: 1px solid #b0b0b0;
}

.difficulty-badge.advanced {
  background: #d0d0d0;
  color: #000000;
  border: 1px solid #909090;
}

.difficulty-badge.virtuoso {
  background: #000000;
  color: #ffffff;
  border: 1px solid #000000;
}

.difficulty-badge:hover {
  transform: scale(1.05);
}

.difficulty-icon {
  font-size: 1rem;
}

.sheet-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view, .btn-download {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
}

.btn-view::after, .btn-download::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s;
}

.btn-view:active::after, .btn-download:active::after {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
}

.btn-view {
  background: #000000;
  color: white;
}

.btn-view:hover {
  background: #333333;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-download {
  background: #f0f0f0;
  color: #000000;
  border: 1px solid #d0d0d0;
}

.btn-download:hover {
  background: #e0e0e0;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 0.9rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e1e5e9;
  animation: fadeIn 1s ease-out;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
  animation: bounce 2s infinite;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #000000;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666666;
  margin-bottom: 2rem;
}

.btn-primary {
  background: #000000;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s;
}

.btn-primary:active::after {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
}

.btn-primary:hover {
  background: #333333;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  animation: fadeIn 0.5s ease-out;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Container */
.container {
  width: 90%;
  max-width: 1200px;
  margin: auto;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromTop {
  from { 
    opacity: 0;
    transform: translateY(-30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromBottom {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardAppear {
  from { 
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes floatSymbols {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes staffSlide {
  0% { background-position: 0 0; }
  100% { background-position: 0 100%; }
}

@keyframes clefBounce {
  0%, 100% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.1); }
}

@keyframes noteFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes dynamicPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sheets-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 2rem 0;
  }
  
  .header-content h1 {
    font-size: 2.2rem;
  }
  
  .controls {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .filter-group {
    flex-direction: column;
  }
  
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .sheets-grid {
    grid-template-columns: 1fr;
  }
  
  .sheet-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .sheet-actions {
    justify-content: center;
  }
  
  .add-sheet-section {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 1.5rem 0;
  }
  
  .header-content h1 {
    font-size: 1.8rem;
  }
  
  .header-content p {
    font-size: 1.1rem;
  }
  
  .search-input,
  .filter-select {
    padding: 0.8rem;
  }
  
  .stats {
    grid-template-columns: 1fr;
  }
  
  .sheet-info {
    padding: 1rem;
  }
  
  .sheet-actions {
    flex-direction: column;
  }
  
  .btn-view, .btn-download {
    width: 100%;
    justify-content: center;
  }
}
</style>