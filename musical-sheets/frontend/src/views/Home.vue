<template>
  <div class="home-page">
    <!-- Navigation Header -->
    <div class="nav-header" :class="{ 'scrolled': isScrolled }">
      <div class="container">
        <div class="header-actions">
          <button class="action-btn secondary" @click="$router.push('/login')">
            <span class="action-icon">🔐</span>
            <span class="action-text">Login</span>
          </button>
          <button class="action-btn primary" @click="$router.push('/sheets')">
            <span class="action-icon">🎼</span>
            <span class="action-text">Browse Sheets</span>
          </button>
        </div>
        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{ 'active': mobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <!-- Mobile Menu -->
      <div class="mobile-menu" :class="{ 'active': mobileMenuOpen }">
        <button class="mobile-menu-item" @click="$router.push('/login')">
          <span class="action-icon">🔐</span>
          Login
        </button>
        <button class="mobile-menu-item" @click="$router.push('/sheets')">
          <span class="action-icon">🎼</span>
          Browse Sheets
        </button>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text" ref="heroText">
            <h1 class="hero-title">
              <span class="music-notes">🎵</span>
              Your Digital Sheet Music Library
            </h1>
            <p class="hero-description">
              Discover, upload, and share beautiful sheet music. From classical masterpieces 
              to contemporary compositions, find the perfect piece for your instrument.
            </p>
            <div class="hero-actions">
              <button class="btn-hero primary" @click="$router.push('/sheets')">
                <span class="btn-icon">🎹</span>
                <span class="btn-text">Explore Library</span>
              </button>
              <button class="btn-hero secondary" @click="$router.push('/sheets/create')">
                <span class="btn-icon">📤</span>
                <span class="btn-text">Upload Sheet</span>
              </button>
            </div>
          </div>
          <div class="hero-visual" ref="heroVisual">
            <div class="music-card">
              <div class="staff-preview">
                <div class="staff-lines">
                  <div class="line"></div>
                  <div class="line"></div>
                  <div class="line"></div>
                  <div class="line"></div>
                  <div class="line"></div>
                </div>
                <div class="notes">
                  <span class="note" v-for="(note, index) in animatedNotes" :key="index" 
                        :style="getNoteStyle(index)" :class="`note-${index}`">
                    {{ note.symbol }}
                  </span>
                </div>
              </div>
              <div class="card-title">Moonlight Sonata</div>
              <div class="card-composer">L. van Beethoven</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Animated Background Elements -->
      <div class="hero-bg-elements">
        <div class="bg-note" v-for="n in 8" :key="n" :style="getBgNoteStyle(n)">♪</div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" ref="featuresSection">
      <div class="container">
        <div class="section-header" ref="sectionHeader">
          <h2>Why Choose Our Platform</h2>
          <p>Everything you need for your musical journey</p>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index" 
               :ref="`featureCard${index}`" :style="{ '--delay': index * 0.1 + 's' }">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section" ref="statsSection">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" v-for="(stat, index) in stats" :key="index" 
               :ref="`statItem${index}`">
            <div class="stat-number" :data-target="stat.value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" ref="ctaSection">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Start Your Musical Journey?</h2>
          <p>Join thousands of musicians who trust our platform for their sheet music needs.</p>
          <button class="btn-cta" @click="$router.push('/sheets')">
            <span class="btn-icon">🎵</span>
            <span class="btn-text">Get Started Today</span>
            <div class="btn-sparkle">✨</div>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      isScrolled: false,
      mobileMenuOpen: false,
      animatedNotes: [
        { symbol: '♩', x: 0, y: 0, delay: 0 },
        { symbol: '♪', x: 0, y: 0, delay: 0.2 },
        { symbol: '♫', x: 0, y: 0, delay: 0.4 },
        { symbol: '♬', x: 0, y: 0, delay: 0.6 }
      ],
      features: [
        {
          icon: '📚',
          title: 'Extensive Library',
          description: 'Access thousands of sheet music pieces across all genres and difficulty levels.'
        },
        {
          icon: '🎨',
          title: 'Beautiful Notation',
          description: 'Crisp, professional sheet music display with accurate musical notation.'
        },
        {
          icon: '⚡',
          title: 'Fast & Responsive',
          description: 'Lightning-fast loading and seamless experience across all devices.'
        },
        {
          icon: '🔍',
          title: 'Smart Search',
          description: 'Find exactly what you need with advanced filtering and search capabilities.'
        }
      ],
      stats: [
        { value: '10,000+', label: 'Sheet Music Pieces' },
        { value: '50+', label: 'Instruments' },
        { value: '500+', label: 'Composers' },
        { value: '5,000+', label: 'Active Musicians' }
      ],
      animationPlayed: {
        hero: false,
        features: false,
        stats: false,
        cta: false
      }
    }
  },
  mounted() {
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll);
    
    // Set up intersection observers for animations
    this.setupIntersectionObservers();
    
    // Start note animation
    this.startNoteAnimation();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    
    getNoteStyle(index) {
      return {
        'animation-delay': `${index * 0.2}s`
      };
    },
    
    getBgNoteStyle(index) {
      const size = 20 + Math.random() * 30;
      const opacity = 0.1 + Math.random() * 0.2;
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 5;
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        opacity: opacity,
        'animation-delay': `${animationDelay}s`
      };
    },
    
    startNoteAnimation() {
      // Notes will animate via CSS, this is just for initialization
    },
    
    setupIntersectionObservers() {
      const options = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      };
      
      // Hero section observer
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animationPlayed.hero) {
            this.animationPlayed.hero = true;
            entry.target.classList.add('animate-in');
          }
        });
      }, options);
      
      if (this.$refs.heroText) heroObserver.observe(this.$refs.heroText);
      if (this.$refs.heroVisual) heroObserver.observe(this.$refs.heroVisual);
      
      // Features section observer
      const featuresObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animationPlayed.features) {
            this.animationPlayed.features = true;
            entry.target.classList.add('animate-in');
            
            // Animate feature cards
            this.features.forEach((_, index) => {
              const card = this.$refs[`featureCard${index}`];
              if (card && card[0]) {
                setTimeout(() => {
                  card[0].classList.add('animate-in');
                }, index * 150);
              }
            });
          }
        });
      }, options);
      
      if (this.$refs.featuresSection) featuresObserver.observe(this.$refs.featuresSection);
      
      // Stats section observer
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animationPlayed.stats) {
            this.animationPlayed.stats = true;
            entry.target.classList.add('animate-in');
            
            // Animate stats
            this.stats.forEach((_, index) => {
              const stat = this.$refs[`statItem${index}`];
              if (stat && stat[0]) {
                setTimeout(() => {
                  stat[0].classList.add('animate-in');
                }, index * 200);
              }
            });
          }
        });
      }, options);
      
      if (this.$refs.statsSection) statsObserver.observe(this.$refs.statsSection);
      
      // CTA section observer
      const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animationPlayed.cta) {
            this.animationPlayed.cta = true;
            entry.target.classList.add('animate-in');
          }
        });
      }, options);
      
      if (this.$refs.ctaSection) ctaObserver.observe(this.$refs.ctaSection);
    }
  }
}
</script>

<style scoped>
/* Hide scrollbars but keep scrolling functionality */
::-webkit-scrollbar {
  display: none;
}

* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.home-page {
  min-height: 100vh;
  background: #ffffff;
  overflow-x: hidden;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  animation: pageReveal 1s ease-out;
  color: #000000;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

@keyframes pageReveal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Navigation Header */
.nav-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.25rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.nav-header.scrolled {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(30px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
  padding: 0.75rem 0;
  border-bottom-color: rgba(0, 0, 0, 0.05);
}

.nav-header .container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: -0.2px;
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

.action-btn.primary {
  background: #000000;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.action-btn.primary:hover {
  background: #333333;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.action-btn.secondary {
  background: transparent;
  color: #000000;
  border: 2px solid #000000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn.secondary:hover {
  background: #000000;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Mobile Menu */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  gap: 0.3rem;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.mobile-menu-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.mobile-menu-btn span {
  width: 24px;
  height: 2px;
  background: #000000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-20px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu.active {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 1rem;
  font-weight: 500;
  color: #000000;
}

.mobile-menu-item:hover {
  background: rgba(0, 0, 0, 0.03);
  transform: translateX(8px);
}

/* Hero Section */
.hero-section {
  padding: 10rem 0 6rem;
  background: #ffffff;
  color: #000000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  animation: heroReveal 1.2s ease-out 0.3s both;
}

@keyframes heroReveal {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
}

.hero-text {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.hero-text.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  color: #000000;
  letter-spacing: -1px;
}

.music-notes {
  font-size: 4rem;
  margin-right: 1rem;
  opacity: 0.9;
  display: inline-block;
  animation: float 4s ease-in-out infinite;
  filter: grayscale(100%);
}

.hero-description {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  color: #666666;
  line-height: 1.7;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s;
  font-weight: 400;
}

.hero-text.animate-in .hero-description {
  opacity: 1;
  transform: translateY(0);
}

.hero-actions {
  display: flex;
  gap: 1.25rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.4s;
}

.hero-text.animate-in .hero-actions {
  opacity: 1;
  transform: translateY(0);
}

.btn-hero {
  border: none;
  padding: 1.25rem 2.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: -0.2px;
}

.btn-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
  transition: left 0.6s ease;
}

.btn-hero:hover::before {
  left: 100%;
}

.btn-hero.primary {
  background: #000000;
  color: #ffffff;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.btn-hero.primary:hover {
  background: #333333;
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.btn-hero.secondary {
  background: transparent;
  color: #000000;
  border: 2px solid #000000;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-hero.secondary:hover {
  background: #000000;
  color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

.hero-visual {
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateX(40px) rotate(5deg);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.3s;
}

.hero-visual.animate-in {
  opacity: 1;
  transform: translateX(0) rotate(0);
}

.music-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  color: #000000;
  text-align: center;
  max-width: 320px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.music-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #000000, #333333, #666666, #333333, #000000);
  background-size: 200% 100%;
  animation: shimmer 3s infinite linear;
}

.music-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.08);
}

.staff-preview {
  height: 140px;
  background: #f8f8f8;
  border-radius: 12px;
  margin-bottom: 2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
  padding: 2.5rem;
}

.line {
  height: 1px;
  background: #000000;
  opacity: 0.3;
  transform-origin: left;
  animation: lineDraw 2s ease-out forwards;
}

@keyframes lineDraw {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.notes {
  display: flex;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
}

.note {
  font-size: 2.5rem;
  color: #000000;
  opacity: 0.9;
  animation: noteBounce 3s ease-in-out infinite;
  transform-origin: bottom;
  filter: grayscale(100%);
}

@keyframes noteBounce {
  0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
  25% { transform: translateY(-12px) scale(1.1) rotate(5deg); }
  50% { transform: translateY(0) scale(1) rotate(0deg); }
  75% { transform: translateY(-8px) scale(1.05) rotate(-5deg); }
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #000000;
  letter-spacing: -0.3px;
}

.card-composer {
  color: #666666;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Animated Background Elements */
.hero-bg-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-note {
  position: absolute;
  font-size: 1.8rem;
  color: #000000;
  opacity: 0.05;
  animation: floatBg 12s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: grayscale(100%);
  transition: all 0.5s ease;
}

.bg-note:hover {
  opacity: 0.1;
  transform: scale(1.2);
}

@keyframes floatBg {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  25% { 
    transform: translateY(-40px) rotate(90deg) scale(1.1);
  }
  50% { 
    transform: translateY(0px) rotate(180deg) scale(1);
  }
  75% { 
    transform: translateY(20px) rotate(270deg) scale(0.9);
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px); 
  }
  50% { 
    transform: translateY(-15px); 
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Features Section */
.features-section {
  padding: 6rem 0;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.features-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.features-section.animate-in .section-header {
  opacity: 1;
  transform: translateY(0);
}

.section-header h2 {
  font-size: 3rem;
  font-weight: 800;
  color: #000000;
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
}

.section-header p {
  font-size: 1.3rem;
  color: #666666;
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  text-align: center;
  padding: 3rem 2.5rem;
  border-radius: 20px;
  background: #f8f8f8;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  animation-delay: var(--delay);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.03), transparent);
  transition: left 0.6s ease;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.feature-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 
    0 25px 60px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(0, 0, 0, 0.08);
  background: #ffffff;
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  display: inline-block;
  animation: iconPulse 3s ease-in-out infinite;
  filter: grayscale(100%);
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(5deg); }
  75% { transform: scale(1.05) rotate(-5deg); }
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 1.5rem;
  letter-spacing: -0.3px;
}

.feature-card p {
  color: #666666;
  line-height: 1.7;
  font-size: 1.05rem;
  font-weight: 400;
}

/* Stats Section */
.stats-section {
  padding: 5rem 0;
  background: #f8f8f8;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  color: #000000;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.stats-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.stat-item {
  padding: 2.5rem 2rem;
  opacity: 0;
  transform: scale(0.8) rotate(-5deg);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.stat-item.animate-in {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #000000;
  position: relative;
  display: inline-block;
}

.stat-number::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #000000, #333333, #000000);
  transition: width 1s ease 0.5s;
  border-radius: 2px;
}

.stat-item.animate-in .stat-number::after {
  width: 80px;
}

.stat-label {
  font-size: 1.2rem;
  color: #666666;
  font-weight: 500;
  letter-spacing: -0.2px;
}

/* CTA Section */
.cta-section {
  padding: 6rem 0;
  background: #ffffff;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.cta-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.cta-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 3rem;
  font-weight: 800;
  color: #000000;
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
}

.cta-content p {
  font-size: 1.3rem;
  color: #666666;
  margin-bottom: 3rem;
  line-height: 1.6;
  font-weight: 400;
}

.btn-cta {
  background: #000000;
  color: #ffffff;
  border: none;
  padding: 1.5rem 3rem;
  border-radius: 14px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: -0.2px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.btn-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.btn-cta:hover::before {
  left: 100%;
}

.btn-cta:hover {
  background: #333333;
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.btn-sparkle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: all 0.4s ease;
  filter: grayscale(100%);
}

.btn-cta:hover .btn-sparkle {
  opacity: 1;
  animation: sparkle 1.5s ease-out;
}

@keyframes sparkle {
  0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
  50% { transform: translate(-50%, -50%) scale(2) rotate(180deg); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); opacity: 0; }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }
  
  .section-header h2 {
    font-size: 2.5rem;
  }
  
  .cta-content h2 {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .header-actions {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1.2rem;
  }
  
  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .section-header h2 {
    font-size: 2.2rem;
  }
  
  .cta-content h2 {
    font-size: 2.2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  .hero-section {
    padding: 8rem 0 4rem;
  }
  
  .features-section,
  .stats-section,
  .cta-section {
    padding: 4rem 0;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1.1rem;
  }
  
  .btn-hero, .btn-cta {
    width: 100%;
    justify-content: center;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .cta-content h2 {
    font-size: 2rem;
  }
  
  .feature-card {
    padding: 2.5rem 2rem;
  }
  
  .music-card {
    padding: 2rem;
    max-width: 280px;
  }
  
  .nav-header .container {
    padding: 0 1rem;
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
  .features-section,
  .stats-section,
  .cta-section {
    view-timeline: --section;
    animation: sectionReveal linear both;
    animation-timeline: --section;
    animation-range: entry 20% cover 30%;
  }
}

@keyframes sectionReveal {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>