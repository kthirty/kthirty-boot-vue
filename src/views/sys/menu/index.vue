<template>
  <vxe-curd :api="api" :items="items" :option="option" />
</template>
<script setup lang="ts">
import VxeCurd from "@/components/VxeCurd/index.vue"
import { reactive } from "vue"
import { Api, CrudItem, VxeCrudOptions } from "@/components/VxeCurd/types"
import { VxeCurdProps } from "@/components/VxeCurd/helper"

const api: Api = new Api("/sys/menu")

const items: CrudItem[] = reactive([
  { field: "code", title: "编码", column: { treeNode: true }, search: "$input" },
  { field: "name", title: "菜单名称", column: true, search: "$input", form: "$input", rules: "required" },
  { field: "path", title: "请求地址", column: true, form: "$input", rules: "required" },
  { field: "permission", title: "权限标识", column: true, form: "$input" },
  { field: "component", title: "前端组件", column: true, form: "$input", rules: "required" }
])
const option: VxeCrudOptions = reactive({
  action: [
    ...VxeCurdProps.DefaultAction,
    { onClick: ({ row, store }) => store.showModal({ parentId: row.id }), icon: "vxe-icon-add", tooltip: "新增下级" }
  ],
  formAction: VxeCurdProps.DefaultFormAction,
  toolbarButtons: VxeCurdProps.DefaultToolbar,
  grid: {
    treeConfig: {
      transform: true
    }
  }
})
</script>
