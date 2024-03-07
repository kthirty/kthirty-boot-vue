<template>
  <vxe-curd :api="api" :items="items" :option="option" />
</template>
<script lang="ts" setup>
import VxeCurd from "@/components/VxeCurd/index.vue"
import { Api, CrudItem, VxeCrudOptions } from "@/components/VxeCurd/types"
import { reactive } from "vue"
import { VxeCurdProps } from "@/components/VxeCurd/helper"

const api: Api = new Api("/sys/post")

const items: CrudItem[] = [
  { field: "code", title: "岗位代码", column: { treeNode: true }, search: "input" },
  { field: "name", title: "岗位名称", column: true, search: "input", form: "input" },
  { field: "sort", title: "排序", column: true, form: "input" },
  { field: "description", title: "描述", column: true, form: "input" }
]

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
