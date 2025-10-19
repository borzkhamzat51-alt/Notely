<template>
  <div class="register-page">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="navbar-logo">
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <div class="register-container">
        <!-- Register Card -->
        <div class="register-card">
          <!-- Header Section -->
          <div class="register-header">
            <div class="form-group">
              <label for="username" class="form-label">Username *</label>
              <div class="input-container">
                <span class="input-icon">👤</span>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  required
                  placeholder="Choose a username"
                  class="form-input"
                  :class="{ 'input-error': errors.username }"
                />
              </div>
              <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
            </div>
            <div class="header-icon">
              <div class="icon-wrapper">
                🎵
              </div>
            </div>
            <h1 class="register-title">Create Account</h1>
            <p class="register-subtitle">Join our community of musicians</p>
          </div>

          <!-- Register Form -->
          <form @submit.prevent="registerUser" class="register-form">
            <div class="form-group">
              <label for="email" class="form-label">Email Address *</label>
              <div class="input-container">
                <span class="input-icon">✉️</span>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  class="form-input"
                  :class="{ 'input-error': errors.email }"
                />
              </div>
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password *</label>
              <div class="input-container">
                <span class="input-icon">🔒</span>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Create a password"
                  class="form-input"
                  :class="{ 'input-error': errors.password }"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              <div class="password-strength">
                <div class="strength-bar" :class="passwordStrength"></div>
                <small class="help-text">Use 8+ characters with letters and numbers</small>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm Password *</label>
              <div class="input-container">
                <span class="input-icon">🔒</span>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  placeholder="Confirm your password"
                  class="form-input"
                  :class="{ 'input-error': errors.confirmPassword }"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="form.agreeToTerms" 
                  class="checkbox"
                  :class="{ 'input-error': errors.agreeToTerms }"
                >
                <span class="checkmark"></span>
                I agree to the <a href="#" class="link">Terms of Service</a> and <a href="#" class="link">Privacy Policy</a>
              </label>
              <span v-if="errors.agreeToTerms" class="error-message">{{ errors.agreeToTerms }}</span>
            </div>

            <button
              type="submit"
              class="register-button"
              :disabled="loading"
              :class="{ 'button-loading': loading }"
            >
              <span v-if="!loading">Create Account</span>
              <div v-else class="loading-spinner"></div>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span class="divider-text">or sign up with</span>
          </div>

          <!-- Social Register -->
          <div class="social-register">
            <button type="button" class="social-button google-button">
              <span class="social-icon">🎵</span>
              Google
            </button>
            <button type="button" class="social-button github-button">
              <span class="social-icon">🎹</span>
              GitHub
            </button>
          </div>

          <!-- Login Link -->
          <div class="login-section">
            <p>Already have an account? 
              <router-link to="/login" class="login-link">Sign in here</router-link>
            </p>
          </div>
        </div>

        <!-- Benefits Section -->
        <div class="benefits-card">
          <h3>🎻 Join Musical Sheets</h3>
          <div class="benefits-list">
            <div class="benefit-item">
              <span class="benefit-icon">📚</span>
              <div class="benefit-text">
                <strong>Access Thousands of Sheets</strong>
                <p>Browse our extensive library of musical scores</p>
              </div>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">📤</span>
              <div class="benefit-text">
                <strong>Upload Your Own Sheets</strong>
                <p>Share your musical arrangements with the community</p>
              </div>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">💾</span>
              <div class="benefit-text">
                <strong>Save Your Favorites</strong>
                <p>Build your personal collection of sheet music</p>
              </div>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">👥</span>
              <div class="benefit-text">
                <strong>Join a Community</strong>
                <p>Connect with musicians worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  username: '', // ADD THIS LINE
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const errors = reactive({
  username: '', // ADD THIS LINE
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: ''
})

// Password strength calculator
const passwordStrength = computed(() => {
  if (!form.password) return 'empty'
  
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
  const mediumRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/
  
  if (strongRegex.test(form.password)) return 'strong'
  if (mediumRegex.test(form.password)) return 'medium'
  return 'weak'
})

function validateForm() {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Username validation - ADD THIS SECTION
  if (!form.username.trim()) {
    errors.username = 'Username is required'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    isValid = false
  }
  
  // Password validation
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  }
  
  // Confirm password validation
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  // Terms agreement validation
  if (!form.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions'
    isValid = false
  }
  
  return isValid
}

async function registerUser() {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const res = await axios.post('http://localhost:4000/api/auth/register', {
      username: form.username, // ADD THIS LINE
      email: form.email,
      password: form.password
    })
    
    showNotification('Account created successfully! Please log in.', 'success')
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (err) {
    const errorMessage = err.response?.data?.message || 'Error creating account'
    showNotification(errorMessage, 'error')
    
    // Set specific field errors if available
    if (err.response?.data?.errors) {
      Object.keys(err.response.data.errors).forEach(key => {
        if (errors[key] !== undefined) {
          errors[key] = err.response.data.errors[key]
        }
      })
    }
  } finally {
    loading.value = false
  }
}

function showNotification(message, type) {
  // In a real app, use a proper notification component
  alert(`${type === 'success' ? '✅' : '❌'} ${message}`)
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f8f8 0%, #e0e0e0 100%);
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.8s ease-out;
}

/* Navbar */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
  padding: 1rem 0;
  animation: slideDown 0.6s ease-out;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  transition: transform 0.3s ease;
}

.navbar-logo:hover {
  transform: translateY(-2px);
}

.logo-icon {
  font-size: 2rem;
  animation: bounce 2s infinite;
}

.logo-text {
  color: #000000;
  position: relative;
}

.logo-text::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #000000;
  transition: width 0.3s ease;
}

.navbar-logo:hover .logo-text::after {
  width: 100%;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: calc(100vh - 80px);
}

.register-container {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3rem;
  align-items: start;
  max-width: 1200px;
  width: 100%;
  animation: scaleIn 0.8s ease-out;
}

/* Register Card */
.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.register-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s;
}

.register-card:hover::before {
  left: 100%;
}

.register-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.2);
}

/* Header Section */
.register-header {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: slideInFromTop 0.6s ease-out;
}

.header-icon {
  margin-bottom: 1.5rem;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #000000, #333333);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: pulse 2s infinite;
  transition: transform 0.3s ease;
}

.icon-wrapper:hover {
  transform: scale(1.1);
}

.register-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #000000, #333333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-subtitle {
  color: #666666;
  font-size: 1.1rem;
  margin: 0;
}

/* Form Styles */
.register-form {
  margin-bottom: 2rem;
  animation: slideInFromBottom 0.8s ease-out;
}

.form-group {
  margin-bottom: 1.5rem;
  animation: fadeIn 0.6s ease-out;
}

.form-group:nth-child(1) { animation-delay: 0.1s; }
.form-group:nth-child(2) { animation-delay: 0.2s; }
.form-group:nth-child(3) { animation-delay: 0.3s; }
.form-group:nth-child(4) { animation-delay: 0.4s; }

.form-label {
  display: block;
  font-weight: 600;
  color: #000000;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  z-index: 1;
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.form-input:focus + .input-icon {
  transform: scale(1.2);
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  background: #f8f8f8;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.form-input:focus {
  outline: none;
  border-color: #000000;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.input-error {
  border-color: #ff4444;
  background: #fff5f5;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.25rem;
  color: #666666;
  transition: all 0.3s ease;
}

.password-toggle:hover {
  color: #000000;
  transform: scale(1.1);
}

.error-message {
  display: block;
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
  animation: shake 0.5s ease-in-out;
}

/* Password Strength */
.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
  animation: widthGrow 0.5s ease-out;
}

.strength-bar.empty {
  background: #e0e0e0;
  width: 0%;
}

.strength-bar.weak {
  background: #ff4444;
  width: 33%;
}

.strength-bar.medium {
  background: #ffaa00;
  width: 66%;
}

.strength-bar.strong {
  background: #00cc66;
  width: 100%;
}

.help-text {
  display: block;
  color: #666666;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 500;
  color: #333333;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.checkbox-label:hover {
  color: #000000;
}

.checkbox {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #c0c0c0;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.checkbox:checked + .checkmark {
  background: #000000;
  border-color: #000000;
  animation: checkmarkPop 0.3s ease;
}

.checkbox:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.link {
  color: #000000;
  text-decoration: none;
  font-weight: 600;
  position: relative;
}

.link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #000000;
  transition: width 0.3s ease;
}

.link:hover::after {
  width: 100%;
}

/* Register Button */
.register-button {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.register-button::after {
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

.register-button:active::after {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.button-loading {
  pointer-events: none;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid transparent;
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 2rem 0;
  animation: fadeIn 1s ease-out;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
}

.divider-text {
  background: white;
  padding: 0 1.5rem;
  color: #666666;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Social Register */
.social-register {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: fadeIn 1.2s ease-out;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  position: relative;
  overflow: hidden;
}

.social-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s;
}

.social-button:active::after {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
}

.social-button:hover {
  border-color: #000000;
  background: #f8f8f8;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.social-icon {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.social-button:hover .social-icon {
  transform: scale(1.2);
}

/* Login Section */
.login-section {
  text-align: center;
  color: #666666;
  font-size: 0.95rem;
  animation: fadeIn 1.4s ease-out;
}

.login-link {
  color: #000000;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
  position: relative;
}

.login-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #000000;
  transition: width 0.3s ease;
}

.login-link:hover::after {
  width: 100%;
}

/* Benefits Card */
.benefits-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: sticky;
  top: 2rem;
  animation: slideInFromRight 0.8s ease-out;
}

.benefits-card h3 {
  color: #000000;
  margin-bottom: 2rem;
  font-size: 1.4rem;
  text-align: center;
  position: relative;
}

.benefits-card h3::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background: #000000;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  animation: fadeIn 0.6s ease-out;
}

.benefit-item:nth-child(1) { animation-delay: 0.1s; }
.benefit-item:nth-child(2) { animation-delay: 0.2s; }
.benefit-item:nth-child(3) { animation-delay: 0.3s; }
.benefit-item:nth-child(4) { animation-delay: 0.4s; }

.benefit-item:hover {
  background: #f8f8f8;
  transform: translateX(5px);
}

.benefit-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
  transition: transform 0.3s ease;
}

.benefit-item:hover .benefit-icon {
  transform: scale(1.2);
}

.benefit-text strong {
  color: #000000;
  font-size: 0.95rem;
  display: block;
  margin-bottom: 0.25rem;
}

.benefit-text p {
  color: #666666;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideDown {
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
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

@keyframes slideInFromRight {
  from { 
    opacity: 0;
    transform: translateX(30px);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes widthGrow {
  from { width: 0; }
  to { width: inherit; }
}

@keyframes checkmarkPop {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .register-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 500px;
  }
  
  .benefits-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .register-card {
    padding: 2.5rem 2rem;
  }
  
  .icon-wrapper {
    width: 70px;
    height: 70px;
    font-size: 1.8rem;
  }
  
  .register-title {
    font-size: 2rem;
  }
  
  .social-register {
    grid-template-columns: 1fr;
  }
  
  .benefits-card {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 0.5rem;
  }
  
  .register-card {
    padding: 2rem 1.5rem;
  }
  
  .icon-wrapper {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .register-title {
    font-size: 1.8rem;
  }
  
  .form-input {
    padding: 0.9rem 0.9rem 0.9rem 2.8rem;
  }
  
  .input-icon {
    left: 0.9rem;
  }
  
  .benefits-card {
    padding: 1.5rem;
  }
  
  .benefit-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>