
import SuperadminTaskEdit from '@/views/superadmin/task/edit.vue';
import SuperadminTaskCreate from '@/views/superadmin/task/create.vue';
import SuperadminTaskView from '@/views/superadmin/task/view.vue';
import superadminGuard from '@/middleware/superadmin';

const taskRoutes = [
  {
    path: '/superadmin/tasks/view/:userid?',
    name: 'superadmin-task-view',
    component: SuperadminTaskView,
  },
  {
    path: '/superadmin/task/create/:userid?',
    name: 'superadmin-task-create',
    component: SuperadminTaskCreate,
  },
  {
    path: '/superadmin/task/edit/:id',
    name: 'superadmin-task-edit',
    component: SuperadminTaskEdit,
  },
];

export default taskRoutes;