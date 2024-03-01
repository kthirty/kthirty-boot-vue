import { request } from "@/utils/service"

export function queryHasMenus(id: string) {
  return request({ url: "/sys/role/menus/" + id })
}

export function saveConfigMenus(roleId: string, menus: Array<string>) {
  return request({ method: "post", url: "/sys/role/configMenus", data: { roleId: roleId, menus: menus } })
}
