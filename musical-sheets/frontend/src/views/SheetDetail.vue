<template>
  <div class="sheet-detail" v-if="sheet">
    <!-- Navigation Header -->
    <div class="nav-header">
      <div class="container">
        <button class="back-btn" @click="$router.back()">
          <span class="back-icon">‹</span>
          Back to Library
        </button>
        <div class="header-actions">
          <button class="action-btn" @click="downloadSheet">
            <span class="action-icon">↓</span>
            Download PDF
          </button>
          <button class="action-btn" @click="printSheet">
            <span class="action-icon">⎙</span>
            Print
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <div class="sheet-layout">
        <!-- Sheet Music Display -->
        <div class="sheet-display">
          <!-- Sheet Header -->
          <div class="sheet-header">
            <h1 class="piece-title">{{ sheet.title }}</h1>
            <h2 class="piece-composer">by {{ sheet.composer }}</h2>
            <div class="piece-metadata">
              <span class="metadata-item">
                <span class="metadata-icon">♫</span>
                {{ sheet.genre }} • {{ sheet.period }}
              </span>
              <span class="metadata-item">
                <span class="metadata-icon">⏱</span>
                {{ sheet.duration }}
              </span>
              <span class="metadata-item">
                <span class="metadata-icon">📄</span>
                {{ sheet.pages }} pages
              </span>
            </div>
          </div>

          <!-- Sheet Music Content -->
          <div class="music-sheet">
            <div class="sheet-page">
              <div class="page-content">
                <!-- First Staff System -->
                <div class="staff-system">
                  <div class="instrument-name">
                    {{ formatInstrument(sheet.instrument) }}
                  </div>
                  
                  <div class="staff-container" :class="{ 'grand-staff': sheet.instrument === 'piano' }">
                    <!-- Treble Staff -->
                    <div class="staff treble-staff">
                      <div class="staff-lines">
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                      </div>
                      <div class="staff-content">
                        <div class="clef">{{ getClef(sheet.instrument) }}</div>
                        <div class="key-signature">{{ sheet.key }}</div>
                        <div class="time-signature">{{ getTimeSignature(sheet.genre) }}</div>
                        
                        <div class="measures">
                          <div class="measure" v-for="(measure, measureIndex) in trebleMeasures" :key="measureIndex">
                            <div class="notes-container">
                              <div 
                                v-for="(note, noteIndex) in measure.notes" 
                                :key="noteIndex"
                                class="note-wrapper"
                                :style="getNoteStyle(note, noteIndex)"
                              >
                                <div class="note" :class="note.type">
                                  {{ note.symbol }}
                                  <span v-if="note.flag" class="flag">{{ note.flag }}</span>
                                </div>
                                <div v-if="note.accidental" class="accidental">
                                  {{ note.accidental }}
                                </div>
                                <div v-if="note.ledgerAbove" class="ledger-line above"></div>
                                <div v-if="note.ledgerBelow" class="ledger-line below"></div>
                              </div>
                            </div>
                            <div class="measure-bar" v-if="measureIndex < trebleMeasures.length - 1"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Bass Staff for Piano -->
                    <div v-if="sheet.instrument === 'piano'" class="staff bass-staff">
                      <div class="staff-lines">
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                      </div>
                      <div class="staff-content">
                        <div class="clef">{{ getBassClef(sheet.instrument) }}</div>
                        <div class="key-signature">{{ sheet.key }}</div>
                        <div class="time-signature">{{ getTimeSignature(sheet.genre) }}</div>
                        
                        <div class="measures">
                          <div class="measure" v-for="(measure, measureIndex) in bassMeasures" :key="measureIndex">
                            <div class="notes-container">
                              <div 
                                v-for="(note, noteIndex) in measure.notes" 
                                :key="noteIndex"
                                class="note-wrapper"
                                :style="getNoteStyle(note, noteIndex)"
                              >
                                <div class="note" :class="note.type">
                                  {{ note.symbol }}
                                  <span v-if="note.flag" class="flag">{{ note.flag }}</span>
                                </div>
                                <div v-if="note.accidental" class="accidental">
                                  {{ note.accidental }}
                                </div>
                                <div v-if="note.ledgerAbove" class="ledger-line above"></div>
                                <div v-if="note.ledgerBelow" class="ledger-line below"></div>
                              </div>
                            </div>
                            <div class="measure-bar" v-if="measureIndex < bassMeasures.length - 1"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Expression Marks -->
                  <div class="expression-marks">
                    <div class="dynamic">{{ getDynamicMarking(sheet.difficulty) }}</div>
                    <div class="tempo">{{ sheet.tempo }}</div>
                  </div>
                </div>
              </div>

              <!-- Page Footer -->
              <div class="page-footer">
                <span class="page-number">1</span>
                <span class="copyright">© {{ new Date().getFullYear() }} Musical Sheets Library</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="sheet-sidebar">
          <!-- Quick Info -->
          <div class="info-card">
            <h3>Sheet Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Instrument:</span>
                <span class="info-value">
                  <span class="instrument-icon">{{ getInstrumentIcon(sheet.instrument) }}</span>
                  {{ formatInstrument(sheet.instrument) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Difficulty:</span>
                <span class="info-value">
                  <span class="difficulty-badge" :class="sheet.difficulty">
                    {{ formatDifficulty(sheet.difficulty) }}
                  </span>
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Key Signature:</span>
                <span class="info-value">{{ sheet.key }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Tempo:</span>
                <span class="info-value">{{ sheet.tempo }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Time Signature:</span>
                <span class="info-value">{{ getTimeSignature(sheet.genre) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Duration:</span>
                <span class="info-value">{{ sheet.duration }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Pages:</span>
                <span class="info-value">{{ sheet.pages }}</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="description-card">
            <h3>About this Piece</h3>
            <p>{{ sheet.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="loading-state">
    <div class="loading-spinner"></div>
    <p>Loading sheet music...</p>
  </div>

  <!-- Error State -->
  <div v-else class="error-state">
    <div class="error-icon">🎵</div>
    <h3>Sheet Not Found</h3>
    <p>The requested sheet music could not be found.</p>
    <button class="btn-primary" @click="$router.push('/sheets')">Back to Library</button>
  </div>
</template>

<script>
export default {
  name: 'SheetDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      sheet: null,
      trebleMeasures: [],
      bassMeasures: []
    };
  },
  async created() {
    await this.loadSheetData();
  },
  watch: {
    '$route'(to, from) {
      // Reload sheet data when the ID changes
      if (to.params.id !== from.params.id) {
        this.loadSheetData();
      }
    }
  },
  methods: {
    async loadSheetData() {
      this.loading = true;
      try {
        // First try localStorage (where newly created/edited sheets are stored)
        const localSheets = localStorage.getItem('mockSheets');
        if (localSheets) {
          const sheets = JSON.parse(localSheets);
          const sheetData = sheets.find(s => s._id === this.id);
          if (sheetData) {
            this.sheet = sheetData;
            this.generateSheetMusic();
            this.loading = false;
            return;
          }
        }

        // Then try the backend API
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:5000/api/sheets/${this.id}`, {
          headers: headers
        });

        if (response.ok) {
          const data = await response.json();
          this.sheet = data;
        } else {
          throw new Error('Failed to load sheet from backend');
        }
      } catch (error) {
        console.error('Error loading sheet:', error);
        // Final fallback to hardcoded mock data
        this.sheet = this.getSheetById(this.id);
        
        // If still not found, show error
        if (!this.sheet) {
          console.error('Sheet not found in any data source');
        }
      } finally {
        if (this.sheet) {
          this.generateSheetMusic();
        }
        this.loading = false;
      }
    },

    getSheetById(id) {
      const sheets = this.getAllSheets();
      return sheets.find(sheet => sheet._id === id) || null;
    },

    getAllSheets() {
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
          description: 'First movement of the famous Moonlight Sonata, featuring arpeggiated triplets and melancholic melody. Composed in 1801, this piece is one of Beethoven\'s most popular compositions for piano.',
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
          description: 'Prelude from the first cello suite, consisting of arpeggiated chords and flowing sixteenth notes. This masterpiece showcases the technical capabilities of the cello.',
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
          description: 'Third movement of Suite bergamasque, known for its atmospheric and dream-like quality. The title means "moonlight" in French.',
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
          description: 'First movement of one of the most technically demanding violin concertos in repertoire. Features brilliant passages and lyrical melodies.',
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
          description: 'Famous minimalist piece with simple melody and chordal accompaniment. Characterized by its haunting and serene quality.',
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
          description: 'First movement depicting spring with bird songs and flowing streams. Part of Vivaldi\'s famous set of four violin concertos.',
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
          description: 'One of Chopin\'s most famous nocturnes with beautiful lyrical melody and delicate ornamentation.',
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
          description: 'Canon for three violins and basso continuo with famous chord progression. One of the most recognized classical pieces.',
          duration: '5:20',
          pages: 6,
          uploadDate: '2023-12-28'
        }
      ];
    },

    generateSheetMusic() {
      // Generate different sheet music based on the piece
      switch(this.sheet._id) {
        case '1': // Moonlight Sonata
          this.trebleMeasures = this.generateMoonlightTreble();
          this.bassMeasures = this.generateMoonlightBass();
          break;
        case '2': // Cello Suite
          this.trebleMeasures = this.generateCelloTreble();
          this.bassMeasures = [];
          break;
        case '3': // Clair de Lune
          this.trebleMeasures = this.generateClairDeLuneTreble();
          this.bassMeasures = this.generateClairDeLuneBass();
          break;
        case '8': // Canon in D
          this.trebleMeasures = this.generateCanonTreble();
          this.bassMeasures = this.generateCanonBass();
          break;
        default:
          this.trebleMeasures = this.generateDefaultTreble();
          this.bassMeasures = this.generateDefaultBass();
      }
    },

    // Different music generators for different pieces
    generateMoonlightTreble() {
      return [
        {
          notes: [
            { symbol: '𝅘𝅥', type: 'quarter', position: 4, accidental: '♯' },
            { symbol: '𝅘𝅥', type: 'quarter', position: 2 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 5 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 3, accidental: '♯' }
          ]
        },
        {
          notes: [
            { symbol: '𝅘𝅥', type: 'quarter', position: 4 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 2 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 5 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 3 }
          ]
        }
      ];
    },

    generateMoonlightBass() {
      return [
        {
          notes: [
            { symbol: '𝅝', type: 'whole', position: -2 }
          ]
        },
        {
          notes: [
            { symbol: '𝅗𝅥', type: 'half', position: -1 },
            { symbol: '𝅗𝅥', type: 'half', position: -3 }
          ]
        }
      ];
    },

    generateCelloTreble() {
      return [
        {
          notes: [
            { symbol: '𝅘𝅥', type: 'quarter', position: 2 },
            { symbol: '𝅘𝅥𝅮', type: 'eighth', position: 3 },
            { symbol: '𝅘𝅥𝅮', type: 'eighth', position: 1 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 4 }
          ]
        },
        {
          notes: [
            { symbol: '𝅗𝅥', type: 'half', position: 2 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 0 }
          ]
        }
      ];
    },

    generateClairDeLuneTreble() {
      return [
        {
          notes: [
            { symbol: '𝅘𝅥', type: 'quarter', position: 3, accidental: '♭' },
            { symbol: '𝅘𝅥𝅮', type: 'eighth', position: 5 },
            { symbol: '𝅘𝅥𝅮', type: 'eighth', position: 4 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 2 }
          ]
        }
      ];
    },

    generateClairDeLuneBass() {
      return [
        {
          notes: [
            { symbol: '𝅗𝅥', type: 'half', position: -1, accidental: '♭' },
            { symbol: '𝅗𝅥', type: 'half', position: 0 }
          ]
        }
      ];
    },

    generateCanonTreble() {
      return [
        {
          notes: [
            { symbol: '𝅘𝅥', type: 'quarter', position: 2 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 4 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 1 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 3 }
          ]
        }
      ];
    },

    generateCanonBass() {
      return [
        {
          notes: [
            { symbol: '𝅝', type: 'whole', position: -2 }
          ]
        }
      ];
    },

    generateDefaultTreble() {
      return [
        {
          notes: [
            { symbol: '𝅘𝅥', type: 'quarter', position: 1 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 2 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 3 },
            { symbol: '𝅘𝅥', type: 'quarter', position: 2 }
          ]
        }
      ];
    },

    generateDefaultBass() {
      return [
        {
          notes: [
            { symbol: '𝅗𝅥', type: 'half', position: -1 },
            { symbol: '𝅗𝅥', type: 'half', position: -2 }
          ]
        }
      ];
    },

    getNoteStyle(note, index) {
      const horizontalSpacing = this.getHorizontalSpacing(note.type);
      const verticalPosition = this.getVerticalPosition(note.position);
      
      return {
        left: `${20 + (index * horizontalSpacing)}px`,
        top: `${verticalPosition}px`
      };
    },

    getHorizontalSpacing(noteType) {
      const spacing = {
        'whole': 80,
        'half': 60,
        'quarter': 40,
        'eighth': 25
      };
      return spacing[noteType] || 40;
    },

    getVerticalPosition(position) {
      const baseLine = 60;
      const lineSpacing = 12;
      return baseLine - (position * lineSpacing);
    },

    getClef(instrument) {
      const clefs = {
        piano: '𝄞',
        violin: '𝄞',
        cello: '𝄢',
        flute: '𝄞',
        saxophone: '𝄞',
        trumpet: '𝄞',
        voice: '𝄞',
        guitar: '𝄞',
        strings: '𝄞'
      };
      return clefs[instrument] || '𝄞';
    },

    getBassClef(instrument) {
      const clefs = {
        piano: '𝄢',
        cello: '𝄢'
      };
      return clefs[instrument] || '𝄢';
    },

    getTimeSignature(genre) {
      const signatures = {
        classical: '4/4',
        baroque: '4/4',
        romantic: '3/4',
        jazz: '4/4',
        blues: '4/4',
        contemporary: '4/4',
        impressionist: '9/8'
      };
      return signatures[genre] || '4/4';
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

    downloadSheet() {
      alert(`Downloading ${this.sheet.title}`);
    },

    printSheet() {
      window.print();
    }
  }
};
</script>

<style scoped>
.sheet-detail {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #000000;
  animation: pageReveal 0.8s ease-out;
}

@keyframes pageReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Navigation Header */
.nav-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.25rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.nav-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.back-btn {
  background: #ffffff;
  color: #000000;
  border: 2px solid #000000;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.back-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
  transition: left 0.6s ease;
}

.back-btn:hover::before {
  left: 100%;
}

.back-btn:hover {
  background: #000000;
  color: #ffffff;
  transform: translateX(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  background: #ffffff;
  color: #000000;
  border: 2px solid #000000;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
  transition: left 0.6s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:hover {
  background: #000000;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Main Layout */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  animation: contentReveal 0.8s ease-out 0.3s both;
}

@keyframes contentReveal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sheet-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 3rem;
  padding: 3rem 0;
}

/* Sheet Display */
.sheet-display {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  animation: cardSlideIn 0.8s ease-out 0.5s both;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.sheet-header {
  padding: 3rem;
  text-align: center;
  background: linear-gradient(135deg, #f8f8f8 0%, #ffffff 100%);
  color: #000000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.sheet-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #000000, #333333, #666666, #333333, #000000);
  background-size: 200% 100%;
  animation: shimmer 3s infinite linear;
}

.piece-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  letter-spacing: -0.5px;
  color: #000000;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleReveal 0.8s ease-out 0.7s both;
}

@keyframes titleReveal {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.piece-composer {
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 2rem;
  color: #666666;
  animation: composerReveal 0.8s ease-out 0.8s both;
}

@keyframes composerReveal {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.piece-metadata {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  animation: metadataReveal 0.8s ease-out 0.9s both;
}

@keyframes metadataReveal {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: #666666;
  font-weight: 500;
  padding: 0.75rem 1.25rem;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.metadata-item:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Music Sheet */
.music-sheet {
  background: #ffffff;
  padding: 3rem;
}

.sheet-page {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s ease;
}

.sheet-page:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.page-content {
  padding: 3rem;
}

/* Staff System */
.staff-system {
  margin-bottom: 3rem;
  animation: staffReveal 1s ease-out 1s both;
}

@keyframes staffReveal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.instrument-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 2rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
}

.instrument-name::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: #000000;
  animation: lineExpand 0.8s ease-out 1.1s both;
}

@keyframes lineExpand {
  from {
    width: 0;
  }
  to {
    width: 60px;
  }
}

.staff-container {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 2rem;
  background: #ffffff;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.staff-container:hover {
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 2px 12px rgba(0, 0, 0, 0.05);
}

.staff-container.grand-staff {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Staff */
.staff {
  position: relative;
  height: 140px;
  background: #ffffff;
}

.staff-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 2rem;
}

.line {
  height: 2px;
  background: #000000;
  width: 100%;
  opacity: 0.8;
  transform-origin: left;
  animation: lineDraw 1.5s ease-out 1.2s both;
}

@keyframes lineDraw {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.staff-content {
  position: relative;
  height: 100%;
  padding-left: 100px;
}

.clef {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 4rem;
  font-family: 'Arial Unicode MS', sans-serif;
  color: #000000;
  animation: clefReveal 0.8s ease-out 1.3s both;
}

@keyframes clefReveal {
  from {
    opacity: 0;
    transform: translateY(-50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
}

.key-signature {
  position: absolute;
  left: 70px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  font-weight: 700;
  color: #000000;
  animation: elementReveal 0.8s ease-out 1.4s both;
}

.time-signature {
  position: absolute;
  left: 70px;
  top: 30%;
  font-size: 1.4rem;
  font-weight: 700;
  color: #000000;
  animation: elementReveal 0.8s ease-out 1.4s both;
}

@keyframes elementReveal {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.measures {
  display: flex;
  height: 100%;
  position: relative;
  animation: measuresReveal 1s ease-out 1.5s both;
}

@keyframes measuresReveal {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.measure {
  flex: 1;
  position: relative;
  height: 100%;
  min-width: 160px;
}

.notes-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.note-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 4px;
  animation: noteBounce 2s ease-in-out infinite;
}

@keyframes noteBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.note {
  font-size: 2.4rem;
  font-family: 'Arial Unicode MS', sans-serif;
  color: #000000;
  position: relative;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.note:hover {
  transform: scale(1.1);
  filter: grayscale(0%);
}

.note.quarter {
  font-size: 2.6rem;
}

.note.eighth {
  font-size: 2.2rem;
}

.note.half {
  font-size: 2.6rem;
}

.note.whole {
  font-size: 2.8rem;
}

.flag {
  position: absolute;
  right: -12px;
  top: -8px;
  font-size: 1.2rem;
  color: #000000;
}

.accidental {
  font-size: 1.2rem;
  font-family: 'Arial Unicode MS', sans-serif;
  color: #000000;
  margin-right: 4px;
  font-weight: bold;
}

.ledger-line {
  position: absolute;
  width: 32px;
  height: 2px;
  background: #000000;
  left: -6px;
  opacity: 0.8;
}

.ledger-line.above {
  top: -8px;
}

.ledger-line.below {
  bottom: -8px;
}

.measure-bar {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #000000;
  opacity: 0.8;
}

.expression-marks {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding: 0 2rem;
  animation: expressionReveal 0.8s ease-out 1.6s both;
}

@keyframes expressionReveal {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dynamic {
  font-size: 1.2rem;
  font-weight: 700;
  font-style: italic;
  color: #000000;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}

.tempo {
  font-size: 1.1rem;
  font-style: italic;
  color: #666666;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
}

.page-footer {
  padding: 2rem 3rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f8f8;
}

.page-number {
  font-weight: 700;
  color: #666666;
  font-size: 1.1rem;
}

.copyright {
  font-size: 0.9rem;
  color: #666666;
}

/* Sidebar */
.sheet-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: sidebarReveal 0.8s ease-out 0.6s both;
}

@keyframes sidebarReveal {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.info-card,
.description-card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.info-card::before,
.description-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #000000, #333333, #000000);
}

.info-card:hover,
.description-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(0, 0, 0, 0.08);
}

.info-card h3,
.description-card h3 {
  margin-bottom: 2rem;
  color: #000000;
  font-size: 1.3rem;
  font-weight: 700;
  border-bottom: 2px solid #000000;
  padding-bottom: 1rem;
  letter-spacing: -0.3px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateX(5px);
  border-bottom-color: rgba(0, 0, 0, 0.1);
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  color: #666666;
  font-size: 1rem;
  font-weight: 600;
}

.info-value {
  color: #000000;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.instrument-icon {
  font-size: 1.2rem;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.info-item:hover .instrument-icon {
  filter: grayscale(0%);
  transform: scale(1.1);
}

.difficulty-badge {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.difficulty-badge:hover {
  transform: scale(1.05);
}

.difficulty-badge.beginner {
  background: #f5f5f5;
  color: #000000;
  border: 2px solid #d0d0d0;
}

.difficulty-badge.intermediate {
  background: #e8e8e8;
  color: #000000;
  border: 2px solid #b8b8b8;
}

.difficulty-badge.advanced {
  background: #d8d8d8;
  color: #000000;
  border: 2px solid #a0a0a0;
}

.difficulty-badge.virtuoso {
  background: #c8c8c8;
  color: #000000;
  border: 2px solid #888888;
}

.description-card p {
  color: #333333;
  line-height: 1.7;
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem;
  text-align: center;
  background: #ffffff;
  min-height: 60vh;
  animation: fadeIn 0.8s ease-out;
}

.loading-spinner {
  width: 70px;
  height: 70px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #000000;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.loading-state p {
  color: #666666;
  font-size: 1.2rem;
  font-weight: 500;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem;
  text-align: center;
  background: #ffffff;
  min-height: 60vh;
  animation: fadeIn 0.8s ease-out;
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 2rem;
  opacity: 0.7;
  filter: grayscale(100%);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.error-state h3 {
  font-size: 1.8rem;
  color: #000000;
  margin-bottom: 1rem;
  font-weight: 700;
}

.error-state p {
  color: #666666;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
  max-width: 400px;
  line-height: 1.6;
}

.btn-primary {
  background: #000000;
  color: #ffffff;
  border: 2px solid #000000;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-size: 1rem;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  background: #333333;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sheet-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  
  .sheet-sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .piece-title {
    font-size: 2rem;
  }
  
  .piece-composer {
    font-size: 1.2rem;
  }
  
  .piece-metadata {
    flex-direction: column;
    gap: 1rem;
  }
  
  .metadata-item {
    width: 100%;
    justify-content: center;
  }
  
  .music-sheet {
    padding: 2rem;
  }
  
  .page-content {
    padding: 2rem;
  }
  
  .staff {
    height: 120px;
  }
  
  .clef {
    font-size: 3rem;
  }
  
  .note {
    font-size: 2rem;
  }
  
  .measures {
    flex-wrap: wrap;
  }
  
  .measure {
    flex: 1 0 45%;
    margin-bottom: 1.5rem;
    min-height: 100px;
  }
  
  .nav-header .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .sheet-header {
    padding: 2rem;
  }
  
  .piece-title {
    font-size: 1.8rem;
  }
  
  .measures {
    flex-direction: column;
  }
  
  .measure {
    flex: 1;
    min-height: 80px;
    margin-bottom: 2rem;
  }
  
  .info-card,
  .description-card {
    padding: 2rem;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .sheet-layout {
    padding: 2rem 0;
  }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Scroll animations */
@media (prefers-reduced-motion: no-preference) {
  .sheet-display,
  .sheet-sidebar {
    view-timeline: --card;
    animation: cardReveal linear both;
    animation-timeline: --card;
    animation-range: entry 25% cover 40%;
  }
}

@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>