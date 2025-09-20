import type { NavigationGuard } from 'vue-router';
import { useAuthStore } from '../stores/authStore'; // 👈 this goes here

const superadminGuard: NavigationGuard = (to, from, next) => {
  const auth = useAuthStore();

  if (!auth.user) {
    return next('/login');
  }

  if (auth.user.level !== 'admin') {
    return next('/unauthorized');
  }

  next();
};

export default superadminGuard;


