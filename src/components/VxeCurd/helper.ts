import { VxeFormItemProps } from "vxe-table/types/form-item"
import { Ref, ref } from "vue"
import { VxeGridInstance, VxeGridProps } from "vxe-table"
import { request } from "@/utils/service"
import { merge } from "lodash-es"
export interface Api {
  query: string
  insert: string
  update: string
  delete: string
}
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

export const getGridOpt = (api: Api, obj: VxeGridProps): VxeGridProps => {
  let res = {
    loading: true,
    formConfig: {
      items: []
    },
    border: true,
    showFooter: true,
    toolbarConfig: {
      refresh: true, // 显示刷新按钮
      import: true, // 显示导入按钮
      export: true, // 显示导出按钮
      print: true, // 显示打印按钮
      zoom: true, // 显示全屏按钮
      custom: true // 显示自定义列按钮
    },
    printConfig: {},
    pagerConfig: {
      enabled: true
    },
    columns: [],
    treeConfig: {
      transform: false,
      rowField: "id",
      parentField: "parentId",
      childrenField: "children"
    },
    rowConfig: {
      isCurrent: false,
      isHover: true
    },
    proxyConfig: {
      seq: true,
      form: true,
      autoload: true,
      props: {
        result: "records",
        total: "totalRow",
        message: ""
      }
    }
  }
  res = merge(res, obj || {})
  return res
}
