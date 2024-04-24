<template>
  <div class="app-container">
    <vxe-grid ref="gridDom" v-bind="gridOpt">
      <template v-for="(slot, name) in $slots" v-slot:[name]="data">
        <template v-if="!startsWith(name.toString(), 'form')">
          <slot :name="name" v-bind="{ ...(data || {}), store: store }" />
        </template>
      </template>
    </vxe-grid>
    <vxe-modal ref="modalDom" v-bind="modalOpt">
      <vxe-form ref="formDom" v-bind="formOpt" @submit="store.onSubmitForm()">
        <template v-for="(slot, name) in $slots" v-slot:[name]="data">
          <template v-if="startsWith(name.toString(), 'form')">
            <slot :name="name" v-bind="{ ...(data || {}), store: store }" />
          </template>
        </template>
      </vxe-form>
    </vxe-modal>
  </div>
</template>
<script lang="ts" setup>
import type { VxeFormInstance, VxeFormProps, VxeGridProps, VxeModalInstance, VxeModalProps } from "vxe-table"
import VXETable, { VxeGridInstance } from "vxe-table"
import { reactive, Ref, ref, useSlots, watch } from "vue"
import {
  afterDelete,
  afterInsert,
  buildOpt,
  setColumns,
  setFormItem,
  setFormRule,
  setSearchItem
} from "@/components/VxeCurd/helper"
import type { Api } from "@/components/VxeCurd/types"
import { CrudItem, VxeCrudHolder, VxeCrudOptions, VxeCurdStore } from "@/components/VxeCurd/types"
import { ElMessage, ElNotification } from "element-plus"
import { request } from "@/utils/service"
import { startsWith } from "lodash-es"

defineOptions({ name: "vxe-curd" })
const emit = defineEmits(["register", "formChange"])
const solts = useSlots()
const gridDom = ref<VxeGridInstance>()
const modalDom = ref<VxeModalInstance>()
const formDom = ref<VxeFormInstance>()
const store: Ref<VxeCurdStore> = ref({})

const props = defineProps({
  items: { type: Array as () => CrudItem[], required: true },
  api: { type: Object as () => Api, required: true },
  option: { type: Object as () => VxeCrudOptions, required: false }
})
const buildOptRes = buildOpt(store, solts, props.items, props.api, props.option || {})

const gridOpt: VxeGridProps = reactive(buildOptRes.grid)
const modalOpt: VxeModalProps = reactive(buildOptRes.modal)
const formOpt: VxeFormProps = reactive(buildOptRes.form)
// register 回调
const registerParam: VxeCrudHolder = {
  gridOpt,
  gridDom,
  modalOpt,
  modalDom,
  formOpt,
  formDom
}
emit("register", registerParam)
// 监听
watch(
  () => formOpt.data,
  (value, oldValue) => emit("formChange", value, oldValue),
  { deep: true }
)
watch(
  () => {
    return { items: props.items, option: props.option }
  },
  (val, oldValue) => {
    setColumns(store, gridOpt, val.items, val.option || {})
    setSearchItem(gridOpt, val.items)
    setFormItem(store, formOpt, val.items, val.option || {})
    setFormRule(formOpt, val.items)
  },
  { deep: true }
)
// expose
store.value = {
  holder: registerParam,
  isUpdate: false,
  showModal: (row?: any, title?: string) => {
    store.value.isUpdate = !!row?.id
    formOpt.data = row ? { ...row } : {}
    modalDom?.value?.open()
    title && (modalOpt.title = title)
  },
  closeModal: () => {
    modalDom.value?.close()
  },
  onSubmitForm: () => {
    if (formOpt.loading) return
    formDom.value?.validate(async (errMap) => {
      if (errMap) return
      // 钩子函数
      const result = props.option?.beforeSubmit?.call(store, formOpt.data) ?? true
      if (!result) return
      // 开始提交
      formOpt.loading = true
      const callback = (isUpdate?: boolean) => {
        formOpt.loading = false
        modalDom.value?.close()
        ElMessage.success("保存成功")
        !isUpdate && afterInsert(gridDom)
        gridDom.value?.commitProxy("query")
      }
      const res: ApiResponseData<any> = await request({
        url: store.value.isUpdate ? props.api.update : props.api.insert,
        method: store.value.isUpdate ? "PUT" : "POST",
        data: formOpt.data
      })
      formOpt.loading = false
      if (res.success) {
        callback(store.value.isUpdate)
      } else {
        formOpt.loading = false
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
      // 钩子函数
      const result = props.option?.beforeDelete?.call(store, row) ?? true
      if (!result) return
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
}
defineExpose(store.value)
</script>
