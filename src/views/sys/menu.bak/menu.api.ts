import { request } from "@/utils/service"

export interface Menu {
  title?: string
  name?: string
}

export function getPage(params: any) {
  return request<ApiResponsePageData<Menu>>({
    url: "/menu/page",
    method: "get",
    params
  })
}
