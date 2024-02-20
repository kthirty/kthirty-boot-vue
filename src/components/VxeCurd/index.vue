<template>
  <div class="app-container">
    <vxe-grid ref="gridDom" v-bind="gridOpt">
      <template v-for="(slot, name) in $slots" v-slot:[name]="data">
        <template v-if="!startsWith(name.toString(), 'form')">
          <slot :name="name" v-bind="{ ...(data || {}), crudStore }" />
        </template>
      </template>
    </vxe-grid>
    <vxe-modal ref="modalDom" v-bind="modalOpt">
      <vxe-form ref="formDom" v-bind="formOpt" @submit="crudStore.onSubmitForm()">
        <template v-for="(slot, name) in $slots" v-slot:[name]="data">
          <template v-if="startsWith(name.toString(), 'form')">
            <slot :name="name" v-bind="{ ...(data || {}), crudStore }" />
          </template>
        </template>
      </vxe-form>
    </vxe-modal>
  </div>
</template>
<script lang="ts" setup>
import type {
  VxeFormInstance,
  VxeFormItemProps,
  VxeFormProps,
  VxeFormPropTypes,
  VxeGridProps,
  VxeModalInstance,
  VxeModalProps,
  VxeTableDefines
} from "vxe-table"
import VXETable, { VxeGridInstance } from "vxe-table"
import { nextTick, reactive, ref, useSlots } from "vue"
import {
  afterDelete,
  afterInsert,
  Api,
  defaultSearchBtn,
  VxeCrudOptions,
  VxeCrudRegister,
  VxeCurdStore
} from "@/components/VxeCurd/helper"
import { ElMessage, ElNotification } from "element-plus"
import { request } from "@/utils/service"
import { startsWith, get, merge, set } from "lodash-es"

defineOptions({ name: "vxe-curd" })
const emit = defineEmits(["register"])
const solts = useSlots()
const gridDom = ref<VxeGridInstance>()
const modalDom = ref<VxeModalInstance>()
const formDom = ref<VxeFormInstance>()

const props = defineProps({
  options: { type: Object as () => VxeCrudOptions, required: true }
})

const gridConfig = props.options.grid || {}
// 添加搜索按钮
set(gridConfig, "pagerConfig", {})
gridConfig?.formConfig?.items && gridConfig?.formConfig?.items.push(defaultSearchBtn)
// 设置工具栏插槽
solts["toolbar-btns"] && set(gridConfig, "toolbarConfig.slots.buttons", "toolbar-btns")
// 设置列表操作插槽
const defaultActionSlot = { title: "操作", slots: { default: "action" } }
solts["action"] && set(gridConfig, "columns", [...get(gridConfig, "columns", []), defaultActionSlot])
// 设置请求代理
const queryFunc = ({ page, form }: { page: any; form: any }) => {
  return new Promise((resolve) => {
    request({ url: props.options.api.query, method: "GET", params: { ...page, ...form } })
      .then((res: any) => resolve(res.data))
      .catch((err: Error) => console.error("loading error", err))
  })
}
set(gridConfig, "proxyConfig.ajax.query", queryFunc)
const gridOpt: VxeGridProps = reactive(gridConfig)
const modalOpt: VxeModalProps = reactive(
  merge(props.options.modal || {}, {
    title: "操作",
    fullscreen: (props.formItems?.length || 0) >= 10,
    transfer: false,
    beforeHideMethod: () => {
      formDom.value?.clearValidate()
      return Promise.resolve()
    }
  })
)
const formOpt: VxeFormProps = reactive(
  merge(props.options.form || {}, {
    span: 24,
    titleWidth: "100px",
    loading: false,
    titleColon: false,
    data: {},
    items: [
      ...(props.options?.form?.items || []),
      solts["form-action"] ? { itemRender: {}, align: "right", slots: { default: "form-action" } } : {}
    ]
  })
)

const registerParam: VxeCrudRegister = {
  gridOpt,
  gridDom,
  modalOpt,
  modalDom,
  formOpt,
  formDom
}
emit("register", registerParam)

const crudStore: VxeCurdStore = reactive({
  form: {},
  isUpdate: false,
  showModal: (row?: any) => {
    crudStore.isUpdate = !!row?.id
    formOpt.data = row || {}
    modalDom.value?.open()
    nextTick(() => {
      formDom.value?.clearValidate()
    })
  },
  closeModal: () => {
    modalDom.value?.close()
  },
  onSubmitForm: () => {
    if (formOpt.loading) return
    formDom.value?.validate(async (errMap) => {
      if (errMap) return
      formOpt.loading = true
      const callback = (isUpdate: boolean) => {
        formOpt.loading = false
        modalDom.value?.close()
        ElMessage.success("保存成功")
        !isUpdate && afterInsert(gridDom)
        gridDom.value?.commitProxy("query")
      }
      const res: ApiResponseData<any> = await request({
        url: crudStore.isUpdate ? props.api.update : props.api.insert,
        method: crudStore.isUpdate ? "PUT" : "POST",
        data: formOpt.data
      })
      if (res.success) {
        callback(crudStore.isUpdate)
      } else {
        ElNotification({
          title: "系统提示",
          message: "操作失败" + res.message,
          type: "error"
        })
      }
    })
  },
  onDelete: async (row: any) => {
    const type = await VXETable.modal.confirm("您确定要删除吗？")
    if (type === "confirm") {
      const res: ApiResponseData<any> = await request({ url: `${props.api.delete}/${row["id"]}`, method: "DELETE" })
      if (res?.success) {
        ElNotification({
          title: "系统提示",
          message: "删除成功",
          type: "success"
        })
        gridDom.value?.commitProxy("query")
        afterDelete(gridDom)
      } else {
        ElNotification({
          title: "系统提示",
          message: "删除失败" + res.message,
          type: "error"
        })
      }
    }
  }
})
defineExpose(crudStore)
</script>
