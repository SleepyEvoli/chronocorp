import {createRouter, createWebHashHistory} from 'vue-router';

import DashboardView from '../views/DashboardView.vue';
import TaskDetailView from '@/views/TaskDetailView.vue';
import TimerView from '@/views/TimerView.vue';
import TaskAssignmentView from '@/views/TaskAssignmentView.vue';
import SettingsView from '@/views/SettingsView.vue';

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: DashboardView,
    },
    {
        path: '/project/:projectId/tasks/:taskId',
        name: 'task-detail',
        component: TaskDetailView,
        props: true,
    },
    {
        path: '/timer',
        name: 'timer',
        component: TimerView,
    },
    {
        path: '/task-assignment',
        name: 'task-assignment',
        component: TaskAssignmentView,
    },
    {
        path: '/settings',
        name: 'settings',
        component: SettingsView,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
