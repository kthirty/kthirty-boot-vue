import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { type RouteRecordRaw } from "vue-router"
import router, { constantRoutes, resetRouter, errorPageRouter, demoRoutes } from "@/router"
import { flatMultiLevelRoutes } from "@/router/helper"
import routeSettings from "@/config/route"
import { MenuInfo } from "@/api/login/types/login"
import { getUserMenus } from "@/api/login"

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  const routeRoles = route.meta?.roles
  return routeRoles ? roles.some((role) => routeRoles.includes(role)) : true
}

const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const tempRoute = { ...route }
    if (hasPermission(roles, tempRoute)) {
      if (tempRoute.children) {
        tempRoute.children = filterAsyncRoutes(tempRoute.children, roles)
      }
      res.push(tempRoute)
    }
  })
  return res
}

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([])
  const dynamicRoutes = ref<RouteRecordRaw[]>([])
  const menus = ref<MenuInfo[]>([])

  const modules = import.meta.glob("../../views/*/*.vue")

  console.debug("modules", modules)
  /**
   * 菜单转route
   * @param menus 所有菜单
   * @param parentId 父ID
   * @return RouteRecordRaw[]
   */
  const menuToRoute = (menus: MenuInfo[], parentId: string): RouteRecordRaw[] => {
    return menus
      .filter((it) => it.parentId === parentId)
      .map((it) => {
        const route: RouteRecordRaw = {
          path: it.path,
          component: () => (it.component ? modules["../../views/" + it.component] : undefined),
          name: it.code,
          meta: {
            type: "async",
            title: it.name,
            svgIcon: it.icon || "menu"
          },
          children: menuToRoute(menus, it.id)
        }
        return route
      })
  }

  const loadRoute = async () => {
    if (menus.value.length > 0) {
      return
    }
    const { data } = await getUserMenus()
    if (data.length == 0) {
      throw new Error("当前用户没有任何可用菜单")
    }
    console.error("加载路由，查到的菜单", data)
    menus.value = data
    const accessedRoutes = menuToRoute(data, "0")
    dynamicRoutes.value = routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes
    console.error("加载路由，最终动态路由", dynamicRoutes.value)
    routes.value = constantRoutes.concat(demoRoutes).concat(accessedRoutes).concat(errorPageRouter)
    resetRouter()
    routes.value.forEach((it) => router.addRoute(it))
    console.error("加载路由，所有路由", routes.value)
  }
  const routeLoaded = () => menus.value.length > 0

  return { routes, dynamicRoutes, loadRoute, routeLoaded }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
