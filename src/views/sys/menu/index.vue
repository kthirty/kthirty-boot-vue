<template>
  <vxe-curd ref="curdRef" :api="api" :options="opt" @register="register">
    <template #action="{ row, crudStore }">
      <default-list-action :row="row" :store="crudStore" />
      <vxe-button icon="vxe-icon-add" type="text" status="primary" @click="crudStore.showModal({ parentId: row.id })" />
      <vxe-button
        icon="vxe-icon-copy"
        type="text"
        status="primary"
        @click="crudStore.showModal({ ...row, name: row.name + '副本', id: '' })"
      />
    </template>
    <template #toolbar-btns="{ crudStore }">
      <default-toolbar-btn :store="crudStore" />
    </template>
  </vxe-curd>
</template>
<script setup lang="ts">
import VxeCurd from "@/components/VxeCurd/index.vue"
import { onMounted, reactive, ref } from "vue"
import { set } from "lodash-es"
import { Api, CrudItem, VxeCrudHolder, VxeCurdStore } from "@/components/VxeCurd/types"
import DefaultListAction from "@/components/VxeCurd/default/DefaultListAction.vue"
import DefaultToolbarBtn from "@/components/VxeCurd/default/DefaultToolbarBtn.vue"
const register = (opt: VxeCrudHolder) => set(opt.gridOpt, "treeConfig.transform", true)
const api: Api = new Api("/sys/menu")

const opt: CrudItem[] = [
  { field: "code", title: "编码", column: { treeNode: true }, search: "$input" },
  { field: "name", title: "菜单名称", column: true, search: "$input", form: "$input", formRules: { required: true } },
  { field: "path", title: "请求地址", column: true, form: "$input", formRules: { required: true } },
  { field: "permission", title: "权限标识", column: true, form: "$input", formRules: { required: true } },
  { field: "component", title: "前端组件", column: true, form: "$input", formRules: { required: true } }
]

const curdRef = ref<VxeCurdStore>()

onMounted(() => {})
</script>
