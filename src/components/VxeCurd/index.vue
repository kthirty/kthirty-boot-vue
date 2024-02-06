<template>
  <div class="app-container">
    <vxe-grid ref="gridDom" v-bind="gridOpt">
      <template v-for="(slot, name) in $slots" v-slot:[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
      <template #operate-btn="{ row }">
        <vxe-button type="text" status="primary" @click="toEdit(row)" icon="vxe-icon-edit" title="编辑" />
        <vxe-button type="text" status="danger" @click="toDelete(row)" icon="vxe-icon-delete" title="删除" />
      </template>
    </vxe-grid>
    <vxe-modal ref="modalDom" v-bind="modalOpt">
      <vxe-form ref="formDom" v-bind="formOpt" />
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
  VxeTableDataRow,
  VxeTableDefines
} from "vxe-table"
import VXETable, { VxeGridInstance } from "vxe-table"
import { nextTick, reactive, ref } from "vue"
import { afterDelete, afterInsert, Api, defaultSearchBtn, getGridOpt } from "@/components/VxeCurd/helper"
import { ElMessage, ElNotification } from "element-plus"
import { request } from "@/utils/service"

defineOptions({ name: "vxe-curd" })
const emit = defineEmits(["register-grid"])

const props = defineProps({
  searchItems: { type: Array as () => VxeFormItemProps[], required: true },
  api: { type: Object as () => Api, required: true },
  columns: { type: Array as () => VxeTableDefines.ColumnOptions<VxeTableDataRow>[], required: true },
  formItems: { type: Array as () => VxeFormItemProps[] },
  formRules: { type: Object as () => VxeFormPropTypes.Rules }
})
const gridDom = ref<VxeGridInstance>()
const gridOpt: VxeGridProps = reactive(
  getGridOpt(props.api, {
    formConfig: {
      items: [...props.searchItems, defaultSearchBtn]
    },
    toolbarConfig: {
      buttons: [
        {
          name: "新增",
          icon: "vxe-icon-add",
          buttonRender: {
            name: "$buttons",
            children: [
              { props: { content: "新增", icon: "vxe-icon-add" }, events: { click: () => modalDom.value?.close() } }
            ]
          }
        }
      ]
    },
    columns: [...props.columns, { title: "操作", slots: { default: "operate-btn" } }],
    proxyConfig: {
      ajax: {
        query: ({ page, form }) => {
          gridOpt.loading = true
          return new Promise((resolve) => {
            request({
              url: props.api.query,
              method: "GET",
              params: { ...page, ...form }
            })
              .then((res: any) => {
                gridOpt.loading = false
                resolve(res.data)
              })
              .catch((err: Error) => {
                console.error("loading error", err)
                gridOpt.loading = false
              })
          })
        }
      }
    }
  })
)
emit("register-grid", gridOpt)

const modalDom = ref<VxeModalInstance>()
const modalOpt: VxeModalProps = reactive({
  title: "操作",
  escClosable: true,
  maskClosable: true,
  showClose: true,
  width: "40%",
  showZoom: true,
  mask: true,
  resize: true,
  fullscreen: (props.formItems?.length || 0) >= 10,
  beforeHideMethod: () => {
    formDom.value?.clearValidate()
    return Promise.resolve()
  }
})

const formDom = ref<VxeFormInstance>()
const formOpt: VxeFormProps = reactive({
  span: 24,
  titleWidth: "100px",
  loading: false,
  titleColon: false,
  data: {},
  items: [
    ...(props.formItems || []),
    {
      align: "right",
      itemRender: {
        name: "$buttons",
        children: [
          { props: { content: "取消" }, events: { click: () => modalDom.value?.close() } },
          { props: { type: "submit", content: "确定", status: "primary" }, events: { click: () => onSubmitForm() } }
        ]
      }
    }
  ],
  rules: props.formRules
})

const crudStore = reactive({
  form: {},
  isUpdate: false
})

const toEdit = (row: any) => {
  crudStore.isUpdate = !!row?.id
  formOpt.data = row || {}
  modalDom.value?.open()
  nextTick(() => {
    formDom.value?.clearValidate()
  })
}
const toDelete = async (row: any) => {
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
const onSubmitForm = () => {
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
}
</script>
