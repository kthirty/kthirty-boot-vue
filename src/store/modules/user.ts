import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import { resetRouter } from "@/router"
import { getUserInfoApi, loginApi, getCurrentUserMenus } from "@/api/login"
import { type LoginRequestData, MenuInfo, TokenInfo, UserInfo } from "@/api/login/types/login"
import { getToken, removeToken, setToken } from "@/utils/cache/local-storage"

export const useUserStore = defineStore("user", () => {
  const token = ref<TokenInfo>(getToken() || {})
  const user = ref<UserInfo>()
  const menus = ref<MenuInfo>()

  const tagsViewStore = useTagsViewStore()
  const settingsStore = useSettingsStore()

  /** 登录 */
  const login = async ({ username, password, code }: LoginRequestData) => {
    const { data } = await loginApi({ username, password, code })
    setToken(data)
    token.value = data
  }
  /** 获取用户详情 */
  const getInfo = async () => {
    const { data } = await getUserInfoApi()
    user.value = data
  }
  /** 获取用户菜单并添加到路由中 */
  const regMenus = async () => {
    const { data } = await getCurrentUserMenus()
    if (!data || data.length <= 0) {
      throw new Error("当前用户不存在任何菜单")
    }
    console.log("regMenus", data)
  }

  const isInit = async () => {
    return user.value && menus.value
  }
  /** 登出 */
  const logout = () => {
    resetToken()
    resetRouter()
    _resetTagsView()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = {}
    // roles.value = []
  }
  /** 重置 Visited Views 和 Cached Views */
  const _resetTagsView = () => {
    if (!settingsStore.cacheTagsView) {
      tagsViewStore.delAllVisitedViews()
      tagsViewStore.delAllCachedViews()
    }
  }

  return { token, user, login, getInfo, regMenus, logout, resetToken, isInit }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
