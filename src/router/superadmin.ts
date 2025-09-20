import SuperadminView from '@/views/superadmin/index.vue';

import SuperAdminViewUsers from '@/views/superadmin/viewusers.vue';

import superadminGuard from '../middleware/superadmin';

import taskRoutes from './superadmin/task';




const rawRoutes = [
  {
    path: '/superadmin',
    name: 'superadmin',
    component: SuperadminView,
  },

  {
    path: '/superadmin/viewuser',
    name: 'super-view-user',
    component: SuperAdminViewUsers,
  },

  ...taskRoutes,

];

const superadminRoutes = rawRoutes.map(route => ({
  ...route,
  beforeEnter: superadminGuard,
  meta: { layout: 'SuperadminLayout' },
}));

export default superadminRoutes;

