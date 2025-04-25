import { createRouter, createWebHistory } from 'vue-router'
import CalendarView from '../views/CalendarView.vue'
import BookingDetailView from '../views/BookingDetailView.vue'

const routes = [
  {
    path: '/',
    redirect: '/calendar',
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView,
    meta: {
      title: 'Booking Calendar - CamperDash',
    },
  },
  {
    path: '/station/:stationId/booking/:id',
    name: 'bookingDetail',
    component: BookingDetailView,
    props: true,
    meta: {
      title: 'Booking Details - CamperDash',
    },
  },
  {
    path: '/vehicles',
    name: 'vehicles',
    component: () => import('../views/PlaceholderView.vue'),
    meta: {
      title: 'Our Vehicles - CamperDash',
    },
  },
  {
    path: '/locations',
    name: 'locations',
    component: () => import('../views/PlaceholderView.vue'),
    meta: {
      title: 'Locations - CamperDash',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/PlaceholderView.vue'),
    meta: {
      title: 'About Us - CamperDash',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'CamperDash'
  next()
})

export default router
