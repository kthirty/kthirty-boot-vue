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
        <template v-if="!solts['form-action']" #form-action><DefaultFormAction :store="crudStore" /></template>
      </vxe-form>
    </vxe-modal>
  </div>
</template>
<script lang="ts" setup>
import type { VxeFormInstance, VxeFormProps, VxeGridProps, VxeModalInstance, VxeModalProps } from "vxe-table"
import VXETable, { VxeGridInstance } from "vxe-table"
import { nextTick, reactive, ref, useSlots, watch, watchEffect } from "vue"
import { afterDelete, afterInsert, initFormOpt, initGridOpt, initModalOpt } from "@/components/VxeCurd/helper"
import { VxeCrudHolder, VxeCurdStore, VxeCrudOptions, CrudItem } from "@/components/VxeCurd/types"
import { ElMessage, ElNotification } from "element-plus"
import { request } from "@/utils/service"
import { startsWith, get, merge, set } from "lodash-es"
import DefaultFormAction from "./default/DefaultFormAction.vue"
import type { Api } from "@/components/VxeCurd/types"
import DefaultListAction from "@/components/VxeCurd/default/DefaultListAction.vue"

defineOptions({ name: "vxe-curd" })
const emit = defineEmits(["register", "formChange"])
const solts = useSlots()
const gridDom = ref<VxeGridInstance>()
const modalDom = ref<VxeModalInstance>()
const formDom = ref<VxeFormInstance>()

const props = defineProps({
  options: { type: [VxeCrudOptions, Array as () => CrudItem[]], required: true },
  api: { type: Object as () => Api, required: true }
})

const gridOpt: VxeGridProps = reactive(initGridOpt(props.options, props.api, solts))
const modalOpt: VxeModalProps = reactive(initModalOpt(props.options))
const formOpt: VxeFormProps = reactive(initFormOpt(props.options, solts))
// register 回调
const registerParam: VxeCrudHolder = {
  gridOpt,
  gridDom,
  modalOpt,
  modalDom,
  formOpt,
  formDom
}
watch(
  () => formOpt.data,
  (value, oldValue) => emit("formChange", value, oldValue),
  { deep: true }
)

emit("register", registerParam)
// expose
const crudStore: VxeCurdStore = reactive({
  holder: registerParam,
  isUpdate: false,
  showModal: (row?: any, title?: string) => {
    crudStore.isUpdate = !!row?.id
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
