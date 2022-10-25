import { createRouter, createWebHistory } from "vue-router";
import managerLayout from "../layout/managerLayout.vue";
import workerLayout from "@/layout/workerLayout";
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/manager",
    name: "managerLayout",
    component: managerLayout,
    children: [
      {
        path: "orderMeal",
        name: "orderMealManager",
        component: () => import("@/views/orderMeal"),
      },
      {
        path: "orderManage",
        name: "orderManageManager",
        component: () => import("@/views/orderManage"),
      },
      {
        path: "ingredientManage",
        name: "ingredientManage",
        component: () => import("@/views/ingredientManage"),
      },
      {
        path: "purchaseRecord",
        name: "purchaseRecord",
        component: () => import("@/views/purchaseRecord"),
      },
      {
        path: "userManage",
        name: "userManage",
        component: () => import("@/views/userManage"),
      },
      {
        path: "feeRecord",
        name: "feeRecord",
        component: () => import("@/views/feeRecord"),
      },
      {
        path: "cuisineManage",
        name: "cuisineManage",
        component: () => import("@/views/cuisineManage"),
      },
      {
        path: "addCuisine",
        name: "addCuisine",
        component: () => import("@/views/addCuisine"),
      },
    ],
  },
  {
    path: "/worker",
    name: "workerLayout",
    component: workerLayout,
    children: [
      {
        path: "orderMeal",
        name: "orderMealWorker",
        component: () => import("@/views/orderMeal"),
      },
      {
        path: "orderManage",
        name: "orderManageWorker",
        component: () => import("@/views/orderManage"),
      },
      {
        path: "ingredientReserves",
        name: "ingredientReserves",
        component: () => import("@/views/ingredientReserves"),
      },
      {
        path: "cuisineDetails",
        name: "cuisineDetails",
        component: () => import("@/views/cuisineDetails"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/userLogin"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
