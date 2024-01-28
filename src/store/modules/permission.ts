import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { type RouteRecordRaw } from "vue-router"
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
  console.debug("module", module)
  /**
   * 菜单转route
   * @param menus 所有菜单
   * @param parentId 父ID
   * @return RouteRecordRaw[]
   */
  const menuToRoute = (menus: MenuInfo[], parentId: string): RouteRecordRaw[] => {
    return menus
      .filter((it) => it.parentId === parentId && it.path)
      .map((it) => {
        const child = menuToRoute(menus, it.id)
        const route: RouteRecordRaw = {
          path: it.path,
          component: () => module[it.component || "/layouts/index.vue"](),
          name: it.code,
          meta: getRouteMeta(it),
          children: child.length > 0 ? child : undefined
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
    console.log("拥有的权限", permissions.value)
    const accessedRoutes = menuToRoute(data, "0")
    const rootRouter: RouteRecordRaw[] = []
    if (!data.some((it) => it.path === "/")) {
      rootRouter.push(...getRootRouter(accessedRoutes))
    }
    dynamicRoutes.value = routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes
    routes.value = constantRoutes.concat(demoRoutes).concat(accessedRoutes).concat(rootRouter).concat(errorPageRouter)
    resetRouter()
    routes.value.forEach((it) => router.addRoute(it))
    console.log("加载路由，所有路由", routes.value)
  }
  const routeLoaded = () => menus.value.length > 0

  return { routes, dynamicRoutes, loadRoute, routeLoaded, permissions }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
