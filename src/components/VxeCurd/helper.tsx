import { VxeFormItemProps, VxeFormItemPropTypes } from "vxe-table/types/form-item"
import { Ref } from "vue"
import { VxeFormDefines, VxeFormProps, VxeGridInstance, VxeGridProps, VxeModalProps } from "vxe-table"
import { Api, CrudItem, VxeCrudOptions, VxeCurdStore, VxeOriginOptions } from "@/components/VxeCurd/types"
import { cloneDeep, get, set } from "lodash-es"
import { request } from "@/utils/service"
import { VxeTableDefines } from "vxe-table/types/table"
import { VxeColumnPropTypes } from "vxe-table/types/column"
import { usePermissionStoreHook } from "@/store/modules/permission"

const { hasPermission } = usePermissionStoreHook()

interface VxeValidatorOption {
  [field: string]: Function
}
export const VxeValidator: VxeValidatorOption = {
  required: (item: CrudItem): VxeFormDefines.FormRule => {
    return { required: true, content: `请输入${item.title}` }
  }
}
export const VxeCurdProps = {
  DefaultFormAction: [
    { type: "submit", content: "提交", status: "primary" },
    { content: "取消", onClick: (data: any) => data.store.closeModal() }
  ],
  DefaultAction: [
    {
      onClick: (data: any) => data.store.showModal(data.row),
      icon: "vxe-icon-edit",
      tooltip: "修改"
    },
    {
      onClick: (data: any) => data.store.onDelete(data.row),
      icon: "vxe-icon-delete",
      tooltip: "删除",
      status: "danger"
    }
  ],
  DefaultToolbar: [
    {
      icon: "vxe-icon-add",
      content: "新增",
      onClick: (data: any) => data.store.showModal({})
    }
  ]
}

const defaultSearchBtn: VxeFormItemProps = {
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
  store: Ref<VxeCurdStore>,
  solts: Record<string, Function | undefined>,
  items: CrudItem[],
  api: Api,
  option: VxeCrudOptions
): VxeOriginOptions {
  const defaultGridOpt: VxeGridProps = getDefaultGridOpt(solts, { ...option.grid }, api)
  setColumns(store, defaultGridOpt, items, option)
  setSearchItem(defaultGridOpt, items)
  setToolbar(store, defaultGridOpt, option)

  const defaultFormOpt: VxeFormProps = { span: 24, titleWidth: "100px", data: {} }
  setFormItem(store, defaultFormOpt, items, option)
  setFormRule(defaultFormOpt, items)

  const defaultModalOpt: VxeModalProps = {
    destroyOnClose: true
  }

  return { grid: defaultGridOpt, form: defaultFormOpt, modal: defaultModalOpt }
}

export function setToolbar(store: Ref<VxeCurdStore>, opt: VxeGridProps, option: VxeCrudOptions) {
  const solts = (slotParams: any): JSX.Element[] => {
    return (option.toolbarButtons || [])
      .filter((it) => hasPermission(it.permission))
      .map((it) => {
        if (!it.condition) it.condition = () => true
        // 重载OnClick添加参数
        const copyIt = cloneDeep(it)
        copyIt.onClick = (params: any) => it.onClick && it.onClick({ ...params, ...slotParams, store: store.value })
        if (it.tooltip) {
          return (
            <el-tooltip effect="light" content={it.tooltip}>
              <vxe-button v-show={it.condition(slotParams.row)} {...copyIt} />
            </el-tooltip>
          )
        } else {
          return <vxe-button v-show={it.condition(slotParams.row)} {...copyIt} />
        }
      })
  }

  set(opt, "toolbarConfig.slots.buttons", solts)
}

export function setColumns(store: Ref<VxeCurdStore>, opt: VxeGridProps, items: CrudItem[], option: VxeCrudOptions) {
  // 列表项
  const columns: VxeTableDefines.ColumnOptions[] = items
    .filter((it) => !!it.column)
    .filter((it) => hasPermission(it.permission))
    .map((it) => {
      return { field: it.field, title: it.title, ...handleExtra(it.column) }
    })
  if (option.action && option.action.length > 0) {
    // 操作按钮
    const solts: VxeColumnPropTypes.Slots = {
      default: (slotParams): JSX.Element[] => {
        return (option.action || [])
          .filter((it) => hasPermission(it.permission))
          .map((it) => {
            if (!it.condition) it.condition = () => true
            it.type = it.type || "text"
            it.status = it.status || "primary"
            // 重载OnClick添加参数
            const copyIt = cloneDeep(it)
            copyIt.onClick = (params: any) => it.onClick && it.onClick({ ...params, ...slotParams, store: store.value })
            if (it.tooltip) {
              return (
                <el-tooltip effect="light" content={it.tooltip}>
                  <vxe-button v-show={it.condition(slotParams.row)} {...copyIt} />
                </el-tooltip>
              )
            } else {
              return <vxe-button v-show={it.condition(slotParams.row)} {...copyIt} />
            }
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
    .filter((it) => hasPermission(it.permission))
    .map((it) => {
      return { field: it.field, title: it.title, ...handleExtra(it.search) }
    })
  // 添加搜索按钮
  searchItem.push(defaultSearchBtn)
  set(opt, "formConfig.items", searchItem)
}
export function setFormItem(store: Ref<VxeCurdStore>, opt: VxeFormProps, items: CrudItem[], option: VxeCrudOptions) {
  const formItems: VxeFormItemProps[] = items
    .filter((it) => !!it.form)
    .filter((it) => hasPermission(it.permission))
    .map((it) => {
      return { field: it.field, title: it.title, ...handleExtra(it.form) }
    })
  if (option.formAction && option.formAction.length > 0) {
    // 操作按钮
    const solts: VxeFormItemPropTypes.Slots = {
      default: (slotParams): JSX.Element[] => {
        return (option.formAction || [])
          .filter((it) => hasPermission(it.permission))
          .map((it) => {
            if (!it.condition) it.condition = () => true
            // 重载OnClick添加参数
            const copyIt = cloneDeep(it)
            copyIt.onClick = (params: any) => it.onClick && it.onClick({ ...params, ...slotParams, store: store.value })
            return <vxe-button v-show={it.condition(slotParams.data)} {...copyIt} />
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
    .filter((it) => !!it.rules)
    .filter((it) => hasPermission(it.permission))
    .forEach((it) => {
      const arr = Array.isArray(it.rules) ? it.rules : [it.rules]
      const val: VxeFormDefines.FormRule[] = arr.map((rule) =>
        typeof rule === "string" ? VxeValidator[rule](it) : rule
      )
      set(rules, it.field + "", val)
    })
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
