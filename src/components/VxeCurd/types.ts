import {
  VxeButtonPropTypes,
  VxeFormDefines,
  VxeFormInstance,
  VxeFormProps,
  VxeGridInstance,
  VxeGridProps,
  VxeModalInstance,
  VxeModalProps
} from "vxe-table"
import { Ref } from "vue"
import { VxeButtonEventProps, type VxeButtonProps } from "vxe-table/types/button"

export class Api {
  query: string
  insert: string
  update: string
  delete: string
  constructor(baseUrl: string) {
    this.query = baseUrl + "/page"
    this.insert = baseUrl + "/save"
    this.update = baseUrl + "/update"
    this.delete = baseUrl + "/remove"
  }
}
export class VxeCrudHolder {
  gridOpt?: VxeGridProps
  gridDom?: Ref<VxeGridInstance | undefined>
  modalOpt?: VxeModalProps
  modalDom?: Ref<VxeModalInstance | undefined>
  formOpt?: VxeFormProps
  formDom?: Ref<VxeFormInstance | undefined>
}
export interface VxeOriginOptions {
  grid: VxeGridProps
  modal: VxeModalProps
  form: VxeFormProps
}
export class VxeCrudOptions {
  action?: VxeCrudButtonProps[]
  formAction?: VxeCrudButtonProps[]
  toolbarButtons?: VxeCrudButtonProps[]
  grid?: VxeGridProps
  beforeSubmit?: Function
  beforeDelete?: Function
  beforeSearch?: Function
}
export interface VxeCrudButtonProps extends VxeButtonProps, VxeButtonEventProps {
  /**
   * 显示条件
   */
  condition?: Function
  /**
   * 权限显示
   */
  permission?: string | string[]
  /**
   * 提示
   */
  tooltip?: string
}

export class CrudItem {
  field?: string
  title?: string
  /**
   * see https://vxetable.cn/#/grid/api?filterName=form-config
   */
  search?: string | Function | Object
  /**
   * see https://vxetable.cn/#/form/api
   */
  form?: boolean | string | Function | Object
  /**
   * 验证规则
   */
  rules?: string | string[] | VxeFormDefines.FormRule | VxeFormDefines.FormRule[]
  /**
   * boolean 不添加其他属性
   * string 获取 VxeCurd/helper.ts#defaultRender map中的数据
   * Function 调用方法获取额外参数
   * Object 将Object 中属性作为拓展属性
   * see https://vxetable.cn/#/grid/api?filterName=form-config
   */
  column?: boolean | string | Function | Object
  /**
   * 权限显示
   */
  permission?: string | string[]
}

export class VxeCurdStore {
  showModal: Function = () => {}
  closeModal: Function = () => {}
  onSubmitForm: Function = () => {}
  onDelete: Function = () => {}
  isUpdate: boolean = false
  holder: VxeCrudHolder = {}
}
