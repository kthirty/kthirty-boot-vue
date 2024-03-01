import { request } from "@/utils/service"

export function queryAllMenus() {
  return request({ url: "/sys/menu/list" })
}
