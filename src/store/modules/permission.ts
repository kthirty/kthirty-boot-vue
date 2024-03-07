import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { type RouteRecordRaw, useRouter } from "vue-router"
import router, { constantRoutes, demoRoutes, errorPageRouter, resetRouter } from "@/router"
import { flatMultiLevelRoutes } from "@/router/helper"
import routeSettings from "@/config/route"
import { MenuInfo } from "@/api/login/types/login"
import { getUserMenus } from "@/api/login"
import Layout from "@/layouts/index.vue"

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([])
  const dynamicRoutes = ref<RouteRecordRaw[]>([])
  const menus = ref<MenuInfo[]>([])
  const permissions = ref<string[]>([])

  const module: Record<string, Function> = {}
  const views = import.meta.glob("../../views/**/*.vue")
  Object.keys(views).forEach((key) => {
    module[key.replace("../../views", "")] = views[key]
  })
  const layouts = import.meta.glob("../../layouts/index.vue")
  Object.keys(layouts).forEach((key) => {
    module[key.replace("../..", "")] = layouts[key]
  })
  /**
   * 菜单转route
   * @param menus 所有菜单
   * @param parentId 父ID
   * @return RouteRecordRaw[]
   */
  const menuToRoute = (menus: MenuInfo[], parentId: string): RouteRecordRaw[] => {
    return menus
      .filter((it) => it.parentId === parentId && it.path)
      .sort((it) => it.sort || 0)
      .map((it): RouteRecordRaw => {
        const child = menuToRoute(menus, it.id) || {}
        const moduleFunction =
          it.component && module[it.component] ? module[it.component]() : module["/layouts/index.vue"]()
        const route: RouteRecordRaw = {
          path: it.path,
          component: () => moduleFunction,
          name: it.code,
          meta: getRouteMeta(it),
          children: child && child.length > 0 ? child : undefined
        }
        if ((!it.component || it.component == "/layouts/index.vue") && child && child.length > 0) {
          route.redirect = child[0].path
        }
        return route
      })
  }
  const getRouteMeta = (it: MenuInfo) => {
    const res: any = {
      type: "async",
      title: it.name,
      keepAlive: true
    }
    // 菜单默认
    if (it.icon?.startsWith("el-")) {
      res.elIcon = it.icon.replace("el-", "")
    } else if (it.icon) {
      res.svgIcon = it.icon
    } else if (it.parentId === "0") {
      res.elIcon = "Menu"
    }
    return res
  }
  const getRootRouter = (accessedRoutes: RouteRecordRaw[]): RouteRecordRaw[] => {
    const arr: RouteRecordRaw[] = []
    if (accessedRoutes) {
      let path: string
      if (accessedRoutes[0].children) {
        path = accessedRoutes[0].children[0].path
      } else {
        path = accessedRoutes[0].path
      }
      if (path) {
        arr.push({
          path: "/",
          redirect: path
        })
      }
    }
    return arr
  }
  const loadRoute = async () => {
    if (menus.value.length > 0) {
      return
    }
    const { data } = await getUserMenus()
    if (data.length == 0) {
      throw new Error("当前用户没有任何可用菜单")
    }
    menus.value = data
    permissions.value = []
    data.filter((it) => it.permission).forEach((it) => permissions.value.push(it.permission || ""))
    const accessedRoutes = menuToRoute(data, "0")
    const rootRouter: RouteRecordRaw[] = []
    if (!data.some((it) => it.path === "/")) {
      rootRouter.push(...getRootRouter(accessedRoutes))
    }
    dynamicRoutes.value = routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes
    routes.value = [...constantRoutes, ...demoRoutes, ...accessedRoutes, ...rootRouter, ...errorPageRouter]
    resetRouter()
    routes.value.filter((it) => it.name).forEach((it) => router.addRoute(it))
    console.log("all permissions", permissions.value, "\n", "all routers", routes.value, "\n", "module", module)
  }
  const routeLoaded = () => menus.value.length > 0
  const hasPermission = (perm: string[] | string | undefined): boolean => {
    if (!perm) return true
    if (!Array.isArray(perm)) perm = [perm]
    const containsPerm = permissions.value.filter((it) => perm.includes(it))
    return containsPerm.length == perm.length
  }
  return { routes, dynamicRoutes, loadRoute, routeLoaded, permissions, hasPermission }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
