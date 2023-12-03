export interface LoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor"
  /** 密码 */
  password: string
  /** 验证码 */
  code: string
}

export interface TokenInfo {
  accessToken?: string
  refreshToken?: string
  expiresIn?: number
  license?: string
}
export interface UserInfo {
  id?: string
  username?: string
  realName?: number
  orgCode?: string
  roles: string[]
  permissions?: string[]
  extra?: {}
}

export type LoginCodeResponseData = ApiResponseData<string>

export type LoginResponseData = ApiResponseData<TokenInfo>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>
