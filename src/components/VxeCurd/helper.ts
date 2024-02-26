import { VxeFormItemProps } from "vxe-table/types/form-item"
import { Ref, Slot } from "vue"
import { VxeGridInstance, VxeGridProps } from "vxe-table"
import { Api, CrudItem, VxeCrudOptions } from "@/components/VxeCurd/types"
import { get, set } from "lodash-es"
import { request } from "@/utils/service"

export const defaultSearchBtn: VxeFormItemProps = {
  itemRender: {
    name: "$buttons",
    children: [
      {
        props: { type: "submit", content: "查询", status: "primary" }
      },
      {
        props: { type: "reset", content: "重置" }
      }
    ]
  }
}
/** 新增后是否下一页 */
export const afterInsert = (xGridDom: Ref<VxeGridInstance | undefined>) => {
  const pager = xGridDom.value?.getProxyInfo()?.pager
  if (pager) {
    const currentTotal = pager.currentPage * pager.pageSize
    if (currentTotal === pager.total) {
      ++pager.currentPage
    }
  }
}
/** 删除后是否返回上一页 */
export const afterDelete = (xGridDom: Ref<VxeGridInstance | undefined>) => {
  const tableData = xGridDom.value!.getData()
  const pager = xGridDom.value?.getProxyInfo()?.pager
  if (pager && pager.currentPage > 1 && tableData.length === 1) {
    --pager.currentPage
  }
}

export const defaultRender: Map<String, Object> = new Map<String, Object>()
defaultRender.set("input", { itemRender: { name: "$input", props: { placeholder: "请输入" } } })

function handleExtra(info: string | Function | Object | undefined): any {
  const type = typeof info
  if (!info) {
    return {}
  }
  switch (type) {
    case "string":
      return defaultRender.get(info.toString())
    case "object":
      return info
    case "function":
      return (info as Function)()
    default:
      return {}
  }
}

export function initGridOpt(
  opt: VxeCrudOptions | CrudItem[],
  api: Api,
  solts: Record<string, Function | undefined>
): VxeGridProps | void {
  if (Array.isArray(opt)) {
    const defaultOpt = getDefaultGridOpt(solts, undefined, api)
    const searchItem = opt.map((it) => {
      return { field: it.field, title: it.title, ...handleExtra(it.search) }
    })
    const columns = opt.map((it) => {
      return { field: it.field, title: it.title, ...handleExtra(it.column) }
    })
    const formItems = opt.map((it) => {
      return { field: it.field, title: it.title, ...handleExtra(it.form) }
    })
  } else {
    return getDefaultGridOpt(solts, opt?.grid, api)
  }
}

function getDefaultGridOpt(solts: Record<string, Function | undefined>, grid: VxeGridProps | undefined, api: Api) {
  const gridConfig = grid || {}
  set(gridConfig, "pagerConfig", {})
  gridConfig?.formConfig?.items?.push(defaultSearchBtn)
  solts["toolbar-btns"] && set(gridConfig, "toolbarConfig.slots.buttons", "toolbar-btns")
  const defaultActionSlot = { title: "操作", slots: { default: "action" } }
  solts["action"] && set(gridConfig, "columns", [...get(gridConfig, "columns", []), defaultActionSlot])
  const queryFunc = ({ page, form }: { page: any; form: any }) => {
    return new Promise((resolve) => {
      request({ url: api.query, method: "GET", params: { ...page, ...form } })
        .then((res: any) => resolve(res.data))
        .catch((err: Error) => console.error("loading error", err))
    })
  }
  set(gridConfig, "proxyConfig.ajax.query", queryFunc)
  return gridConfig
}
