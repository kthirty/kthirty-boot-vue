import { VxeFormItemProps } from "vxe-table/types/form-item"
import { Ref, ref } from "vue"
import {
  VxeFormInstance,
  VxeFormProps,
  VxeGridInstance,
  VxeGridProps,
  VxeModalInstance,
  VxeModalProps
} from "vxe-table"
import { request } from "@/utils/service"
import { merge } from "lodash-es"
export interface Api {
  query: string
  insert: string
  update: string
  delete: string
}
export interface VxeCrudRegister {
  gridOpt: VxeGridProps
  gridDom: Ref<VxeGridInstance | undefined>
  modalOpt: VxeModalProps
  modalDom: Ref<VxeModalInstance | undefined>
  formOpt: VxeFormProps
  formDom: Ref<VxeFormInstance | undefined>
}
export interface VxeCrudOptions {
  grid?: VxeGridProps
  modal?: VxeModalProps
  form?: VxeFormProps
  api: Api
}
export interface VxeCurdStore {
  form: object
  showModal: Function
  closeModal: Function
  onSubmitForm: Function
  onDelete: Function
  isUpdate: boolean
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
