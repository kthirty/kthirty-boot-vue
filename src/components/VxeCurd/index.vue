<template>
  <div class="app-container">
    <vxe-grid ref="gridDom" v-bind="gridOpt">
      <template v-for="(slot, name) in $slots" v-slot:[name]="data">
        <slot :name="name" v-bind="data" />
      </template>
    </vxe-grid>
    <vxe-modal>
      <vxe-form />
    </vxe-modal>
  </div>
</template>
<script lang="ts" setup>
import { VxeFormItemProps, VxeGridProps, VxeTableDataRow, VxeTableDefines } from "vxe-table"
import { reactive } from "vue"
import { request } from "@/utils/service"
import { isString, startsWith } from "lodash-es"

defineOptions({ name: "vxe-curd" })

interface Api {
  query: string
  insert: string
}

const props = defineProps({
  formItems: {
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
  }
})
const gridOpt: VxeGridProps = reactive({
  loading: true,
  formConfig: {
    items: props.formItems
  },
  toolbarConfig: {
    refresh: true
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
            data: { ...page, ...form }
          })
            .then((res: any) => {
              gridOpt.loading = false
              console.log("res.data", res.data)
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
const demoFun = () => {
  console.log("11234")
}
defineExpose({
  demoFun
})
</script>
