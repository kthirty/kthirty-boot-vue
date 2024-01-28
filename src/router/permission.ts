import router from "@/router"
import { useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import { setRouteChange } from "@/hooks/useRouteListener"
import { useTitle } from "@/hooks/useTitle"
import { fixBlankPage } from "@/utils/fix-blank-page"
import isWhiteList from "@/config/white-list"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

const { setTitle } = useTitle()
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  fixBlankPage()
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const token = userStore.token.accessToken
  // 判断该用户是否已经登录
  if (!token) {
    // 如果在免登录的白名单中，则直接进入
    if (isWhiteList(to)) {
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面
      NProgress.done()
      next("/login")
    }
    return
  }

  // 如果已经登录，并准备进入 Login 页面，则重定向到主页
  if (to.path === "/login") {
    NProgress.done()
    return next({ path: "/" })
  }

  // 如果已经加载过路由，则直接跳过
  if (permissionStore.routeLoaded()) return next()

  // 否则要重新获取权限角色
  try {
    await permissionStore.loadRoute()
    // 设置 replace: true, 因此导航将不会留下历史记录
    next({ ...to, replace: true })
  } catch (err: any) {
    // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
    userStore.resetToken()
    ElMessage.error(err.message || "路由守卫过程发生错误")
    NProgress.done()
    next("/login")
  }
})

router.afterEach((to) => {
  setRouteChange(to)
  setTitle(to.meta.title)
  NProgress.done()
})
