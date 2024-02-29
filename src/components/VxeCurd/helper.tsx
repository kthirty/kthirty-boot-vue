import { VxeFormItemProps, VxeFormItemPropTypes } from "vxe-table/types/form-item"
import { Ref } from "vue"
import { VxeFormProps, VxeGridInstance, VxeGridProps, VxeModalProps } from "vxe-table"
import { Api, CrudItem, VxeCrudOptions, VxeOriginOptions } from "@/components/VxeCurd/types"
import { get, set } from "lodash-es"
import { request } from "@/utils/service"
import { VxeTableDefines } from "vxe-table/types/table"
import { VxeColumnPropTypes } from "vxe-table/types/column"

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

export function buildOpt(
  solts: Record<string, Function | undefined>,
  items: CrudItem[],
  api: Api,
  option: VxeCrudOptions
): VxeOriginOptions {
  const defaultGridOpt: VxeGridProps = getDefaultGridOpt(solts, undefined, api)
  setColumns(defaultGridOpt, items, option)
  setSearchItem(defaultGridOpt, items)

  const defaultFormOpt: VxeFormProps = { span: 24, titleWidth: "100px", data: {} }
  setFormItem(defaultFormOpt, items, option)
  setFormRule(defaultFormOpt, items)

  const defaultModalOpt: VxeModalProps = {}

  return { grid: defaultGridOpt, form: defaultFormOpt, modal: defaultModalOpt }
}

export function setColumns(opt: VxeGridProps, items: CrudItem[], option: VxeCrudOptions) {
  // 列表项
  const columns: VxeTableDefines.ColumnOptions[] = items
    .filter((it) => !!it.column)
    .map((it) => {
      return { field: it.field, title: it.title, ...handleExtra(it.column) }
    })
  if (option.action && option.action.length > 0) {
    // 操作按钮
    const solts: VxeColumnPropTypes.Slots = {
      default: ({ row }): JSX.Element[] => {
        return (option.action || []).map((it) => {
          if (!it.condition) it.condition = () => true
          return <vxe-button v-show={it.condition(row)} {...it} />
        })
      }
    }
    const action: VxeTableDefines.ColumnOptions = {
      params: { type: "action" },
      title: "操作",
      slots: solts
    }
    columns.push(action)
  }

  set(opt, "columns", columns)
}

export function setSearchItem(opt: VxeGridProps, items: CrudItem[]) {
  const searchItem: VxeFormItemProps[] = items
    .filter((it) => !!it.search)
    .map((it) => {
      return { field: it.field, title: it.title, ...handleExtra(it.search) }
    })
  // 添加搜索按钮
  searchItem.push(defaultSearchBtn)
  set(opt, "formConfig.items", searchItem)
}
export function setFormItem(opt: VxeFormProps, items: CrudItem[], option: VxeCrudOptions) {
  const formItems: VxeFormItemProps[] = items
    .filter((it) => !!it.form)
    .map((it) => {
      return { field: it.field, title: it.title, ...handleExtra(it.form) }
    })
  if (option.formAction && option.formAction.length > 0) {
    // 操作按钮
    const solts: VxeFormItemPropTypes.Slots = {
      default: ({ data }): JSX.Element[] => {
        return (option.formAction || []).map((it) => {
          if (!it.condition) it.condition = () => true
          return <vxe-button v-show={it.condition(data)} {...it} />
        })
      }
    }
    formItems.push({ itemRender: {}, align: "right", slots: solts })
  }

  set(opt, "items", formItems)
}
export function setFormRule(opt: VxeFormProps, items: CrudItem[]) {
  const rules = {}
  items
    .filter((it) => !!it.formRules)
    .forEach((it) => set(rules, it.field + "", Array.isArray(it.formRules) ? it.formRules : [it.formRules]))
  set(opt, "rules", rules)
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
