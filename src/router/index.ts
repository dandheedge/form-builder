import { createRouter, createRoute } from '@kitbag/router'
import BuilderView from '@/views/BuilderView.vue'
import FormView from '@/views/FormView.vue'

export const routes = [
  createRoute({
    name: 'builder',
    path: '/',
    component: BuilderView,
  }),
  createRoute({
    name: 'form',
    path: '/form',
    component: FormView,
  }),
] as const

export const router = createRouter(routes)

