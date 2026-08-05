const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
  },

  {
    path: '/register',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'register',
        component: () => import('pages/RegistrationPage.vue'),
      },
    ],
  },

  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
    { path: '', name: 'home', component: () => import('../components/HomePage.vue') },
    ],
  },

  {
    path: '/students',
    component: () => import('layouts/MainLayout.vue'),
    children: [
    { path: '', name: 'students', component: () => import('../components/StudentList.vue') },
    ],
  },

    {
    path: '/profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [
    { path: '', name: 'profile', component: () => import('../components/ParentProfile.vue') },
    ],
  },

  // Catch-all fallback route (Keep at the very bottom)
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
