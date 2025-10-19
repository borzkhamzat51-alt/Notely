<template>
  <div class="app-container">
    <!-- Navbar -->
    <header class="navbar">
      <div class="navbar-logo">
        🎵 <span>Musical Sheets</span>
      </div>

      <nav class="navbar-links">
        <RouterLink to="/" exact-active-class="active">Home</RouterLink>
        <RouterLink to="/sheets" exact-active-class="active">Sheets</RouterLink>
        <RouterLink to="/sheets/create" exact-active-class="active">Create</RouterLink>
        <RouterLink to="/login" exact-active-class="active">Login</RouterLink>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="main-view">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2025 Musical Sheets. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
/* --- General Layout --- */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea, #764ba2, #5b86e5);
  background-size: 200% 200%;
  animation: gradientShift 10s ease infinite;
  font-family: 'Inter', 'Poppins', sans-serif;
  color: #222;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* --- Navbar --- */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  padding: 1rem 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-logo {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
}

.navbar-links a {
  text-decoration: none;
  color: #444;
  font-weight: 500;
  transition: color 0.3s, transform 0.2s;
}

.navbar-links a:hover {
  color: #667eea;
  transform: translateY(-1px);
}

.navbar-links .active {
  color: #667eea;
  font-weight: 600;
  border-bottom: 2px solid #667eea;
  padding-bottom: 2px;
}

/* --- Main View --- */
.main-view {
  flex: 1;
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
}

.main-view:hover {
  transform: translateY(-3px);
}

/* --- Footer --- */
.footer {
  text-align: center;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  background: transparent;
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 0.75rem;
  }

  .navbar-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .main-view {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
