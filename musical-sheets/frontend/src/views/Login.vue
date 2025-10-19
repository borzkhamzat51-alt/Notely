<template>
  <div class="login-page">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="bg-element" v-for="n in 12" :key="n" :style="getBgElementStyle(n)">
        <span class="music-symbol">{{ getMusicSymbol(n) }}</span>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <div class="login-container">
        <!-- Login Card -->
        <div class="login-card" ref="loginCard">
          <!-- Header Section -->
          <div class="card-header">
            <div class="header-icon">
              <div class="icon-wrapper">
                <div class="rotating-icon">🎵</div>
              </div>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to access your music library and sheets</p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group" v-for="field in formFields" :key="field.id">
              <div class="label-row" v-if="field.id === 'password'">
                <label :for="field.id">{{ field.label }}</label>
                <a href="#" class="forgot">Forgot password?</a>
              </div>
              <label :for="field.id" v-else>{{ field.label }}</label>
              
              <div class="input-container">
                <span class="input-icon">{{ field.icon }}</span>
                <input
                  :id="field.id"
                  :type="field.type"
                  v-model="form[field.id]"
                  :placeholder="field.placeholder"
                  required
                  class="form-input"
                  :class="{ 'input-error': errors[field.id], 'input-valid': form[field.id] && !errors[field.id] }"
                  @focus="handleInputFocus(field.id)"
                  @blur="handleInputBlur(field.id)"
                />
                <button
                  v-if="field.id === 'password'"
                  type="button"
                  class="password-toggle"
                  @click="togglePasswordVisibility"
                  :class="{ 'active': showPassword }"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
              <transition name="slide-fade">
                <span v-if="errors[field.id]" class="error-message">{{ errors[field.id] }}</span>
              </transition>
            </div>

            <button
              type="submit"
              class="btn-primary login-button"
              :disabled="loading"
              :class="{ 'button-loading': loading, 'button-pulse': !loading && isFormValid }"
            >
              <span v-if="!loading" class="button-content">
                <span class="btn-text">Sign In</span>
                <span class="btn-arrow">→</span>
              </span>
              <div v-else class="loading-spinner"></div>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span>or continue with</span>
          </div>

          <!-- Social Login -->
          <div class="social-login">
            <button 
              type="button" 
              class="btn-social"
              v-for="provider in socialProviders" 
              :key="provider.name"
              @mouseenter="hoverSocial = provider.name"
              @mouseleave="hoverSocial = null"
            >
              <span class="social-icon" :class="{ 'bounce': hoverSocial === provider.name }">
                {{ provider.icon }}
              </span>
              <span class="social-text">Sign in with {{ provider.name }}</span>
            </button>
          </div>

          <!-- Sign Up Link -->
          <div class="signup-text">
            <p>Don't have an account? 
              <router-link to="/register" class="signup-link">
                Create one now
                <span class="link-arrow">→</span>
              </router-link>
            </p>
          </div>
        </div>

        <!-- Demo Credentials -->
        <div class="demo-credentials" ref="demoCard">
          <div class="demo-card">
            <h3>🎻 Demo Account</h3>
            <div class="demo-info">
              <p><strong>Email:</strong> demo@musicsheets.com</p>
              <p><strong>Password:</strong> demodemo</p>
            </div>
            <button class="btn-demo" @click="fillDemoCredentials">
              <span class="demo-icon">🎹</span>
              Use Demo Account
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Notification Toast -->
    <transition name="toast">
      <div v-if="notification.show" class="notification-toast" :class="notification.type">
        <span class="toast-icon">{{ notification.type === 'success' ? '✅' : '❌' }}</span>
        <span class="toast-message">{{ notification.message }}</span>
        <button class="toast-close" @click="notification.show = false">×</button>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const loading = ref(false)
    const showPassword = ref(false)
    const hoverSocial = ref(null)
    const loginCard = ref(null)
    const demoCard = ref(null)

    const form = reactive({
      email: '',
      password: ''
    })

    const errors = reactive({
      email: '',
      password: ''
    })

    const notification = reactive({
      show: false,
      message: '',
      type: 'success'
    })

    const formFields = [
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'Enter your email address',
        icon: '✉️'
      },
      {
        id: 'password',
        label: 'Password',
        type: computed(() => showPassword.value ? 'text' : 'password'),
        placeholder: 'Enter your password',
        icon: '🔒'
      }
    ]

    const socialProviders = [
      { name: 'Google', icon: '🎵' },
      { name: 'GitHub', icon: '🎹' }
    ]

    const isFormValid = computed(() => {
      return form.email && form.password && !errors.email && !errors.password
    })

    function validateForm() {
      errors.email = ''
      errors.password = ''
      let valid = true

      if (!form.email) {
        errors.email = 'Email is required.'
        valid = false
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = 'Please enter a valid email address.'
        valid = false
      }

      if (!form.password) {
        errors.password = 'Password is required.'
        valid = false
      } else if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters.'
        valid = false
      }

      return valid
    }

    function togglePasswordVisibility() {
      showPassword.value = !showPassword.value
    }

    function handleInputFocus(fieldId) {
      const input = document.getElementById(fieldId)
      if (input) {
        input.parentElement.classList.add('focused')
      }
    }

    function handleInputBlur(fieldId) {
      const input = document.getElementById(fieldId)
      if (input) {
        input.parentElement.classList.remove('focused')
      }
      validateForm()
    }

    function showToast(message, type = 'success') {
      notification.message = message
      notification.type = type
      notification.show = true
      
      setTimeout(() => {
        notification.show = false
      }, 4000)
    }

    async function handleLogin() {
      if (!validateForm()) return
      
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        localStorage.setItem('token', 'mock-jwt-token')
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          name: 'Demo User',
          email: form.email
        }))
        
        showToast('Login successful! Redirecting...', 'success')
        
        setTimeout(() => {
          router.push('/')
        }, 2000)
        
      } catch (err) {
        showToast('Login failed. Please check your credentials.', 'error')
      } finally {
        loading.value = false
      }
    }

    function fillDemoCredentials() {
      form.email = 'demo@musicsheets.com'
      form.password = 'demodemo'
      showToast('Demo credentials filled!', 'success')
    }

    function getBgElementStyle(index) {
      const size = 40 + Math.random() * 60
      const opacity = 0.03 + Math.random() * 0.07
      const left = Math.random() * 100
      const top = Math.random() * 100
      const animationDelay = Math.random() * 8
      const animationDuration = 15 + Math.random() * 15

      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
        opacity: opacity,
        'animation-delay': `${animationDelay}s`,
        'animation-duration': `${animationDuration}s`
      }
    }

    function getMusicSymbol(index) {
      const symbols = ['♪', '♫', '♬', '♩', '🎵', '🎶', '🎹', '🎼', '🎻', '🎺', '🎷', '🥁']
      return symbols[index % symbols.length]
    }

    onMounted(() => {
      setTimeout(() => {
        if (loginCard.value) loginCard.value.classList.add('animate-in')
      }, 100)
      
      setTimeout(() => {
        if (demoCard.value) demoCard.value.classList.add('animate-in')
      }, 300)
    })

    return {
      loading,
      showPassword,
      hoverSocial,
      form,
      errors,
      notification,
      formFields,
      socialProviders,
      isFormValid,
      loginCard,
      demoCard,
      togglePasswordVisibility,
      handleInputFocus,
      handleInputBlur,
      handleLogin,
      fillDemoCredentials,
      getBgElementStyle,
      getMusicSymbol,
      showToast
    }
  }
}
</script>

<style scoped>
/* === Base Styles === */
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  animation: pageFadeIn 0.8s ease-out;
}

@keyframes pageFadeIn {
  from {
    opacity: 0;
    background: #000000;
  }
  to {
    opacity: 1;
    background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  }
}

/* === Animated Background === */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.bg-element {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  animation: float 20s ease-in-out infinite;
  font-size: 1.5rem;
  filter: grayscale(100%);
  opacity: 0.1;
  transition: all 0.5s ease;
}

.bg-element:hover {
  opacity: 0.2;
  transform: scale(1.2);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  33% {
    transform: translateY(-30px) rotate(120deg) scale(1.1);
  }
  66% {
    transform: translateY(15px) rotate(240deg) scale(0.9);
  }
}

/* === Main Content === */
.main-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: contentSlideUp 1s ease-out 0.3s both;
}

@keyframes contentSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-container {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3rem;
  align-items: start;
  max-width: 1200px;
  width: 100%;
}

/* === Enhanced Login Card === */
.login-card {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  padding: 3.5rem;
  text-align: center;
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(10px);
}

.login-card::before {
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

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.login-card.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
  animation: cardGlow 2s ease-in-out 0.5s;
}

@keyframes cardGlow {
  0%, 100% { box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1); }
  50% { box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15); }
}

.login-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

/* === Header Section === */
.card-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: headerReveal 0.8s ease-out 0.6s both;
}

@keyframes headerReveal {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-icon {
  margin-bottom: 2rem;
}

.icon-wrapper {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #f8f8f8 0%, #ffffff 100%);
  border: 3px solid #000000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  margin: 0 auto;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.icon-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
  transition: left 0.6s ease;
}

.icon-wrapper:hover::before {
  left: 100%;
}

.icon-wrapper:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.rotating-icon {
  display: inline-block;
  animation: gentleRotate 8s ease-in-out infinite;
  filter: grayscale(100%);
}

@keyframes gentleRotate {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(5deg) scale(1.05); }
  50% { transform: rotate(0deg) scale(1); }
  75% { transform: rotate(-5deg) scale(1.05); }
}

.card-header h2 {
  font-size: 2.4rem;
  font-weight: 800;
  color: #000000;
  margin-bottom: 0.75rem;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-header p {
  color: #666666;
  font-size: 1.15rem;
  margin: 0;
  line-height: 1.6;
  font-weight: 400;
}

/* === Form Styles === */
.login-form {
  text-align: left;
  margin-bottom: 2.5rem;
  animation: formReveal 0.8s ease-out 0.8s both;
}

@keyframes formReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 1.75rem;
  position: relative;
}

.login-form label {
  font-size: 0.95rem;
  font-weight: 600;
  display: block;
  margin-bottom: 0.75rem;
  color: #000000;
  transition: all 0.3s ease;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.forgot {
  font-size: 0.85rem;
  color: #000000;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease;
}

.forgot::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #000000;
  transition: width 0.3s ease;
}

.forgot:hover::after {
  width: 100%;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-container.focused {
  transform: translateY(-2px);
}

.input-icon {
  position: absolute;
  left: 1.25rem;
  z-index: 1;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  filter: grayscale(100%);
}

.input-container.focused .input-icon {
  transform: scale(1.2) translateY(-1px);
}

.form-input {
  width: 100%;
  padding: 1.25rem 1.25rem 1.25rem 3.5rem;
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  font-size: 1rem;
  background: #fafafa;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 0;
  color: #000000;
  font-family: inherit;
  font-weight: 500;
}

.form-input::placeholder {
  color: #999999;
  font-weight: 400;
}

.form-input:focus {
  outline: none;
  border-color: #000000;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.form-input.input-valid {
  border-color: #000000;
  background: #f8f8f8;
}

.form-input.input-error {
  border-color: #8b0000;
  background: #fef2f2;
  animation: inputShake 0.5s ease-in-out;
}

@keyframes inputShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.password-toggle {
  position: absolute;
  right: 1.25rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.5rem;
  color: #666666;
  transition: all 0.3s ease;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.05);
}

.password-toggle:hover {
  color: #000000;
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.password-toggle.active {
  color: #000000;
  background: rgba(0, 0, 0, 0.15);
}

/* Error Message Animation */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.error-message {
  display: block;
  color: #8b0000;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  font-weight: 600;
  padding-left: 0.5rem;
  border-left: 2px solid #8b0000;
}

/* === Login Button === */
.login-button {
  width: 100%;
  padding: 1.25rem 2rem;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 1.5rem;
  min-height: 64px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.login-button:hover:not(:disabled)::before {
  left: 100%;
}

.login-button:hover:not(:disabled) {
  background: #1a1a1a;
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.login-button:active:not(:disabled) {
  transform: translateY(-1px);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.button-pulse {
  animation: gentlePulse 2s ease-in-out infinite;
}

@keyframes gentlePulse {
  0%, 100% { 
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  50% { 
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  }
}

.button-loading {
  pointer-events: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-arrow {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 300;
}

.login-button:hover:not(:disabled) .btn-arrow {
  transform: translateX(5px) scale(1.1);
}

.loading-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid transparent;
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* === Divider === */
.divider {
  margin: 2.5rem 0;
  font-size: 0.95rem;
  color: #888;
  text-align: center;
  position: relative;
  animation: dividerReveal 0.8s ease-out 1s both;
}

@keyframes dividerReveal {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.divider::before {
  content: "";
  position: absolute;
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
  top: 50%;
  left: 0;
}

.divider span {
  background: #ffffff;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
  font-weight: 500;
}

/* === Social Login === */
.social-login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
  animation: socialReveal 0.8s ease-out 1.1s both;
}

@keyframes socialReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn-social {
  border: 2px solid #e5e5e5;
  border-radius: 12px;
  background: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  color: #000000;
}

.btn-social::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
  transition: left 0.5s ease;
}

.btn-social:hover::before {
  left: 100%;
}

.btn-social:hover {
  border-color: #000000;
  background: #f8f8f8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.social-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  filter: grayscale(100%);
}

.social-icon.bounce {
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 20%, 60%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  80% { transform: translateY(-3px); }
}

/* === Sign Up Section === */
.signup-text {
  margin-top: 2rem;
  font-size: 0.95rem;
  color: #666;
  animation: signupReveal 0.8s ease-out 1.2s both;
}

@keyframes signupReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.signup-link {
  color: #000000;
  text-decoration: none;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.signup-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #000000;
  transition: width 0.4s ease;
}

.signup-link:hover {
  gap: 0.75rem;
}

.signup-link:hover::after {
  width: 100%;
}

.link-arrow {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 300;
}

.signup-link:hover .link-arrow {
  transform: translateX(4px) scale(1.1);
}

/* === Demo Credentials === */
.demo-credentials {
  margin-top: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.4s;
}

.demo-credentials.animate-in {
  opacity: 1;
  transform: translateY(0);
  animation: demoGlow 3s ease-in-out 1.5s infinite;
}

@keyframes demoGlow {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-5px) scale(1.02); }
}

.demo-card {
  background: linear-gradient(135deg, #f8f8f8 0%, #ffffff 100%);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e5e5;
  min-width: 300px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.demo-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #000000, #333333, #000000);
}

.demo-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.08);
}

.demo-card h3 {
  color: #000000;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
}

.demo-info p {
  margin: 1rem 0;
  color: #666666;
  font-size: 0.95rem;
  line-height: 1.5;
}

.demo-info strong {
  color: #000000;
  font-weight: 600;
}

.btn-demo {
  width: 100%;
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.btn-demo::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-demo:hover::before {
  left: 100%;
}

.btn-demo:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

/* === Notification Toast === */
.toast-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.notification-toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: #000000;
  color: #ffffff;
  padding: 1.25rem 1.75rem;
  border-radius: 14px;
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
  max-width: 400px;
  animation: toastSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification-toast.error {
  background: #8b0000;
}

.toast-icon {
  font-size: 1.3rem;
  filter: grayscale(100%) brightness(200%);
}

.toast-message {
  flex: 1;
  font-weight: 600;
  font-size: 0.95rem;
}

.toast-close {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

/* === Responsive Design === */
@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    max-width: 500px;
  }
  
  .demo-card {
    min-width: auto;
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1.5rem;
  }
  
  .login-card {
    padding: 2.5rem 2rem;
    border-radius: 20px;
  }
  
  .icon-wrapper {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
  
  .card-header h2 {
    font-size: 2.2rem;
  }
  
  .card-header p {
    font-size: 1.1rem;
  }
  
  .form-input {
    padding: 1.1rem 1.1rem 1.1rem 3.2rem;
  }
  
  .input-icon {
    left: 1.1rem;
  }
  
  .notification-toast {
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
  
  .icon-wrapper {
    width: 70px;
    height: 70px;
    font-size: 1.8rem;
  }
  
  .card-header h2 {
    font-size: 2rem;
  }
  
  .demo-card {
    padding: 2rem 1.5rem;
  }
  
  .social-login {
    gap: 0.8rem;
  }
  
  .btn-social {
    padding: 0.9rem;
  }
  
  .login-button {
    padding: 1.1rem 1.5rem;
    min-height: 58px;
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
  .login-card,
  .demo-credentials {
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