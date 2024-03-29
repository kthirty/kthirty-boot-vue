import { request } from "@/utils/service"
import type * as Login from "./types/login"
import { MenusResponseData } from "./types/login"

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "sys/auth/code",
    method: "get"
  })
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "sys/auth/token",
    method: "post",
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "sys/auth/info",
    method: "get"
  })
}

/**
 * 获取用户可用菜单
 */
export function getUserMenus() {
  return request<Login.MenusResponseData>({
    url: "sys/auth/menus",
    method: "get"
  })
}
