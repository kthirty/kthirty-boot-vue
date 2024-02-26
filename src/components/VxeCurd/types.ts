import {
  VxeFormInstance,
  VxeFormProps,
  VxeGridInstance,
  VxeGridProps,
  VxeModalInstance,
  VxeModalProps
} from "vxe-table"
import { Ref } from "vue"

export interface Api {
  query: string
  insert: string
  update: string
  delete: string
}
export interface VxeCrudHolder {
  gridOpt: VxeGridProps
  gridDom: Ref<VxeGridInstance | undefined>
  modalOpt: VxeModalProps
  modalDom: Ref<VxeModalInstance | undefined>
  formOpt: VxeFormProps
  formDom: Ref<VxeFormInstance | undefined>
}
export class VxeCrudOptions {
  grid?: VxeGridProps
  modal?: VxeModalProps
  form?: VxeFormProps
}
export class CrudItem {
  field: string = ""
  title: string = ""
  search?: string | Function | Object
  form?: string | Function | Object
  column?: string | Function | Object
}

export interface VxeCurdStore {
  form: object
  showModal: Function
  closeModal: Function
  onSubmitForm: Function
  onDelete: Function
  isUpdate: boolean
}
