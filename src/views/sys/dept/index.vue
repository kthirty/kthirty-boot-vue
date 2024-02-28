<template>
  <vxe-curd :api="api" :options="opt" @register="register">
    <template #action="{ row, crudStore }"><default-list-action :row="row" :store="crudStore" /></template>
    <template #toolbar-btns="{ crudStore }">
      <default-toolbar-btn :store="crudStore" />
    </template>
  </vxe-curd>
</template>
<script lang="ts" setup>
import VxeCurd from "@/components/VxeCurd/index.vue"
import DefaultListAction from "@/components/VxeCurd/default/DefaultListAction.vue"
import DefaultToolbarBtn from "@/components/VxeCurd/default/DefaultToolbarBtn.vue"
import { Api, CrudItem, VxeCrudHolder } from "@/components/VxeCurd/types"
import { set } from "lodash-es"
const register = (opt: VxeCrudHolder) => set(opt.gridOpt, "treeConfig.transform", true)
const api: Api = new Api("/sys/dept")

const opt: CrudItem[] = [
  { field: "code", title: "编码", column: { treeNode: true }, search: "input" },
  { field: "name", title: "部门名称", column: true, search: "input", form: "input" },
  { field: "description", title: "描述", column: true, form: "input" },
  { field: "sort", title: "排序", column: true, form: "input" },
  { field: "category", title: "机构类型", column: true, form: "input" }
]
</script>
