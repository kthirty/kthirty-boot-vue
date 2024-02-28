import { VxeFormItemProps } from "vxe-table/types/form-item"
import { Ref, Slot } from "vue"
import { VxeFormProps, VxeGridInstance, VxeGridProps, VxeModalProps } from "vxe-table"
import { Api, CrudItem, VxeCrudOptions } from "@/components/VxeCurd/types"
import { get, isEmpty, merge, set } from "lodash-es"
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

function handleExtra(info: string | Function | Object | undefined): any {
  const type = typeof info
  if (!info) {
    return {}
  }
  switch (type) {
    case "string":
      return { itemRender: { name: info } }
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
): VxeGridProps {
  if (Array.isArray(opt)) {
    const defaultOpt = getDefaultGridOpt(solts, undefined, api)
    const searchItem = opt
      .filter((it) => !!it.search)
      .map((it) => {
        return { field: it.field, title: it.title, ...handleExtra(it.search) }
      })
    const columns = opt
      .filter((it) => !!it.column)
      .map((it) => {
        return { field: it.field, title: it.title, ...handleExtra(it.column) }
      })
    columns.push({ title: "操作", slots: { default: "action" } })
    set(defaultOpt, "columns", columns)
    set(defaultOpt, "formConfig.items", searchItem)
    return defaultOpt
  } else {
    return getDefaultGridOpt(solts, opt?.grid, api)
  }
}

export function initFormOpt(
  opt: VxeCrudOptions | CrudItem[],
  solts: Record<string, Function | undefined>
): VxeFormProps {
  if (Array.isArray(opt)) {
    const formItems = opt
      .filter((it) => !!it.form)
      .map((it) => {
        return { field: it.field, title: it.title, ...handleExtra(it.form) }
      })
    formItems.push({ itemRender: {}, align: "right", slots: { default: "form-action" } })
    // 验证规则
    const rules = {}
    opt
      .filter((it) => !!it.formRules)
      .forEach((it) => set(rules, it.field + "", Array.isArray(it.formRules) ? it.formRules : [it.formRules]))
    return merge({
      span: 24,
      titleWidth: "100px",
      data: {},
      items: formItems,
      rules
    })
  } else {
    return merge(opt?.form || {}, {
      span: 24,
      titleWidth: "100px",
      data: {},
      items: [...(opt?.form?.items || []), { itemRender: {}, align: "right", slots: { default: "form-action" } }]
    })
  }
}

export function initModalOpt(opt: VxeCrudOptions | CrudItem[]): VxeModalProps {
  if (Array.isArray(opt)) {
    return {
      title: "操作",
      fullscreen: (opt?.length || 0) >= 10
    }
  } else {
    return merge(opt?.modal || {}, {
      title: "操作",
      fullscreen: (opt?.form?.items?.length || 0) >= 10
    })
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
