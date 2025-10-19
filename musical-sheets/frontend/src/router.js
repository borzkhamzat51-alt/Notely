import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import SheetsList from './views/SheetsList.vue';
import SheetDetail from './views/SheetDetail.vue';
import SheetForm from './views/SheetForm.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';

const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: Home 
  },
  { 
    path: '/sheets', 
    name: 'SheetsList',
    component: SheetsList 
  },
  { 
    path: '/sheets/create', 
    name: 'SheetCreate',
    component: SheetForm 
  },
  { 
    path: '/sheets/:id/edit', 
    name: 'SheetEdit',
    component: SheetForm,
    props: true
  },
  { 
    path: '/sheets/:id', 
    name: 'SheetDetail',
    component: SheetDetail, 
    props: true 
  },
  { 
    path: '/login', 
    name: 'Login',
    component: Login 
  },
  { 
    path: '/register', 
    name: 'Register',
    component: Register 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;