<template>
  <div class="sheet-form-page">
    <!-- Navigation Header -->
    <div class="nav-header">
      <div class="container">
        <button class="back-btn" @click="goBack">
          <span class="back-icon">‹</span>
          Back
        </button>
        <div class="header-title">
          <h1>{{ pageTitle }}</h1>
        </div>
        <div class="header-actions">
          <button class="action-btn" @click="resetForm">
            <span class="action-icon">×</span>
            {{ isEdit ? 'Cancel Edit' : 'Clear Form' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Form -->
    <div class="container">
      <div class="form-container">
        <form @submit.prevent="saveSheet" class="sheet-form">
          <!-- Basic Information -->
          <div class="form-section">
            <h2>Basic Information</h2>
            <div class="form-grid">
              <div class="form-group">
                <label for="title">Sheet Title *</label>
                <input
                  id="title"
                  v-model="sheet.title"
                  type="text"
                  required
                  placeholder="Enter sheet title (e.g., Moonlight Sonata)"
                  class="form-input"
                  :class="{ 'input-error': errors.title }"
                >
                <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
              </div>

              <div class="form-group">
                <label for="composer">Composer *</label>
                <input
                  id="composer"
                  v-model="sheet.composer"
                  type="text"
                  required
                  placeholder="Enter composer name"
                  class="form-input"
                  :class="{ 'input-error': errors.composer }"
                >
                <span v-if="errors.composer" class="error-message">{{ errors.composer }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="description">Description *</label>
              <textarea
                id="description"
                v-model="sheet.description"
                required
                placeholder="Describe the piece, its style, and any special features..."
                rows="4"
                class="form-textarea"
                :class="{ 'input-error': errors.description }"
              ></textarea>
              <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
            </div>
          </div>

          <!-- Musical Details -->
          <div class="form-section">
            <h2>Musical Details</h2>
            <div class="form-grid">
              <div class="form-group">
                <label for="instrument">Primary Instrument *</label>
                <select
                  id="instrument"
                  v-model="sheet.instrument"
                  required
                  class="form-select"
                  :class="{ 'input-error': errors.instrument }"
                >
                  <option value="">Select instrument</option>
                  <option value="piano">Piano</option>
                  <option value="guitar">Guitar</option>
                  <option value="violin">Violin</option>
                  <option value="cello">Cello</option>
                  <option value="flute">Flute</option>
                  <option value="saxophone">Saxophone</option>
                  <option value="trumpet">Trumpet</option>
                  <option value="voice">Voice</option>
                  <option value="other">Other</option>
                </select>
                <span v-if="errors.instrument" class="error-message">{{ errors.instrument }}</span>
              </div>

              <div class="form-group">
                <label for="genre">Genre *</label>
                <select
                  id="genre"
                  v-model="sheet.genre"
                  required
                  class="form-select"
                  :class="{ 'input-error': errors.genre }"
                >
                  <option value="">Select genre</option>
                  <option value="classical">Classical</option>
                  <option value="baroque">Baroque</option>
                  <option value="romantic">Romantic</option>
                  <option value="jazz">Jazz</option>
                  <option value="blues">Blues</option>
                  <option value="contemporary">Contemporary</option>
                  <option value="other">Other</option>
                </select>
                <span v-if="errors.genre" class="error-message">{{ errors.genre }}</span>
              </div>

              <div class="form-group">
                <label for="difficulty">Difficulty Level *</label>
                <select
                  id="difficulty"
                  v-model="sheet.difficulty"
                  required
                  class="form-select"
                  :class="{ 'input-error': errors.difficulty }"
                >
                  <option value="">Select difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="virtuoso">Virtuoso</option>
                </select>
                <span v-if="errors.difficulty" class="error-message">{{ errors.difficulty }}</span>
              </div>

              <div class="form-group">
                <label for="duration">Duration</label>
                <input
                  id="duration"
                  v-model="sheet.duration"
                  type="text"
                  placeholder="e.g., 3:45 or 5 minutes"
                  class="form-input"
                >
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="key">Key Signature</label>
                <input
                  id="key"
                  v-model="sheet.key"
                  type="text"
                  placeholder="e.g., C Major, G Minor"
                  class="form-input"
                >
              </div>

              <div class="form-group">
                <label for="tempo">Tempo</label>
                <input
                  id="tempo"
                  v-model="sheet.tempo"
                  type="text"
                  placeholder="e.g., Allegro, Andante"
                  class="form-input"
                >
              </div>

              <div class="form-group">
                <label for="period">Musical Period</label>
                <select
                  id="period"
                  v-model="sheet.period"
                  class="form-select"
                >
                  <option value="">Select period</option>
                  <option value="Baroque">Baroque</option>
                  <option value="Classical">Classical</option>
                  <option value="Romantic">Romantic</option>
                  <option value="Impressionist">Impressionist</option>
                  <option value="Contemporary">Contemporary</option>
                  <option value="Modern">Modern</option>
                </select>
              </div>

              <div class="form-group">
                <label for="pages">Number of Pages</label>
                <input
                  id="pages"
                  v-model="sheet.pages"
                  type="number"
                  min="1"
                  placeholder="e.g., 5"
                  class="form-input"
                >
              </div>
            </div>
          </div>

          <!-- File Upload -->
          <div class="form-section">
            <h2>Sheet File</h2>
            <div class="form-group">
              <label for="file">
                {{ isEdit ? 'Update Sheet Music' : 'Upload Sheet Music' }} 
                {{ !isEdit ? '*' : '' }}
              </label>
              <div class="file-upload-area" @click="triggerFileInput" :class="{ 'has-file': sheet.file || sheet.existingFileName }">
                <input
                  id="file"
                  ref="fileInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.mus,.sib"
                  @change="handleFileUpload"
                  class="file-input"
                >
                <div class="upload-content">
                  <div class="upload-icon">📄</div>
                  <div v-if="!sheet.file && !sheet.existingFileName" class="upload-text">
                    <h4>Click to upload sheet music</h4>
                    <p>Supports PDF, JPG, PNG, MusicXML, Sibelius</p>
                  </div>
                  <div v-else class="upload-text">
                    <h4>{{ sheet.file ? sheet.file.name : sheet.existingFileName }}</h4>
                    <p v-if="sheet.file">{{ formatFileSize(sheet.file.size) }} • Click to change</p>
                    <p v-else>Existing file • Click to replace</p>
                  </div>
                </div>
              </div>
              <span v-if="errors.file" class="error-message">{{ errors.file }}</span>
              <small v-if="isEdit" class="help-text">Leave empty to keep the current file</small>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="form-section">
            <h2>Additional Information</h2>
            <div class="form-group">
              <label for="tags">Tags</label>
              <input
                id="tags"
                v-model="sheet.tags"
                type="text"
                placeholder="Add tags separated by commas (e.g., sonata, romantic, wedding)"
                class="form-input"
              >
              <small class="help-text">Help others find your sheet with relevant tags</small>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="sheet.isPublic" class="checkbox">
                <span class="checkmark"></span>
                Make this sheet public
              </label>
              <small class="help-text">Public sheets are visible to all users</small>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button
              type="button"
              class="btn-secondary"
              @click="goBack"
              :disabled="loading"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn-primary"
              :disabled="loading"
              :class="{ 'button-loading': loading }"
            >
              <span v-if="!loading">{{ submitButtonText }}</span>
              <div v-else class="loading-spinner"></div>
            </button>
          </div>

          <!-- Message Display -->
          <div v-if="message" class="message" :class="messageType">
            {{ message }}
          </div>
        </form>

        <!-- Form Tips -->
        <div class="form-tips">
          <h3>📝 Upload Tips</h3>
          <div class="tip-item">
            <strong>File Format:</strong> Use PDF for best quality and compatibility
          </div>
          <div class="tip-item">
            <strong>Title:</strong> Include key and opus number for classical pieces
          </div>
          <div class="tip-item">
            <strong>Description:</strong> Mention tempo, mood, and technical requirements
          </div>
          <div class="tip-item">
            <strong>Difficulty:</strong> Be accurate to help users find appropriate pieces
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SheetForm',
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      message: '',
      messageType: '',
      isEdit: false,
      sheet: {
        title: '',
        composer: '',
        description: '',
        instrument: '',
        genre: '',
        difficulty: '',
        duration: '',
        key: '',
        tempo: '',
        period: '',
        pages: '',
        tags: '',
        isPublic: true,
        file: null,
        existingFileName: ''
      },
      errors: {
        title: '',
        composer: '',
        description: '',
        instrument: '',
        genre: '',
        difficulty: '',
        file: ''
      }
    };
  },
  computed: {
    pageTitle() {
      return this.isEdit ? 'Edit Sheet Music' : 'Upload New Sheet Music';
    },
    submitButtonText() {
      return this.loading ? '' : (this.isEdit ? 'Update Sheet Music' : 'Upload Sheet Music');
    }
  },
  async created() {
    console.log('SheetForm created with id:', this.id);
    this.isEdit = !!this.id;
    
    if (this.isEdit) {
      await this.loadSheetData();
    } else {
      console.log('Creating new sheet - initializing empty form');
    }
  },
  methods: {
    async loadSheetData() {
      this.loading = true;
      try {
        console.log('Loading sheet data for id:', this.id);
        
        // First try localStorage
        const localSheets = localStorage.getItem('mockSheets');
        if (localSheets) {
          const sheets = JSON.parse(localSheets);
          const sheetData = sheets.find(s => s._id === this.id);
          if (sheetData) {
            console.log('Found sheet in localStorage:', sheetData.title);
            this.sheet = {
              ...this.sheet,
              title: sheetData.title || '',
              composer: sheetData.composer || '',
              description: sheetData.description || '',
              instrument: sheetData.instrument || '',
              genre: sheetData.genre || '',
              difficulty: sheetData.difficulty || '',
              duration: sheetData.duration || '',
              key: sheetData.key || '',
              tempo: sheetData.tempo || '',
              period: sheetData.period || '',
              pages: sheetData.pages || '',
              tags: sheetData.tags || '',
              isPublic: sheetData.isPublic !== false,
              existingFileName: sheetData.fileName || ''
            };
            this.loading = false;
            return;
          }
        }

        // Fallback to API
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:5000/api/sheets/${this.id}`, {
          method: 'GET',
          headers: headers
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }

        const sheetData = await response.json();
        
        this.sheet = {
          ...this.sheet,
          title: sheetData.title || '',
          composer: sheetData.composer || '',
          description: sheetData.description || '',
          instrument: sheetData.instrument || '',
          genre: sheetData.genre || '',
          difficulty: sheetData.difficulty || '',
          duration: sheetData.duration || '',
          key: sheetData.key || '',
          tempo: sheetData.tempo || '',
          period: sheetData.period || '',
          pages: sheetData.pages || '',
          tags: sheetData.tags || '',
          isPublic: sheetData.isPublic !== false,
          existingFileName: sheetData.fileName || ''
        };

      } catch (error) {
        console.error('Error loading sheet:', error);
        this.showMessage(`Error loading sheet: ${error.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.recordare.musicxml+xml'];
        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png|mus|sib)$/i)) {
          this.errors.file = 'Please upload a valid file type (PDF, JPG, PNG, MusicXML)';
          return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
          this.errors.file = 'File size must be less than 10MB';
          return;
        }
        
        this.sheet.file = file;
        this.errors.file = '';
      }
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    validateForm() {
      let isValid = true;
      
      Object.keys(this.errors).forEach(key => this.errors[key] = '');
      
      if (!this.sheet.title.trim()) {
        this.errors.title = 'Title is required';
        isValid = false;
      }
      
      if (!this.sheet.composer.trim()) {
        this.errors.composer = 'Composer is required';
        isValid = false;
      }
      
      if (!this.sheet.description.trim()) {
        this.errors.description = 'Description is required';
        isValid = false;
      }
      
      if (!this.sheet.instrument) {
        this.errors.instrument = 'Instrument is required';
        isValid = false;
      }
      
      if (!this.sheet.genre) {
        this.errors.genre = 'Genre is required';
        isValid = false;
      }
      
      if (!this.sheet.difficulty) {
        this.errors.difficulty = 'Difficulty level is required';
        isValid = false;
      }
      
      if (!this.isEdit && !this.sheet.file) {
        this.errors.file = 'Please upload a sheet music file';
        isValid = false;
      }
      
      return isValid;
    },

    async saveSheet() {
      if (!this.validateForm()) {
        this.showMessage('Please fix the errors above', 'error');
        return;
      }
      
      this.loading = true;
      this.message = '';

      try {
        const formData = new FormData();
        formData.append('title', this.sheet.title);
        formData.append('composer', this.sheet.composer);
        formData.append('description', this.sheet.description);
        formData.append('instrument', this.sheet.instrument);
        formData.append('genre', this.sheet.genre);
        formData.append('difficulty', this.sheet.difficulty);
        formData.append('duration', this.sheet.duration);
        formData.append('key', this.sheet.key);
        formData.append('tempo', this.sheet.tempo);
        formData.append('period', this.sheet.period);
        formData.append('pages', this.sheet.pages);
        formData.append('tags', this.sheet.tags);
        formData.append('isPublic', this.sheet.isPublic);
        
        if (this.sheet.file) {
          formData.append('file', this.sheet.file);
        }

        const token = localStorage.getItem('token');
        const headers = {};
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const url = this.isEdit 
          ? `http://localhost:5000/api/sheets/${this.id}`
          : 'http://localhost:5000/api/sheets';
          
        const method = this.isEdit ? 'PUT' : 'POST';

        console.log(`${method} request to: ${url}`);

        const response = await fetch(url, {
          method: method,
          headers: headers,
          body: formData,
        });

        if (!response.ok) {
          let errorMessage = `Server error: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If response is not JSON, use status text
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Save successful:', result);

        const action = this.isEdit ? 'updated' : 'uploaded';
        this.showMessage(`Sheet music ${action} successfully!`, 'success');
        
        // Save to localStorage as fallback and trigger storage event
        this.saveToLocalStorage();
        
      } catch (error) {
        console.error(`Error ${this.isEdit ? 'updating' : 'adding'} sheet:`, error);
        
        let errorMessage = error.message;
        if (error.message.includes('Failed to fetch')) {
          // If API is not available, use localStorage
          this.saveToLocalStorage();
          return;
        }
        
        this.showMessage(`Error: ${errorMessage}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    saveToLocalStorage() {
      try {
        const mockSheet = {
          _id: this.isEdit ? this.id : `sheet_${Date.now()}`,
          title: this.sheet.title,
          composer: this.sheet.composer,
          description: this.sheet.description,
          instrument: this.sheet.instrument,
          genre: this.sheet.genre,
          difficulty: this.sheet.difficulty,
          duration: this.sheet.duration,
          key: this.sheet.key || 'C Major',
          tempo: this.sheet.tempo || 'Moderato',
          period: this.sheet.period || 'Classical',
          pages: this.sheet.pages || Math.floor(Math.random() * 10) + 1,
          tags: this.sheet.tags,
          isPublic: this.sheet.isPublic,
          createdAt: new Date().toISOString(),
          fileName: this.sheet.file ? this.sheet.file.name : 'uploaded-file.pdf',
          uploadDate: new Date().toISOString().split('T')[0]
        };

        const existingSheets = JSON.parse(localStorage.getItem('mockSheets') || '[]');
        
        if (this.isEdit) {
          const index = existingSheets.findIndex(s => s._id === this.id);
          if (index !== -1) {
            existingSheets[index] = { ...existingSheets[index], ...mockSheet };
          } else {
            existingSheets.push(mockSheet);
          }
        } else {
          existingSheets.push(mockSheet);
        }

        localStorage.setItem('mockSheets', JSON.stringify(existingSheets));

        // Trigger storage event to notify other components
        window.dispatchEvent(new Event('storage'));

        const action = this.isEdit ? 'updated' : 'uploaded';
        this.showMessage(`Sheet music ${action} successfully! (Using local storage)`, 'success');
        
        setTimeout(() => {
          this.navigateAfterSave();
        }, 1500);
        
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        this.showMessage(`Error saving sheet: ${error.message}`, 'error');
      }
    },

    navigateAfterSave() {
      if (this.isEdit) {
        this.$router.push(`/sheets/${this.id}`);
      } else {
        this.$router.push('/sheets');
      }
    },

    showMessage(text, type) {
      this.message = text;
      this.messageType = type;
      
      if (type === 'success') {
        setTimeout(() => {
          this.message = '';
        }, 5000);
      }
    },

    goBack() {
      if (this.isEdit && this.id) {
        this.$router.push(`/sheets/${this.id}`);
      } else {
        this.$router.push('/sheets');
      }
    },

    resetForm() {
      if (this.isEdit) {
        this.goBack();
      } else {
        this.sheet = {
          title: '',
          composer: '',
          description: '',
          instrument: '',
          genre: '',
          difficulty: '',
          duration: '',
          key: '',
          tempo: '',
          period: '',
          pages: '',
          tags: '',
          isPublic: true,
          file: null,
          existingFileName: ''
        };
        this.message = '';
        Object.keys(this.errors).forEach(key => this.errors[key] = '');
        
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
        
        this.showMessage('Form cleared', 'success');
      }
    }
  }
};
</script>

<style scoped>
/* Your existing styles remain exactly the same - no changes needed */
.sheet-form-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
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
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e5e5;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  animation: slideDown 0.4s ease-out;
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
  padding: 0 1rem;
}

.back-btn {
  background: #ffffff;
  color: #000000;
  border: 1px solid #d4d4d4;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
  transition: left 0.5s;
}

.back-btn:hover::before {
  left: 100%;
}

.back-btn:hover {
  background: #f5f5f5;
  border-color: #a3a3a3;
  transform: translateX(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  margin: 0;
  background: linear-gradient(135deg, #000000 0%, #404040 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  background: #ffffff;
  color: #000000;
  border: 1px solid #d4d4d4;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover {
  background: #f5f5f5;
  border-color: #a3a3a3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Container */
.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 0;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Form Container */
.form-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* Form Styles */
.sheet-form {
  background: #ffffff;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
  animation: formSlideIn 0.6s ease-out 0.4s both;
}

@keyframes formSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-section {
  margin-bottom: 3rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid #f0f0f0;
  animation: sectionReveal 0.6s ease-out both;
}

@keyframes sectionReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-section:nth-child(1) { animation-delay: 0.5s; }
.form-section:nth-child(2) { animation-delay: 0.6s; }
.form-section:nth-child(3) { animation-delay: 0.7s; }
.form-section:nth-child(4) { animation-delay: 0.8s; }

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #000000;
  position: relative;
}

.form-section h2::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: #000000;
  animation: expandLine 0.8s ease-out 0.8s both;
}

@keyframes expandLine {
  from { width: 0; }
  to { width: 60px; }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.75rem;
}

.form-group {
  margin-bottom: 1.75rem;
  position: relative;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #000000;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  font-size: 1rem;
  background: #fafafa;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #000000;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #000000;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.5;
  transition: min-height 0.3s ease;
}

.form-textarea:focus {
  min-height: 140px;
}

.input-error {
  border-color: #dc2626 !important;
  background: #fef2f2 !important;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-message {
  display: block;
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
  animation: fadeIn 0.3s ease-out;
}

.help-text {
  display: block;
  color: #666666;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  transition: color 0.3s ease;
}

/* File Upload */
.file-upload-area {
  border: 2px dashed #d4d4d4;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafafa;
  position: relative;
  overflow: hidden;
}

.file-upload-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.02), transparent);
  transition: left 0.6s;
}

.file-upload-area:hover::before {
  left: 100%;
}

.file-upload-area:hover,
.file-upload-area.has-file {
  border-color: #000000;
  background: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.file-input {
  display: none;
}

.upload-content {
  pointer-events: none;
  transition: transform 0.3s ease;
}

.file-upload-area:hover .upload-content {
  transform: scale(1.02);
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}

.file-upload-area:hover .upload-icon {
  opacity: 1;
  transform: scale(1.1);
}

.upload-text h4 {
  color: #000000;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.upload-text p {
  color: #666666;
  margin: 0;
  font-size: 0.9rem;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  color: #000000;
  transition: color 0.3s ease;
}

.checkbox-label:hover {
  color: #404040;
}

.checkbox {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #d4d4d4;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
}

.checkbox:checked + .checkmark {
  background: #000000;
  border-color: #000000;
  animation: checkmarkPop 0.3s ease;
}

@keyframes checkmarkPop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.checkbox:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 3rem;
  padding-top: 2.5rem;
  border-top: 1px solid #f0f0f0;
  animation: fadeIn 0.6s ease-out 1s both;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 160px;
  position: relative;
  overflow: hidden;
}

.btn-primary::before,
.btn-secondary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.4s ease;
  transform: translate(-50%, -50%);
}

.btn-primary:active::before,
.btn-secondary:active::before {
  width: 300px;
  height: 300px;
}

.btn-primary {
  background: #000000;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #ffffff;
  color: #000000;
  border: 1px solid #d4d4d4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #a3a3a3;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.button-loading {
  pointer-events: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Message */
.message {
  padding: 1.25rem 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  font-weight: 500;
  border-left: 4px solid;
  animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.message.success {
  background: #f0f0f0;
  color: #059669;
  border-left-color: #059669;
}

.message.error {
  background: #f0f0f0;
  color: #dc2626;
  border-left-color: #dc2626;
}

/* Form Tips */
.form-tips {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
  position: sticky;
  top: 2rem;
  animation: tipsSlideIn 0.6s ease-out 0.6s both;
}

@keyframes tipsSlideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-tips h3 {
  color: #000000;
  margin-bottom: 1.75rem;
  font-size: 1.2rem;
  font-weight: 700;
  border-bottom: 2px solid #000000;
  padding-bottom: 0.75rem;
}

.tip-item {
  padding: 1.25rem 0;
  border-bottom: 1px solid #f5f5f5;
  color: #333333;
  font-size: 0.9rem;
  line-height: 1.5;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 1rem;
}

.tip-item::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #000000;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.tip-item:hover {
  color: #000000;
  transform: translateX(5px);
}

.tip-item:hover::before {
  transform: translateX(3px);
}

.tip-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.tip-item strong {
  color: #000000;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .form-container {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  
  .form-tips {
    position: static;
  }
}

@media (max-width: 768px) {
  .nav-header .container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-title h1 {
    font-size: 1.3rem;
  }
  
  .sheet-form {
    padding: 2rem 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .sheet-form {
    padding: 1.5rem 1rem;
    border-radius: 12px;
  }
  
  .file-upload-area {
    padding: 2rem 1rem;
  }
  
  .upload-icon {
    font-size: 2.5rem;
  }
  
  .form-section h2 {
    font-size: 1.25rem;
  }
  
  .container {
    padding: 1.5rem 0;
  }
}

/* Scroll animations */
@media (prefers-reduced-motion: no-preference) {
  .form-section {
    view-timeline: --section;
    animation: sectionReveal linear both;
    animation-timeline: --section;
    animation-range: entry 25% cover 40%;
  }
}
</style>