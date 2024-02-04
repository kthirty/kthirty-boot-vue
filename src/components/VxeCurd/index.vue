<template>
  <div class="app-container">
    <vxe-grid ref="gridDom" v-bind="gridOpt">
      <template v-for="(slot, name) in $slots" v-slot:[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
    </vxe-grid>
    <vxe-modal ref="modalDom" v-bind="modalOpt">
      <vxe-form ref="formDom" v-bind="formOpt" />
    </vxe-modal>
  </div>
</template>
<script lang="ts" setup>
import {
  type VxeFormInstance,
  VxeFormItemProps,
  type VxeFormProps,
  VxeGridProps,
  type VxeModalInstance,
  type VxeModalProps,
  VxeTableDataRow,
  VxeTableDefines
} from "vxe-table"
import { reactive, ref } from "vue"
import { request } from "@/utils/service"
import { type VxeFormPropTypes } from "vxe-table/types/form"
import { defaultSearchBtn } from "@/components/VxeCurd/helper"

defineOptions({ name: "vxe-curd" })

interface Api {
  query: string
  insert: string
}

const props = defineProps({
  searchItems: {
    type: Array as () => VxeFormItemProps[],
    required: true
  },
  api: {
    type: Object as () => Api,
    required: true
  },
  columns: {
    type: Array as () => VxeTableDefines.ColumnOptions<VxeTableDataRow>[],
    required: true
  },
  formItems: {
    type: Array as () => VxeFormItemProps[]
  },
  formRules: {
    type: Object as () => VxeFormPropTypes.Rules
  }
})

const gridOpt: VxeGridProps = reactive({
  loading: true,
  formConfig: {
    items: [...props.searchItems, defaultSearchBtn]
  },
  toolbarConfig: {
    refresh: true,
    custom: true
  },
  pagerConfig: {
    enabled: true
  },
  columns: props.columns,
  proxyConfig: {
    seq: true,
    form: true,
    autoload: true,
    props: {
      result: "records",
      total: "totalRow",
      message: ""
    },
    ajax: {
      query: ({ page, form }) => {
        gridOpt.loading = true
        return new Promise((resolve) => {
          request({
            url: `${props.api.query}`,
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

const modalDom = ref<VxeModalInstance>()
const modalOpt: VxeModalProps = reactive({
  title: "操作",
  showClose: true,
  escClosable: true,
  maskClosable: true,
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
  items: props.formItems,
  rules: props.formRules
})

defineExpose({
  getModalDom: () => modalDom
})
</script>
