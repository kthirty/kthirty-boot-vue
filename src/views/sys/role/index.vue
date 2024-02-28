<template>
  <vxe-curd :api="api" :options="opt" @register="register">
    <template #action="{ row, crudStore }"><default-list-action :row="row" :store="crudStore" /></template>
    <template #toolbar-btns="{ crudStore }">
      <default-toolbar-btn :store="crudStore" />
    </template>
  </vxe-curd>
</template>
<script setup lang="ts">
import VxeCurd from "@/components/VxeCurd/index.vue"
import DefaultListAction from "@/components/VxeCurd/default/DefaultListAction.vue"
import DefaultToolbarBtn from "@/components/VxeCurd/default/DefaultToolbarBtn.vue"
import { Api, CrudItem, VxeCrudHolder } from "@/components/VxeCurd/types"
import { set } from "lodash-es"
const register = (opt: VxeCrudHolder) => set(opt.gridOpt, "treeConfig.transform", true)
const api: Api = new Api("/sys/role")

const opt: CrudItem[] = [
  { field: "code", title: "代码", column: { treeNode: true }, search: "input" },
  { field: "name", title: "角色名", column: true, search: "input", form: "input" },
  { field: "description", title: "角色英文名", column: true, form: "input" }
]
</script>
