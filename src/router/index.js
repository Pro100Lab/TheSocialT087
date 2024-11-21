import { createRouter, createWebHistory } from 'vue-router'
import EBank from "@/views/EBank";
import StyleBank from "@/views/StyleBank";
import SMS from "@/views/SMS";
import TheMonopoly from "@/views/TheMonopoly";
import ConsentService from "@/views/ConsentService";

const routes = [
  {
    path: '/',
    name: '',
    component: EBank
  },
  {
    path: '/e-bank',
    name: 'e-bank',
    component: EBank
  },
  {
    path: '/style-bank',
    name: 'style-bank',
    component: StyleBank
  },
  {
    path: '/sms',
    name: 'sms',
    component: SMS
  },
  {
    path: '/monopoly',
    name: 'monopoly',
    component: TheMonopoly
  }, {
  path: '/consents',
    name: 'consents',
    component: ConsentService
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
