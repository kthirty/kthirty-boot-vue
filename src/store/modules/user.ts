import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { useTagsViewStore } from "./tags-view"
import { useSettingsStore } from "./settings"
import { resetRouter } from "@/router"
import { getUserInfoApi, getUserMenus, loginApi } from "@/api/login"
import { type LoginRequestData, MenuInfo, TokenInfo, UserInfo } from "@/api/login/types/login"
// import routeSettings from "@/config/route"
import { getToken, removeToken, setToken } from "@/utils/cache/local-storage"

export const useUserStore = defineStore("user", () => {
  const token = ref<TokenInfo>(getToken() || {})
  const user = ref<UserInfo>(getToken() || {})

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

  return { token, user, login, getInfo, logout, resetToken }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
