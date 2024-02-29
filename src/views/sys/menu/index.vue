<template>
  <vxe-curd ref="curdRef" :api="api" :items="items" @register="register" :option="option">
    <template #action="{ row, store }">
      <default-list-action :row="row" :store="store" />
      <vxe-button icon="vxe-icon-add" type="text" status="primary" @click="store.showModal({ parentId: row.id })" />
      <vxe-button
        icon="vxe-icon-copy"
        type="text"
        status="primary"
        @click="store.showModal({ ...row, name: row.name + '-副本', id: '', code: '' })"
      />
    </template>
    <template #toolbar-btns="{ store }">
      <default-toolbar-btn :store="store" />
    </template>
  </vxe-curd>
</template>
<script setup lang="ts">
import VxeCurd from "@/components/VxeCurd/index.vue"
import { onMounted, reactive, ref } from "vue"
import { set } from "lodash-es"
import { Api, CrudItem, VxeCrudHolder, VxeCrudOptions, VxeCurdStore } from "@/components/VxeCurd/types"
import DefaultListAction from "@/components/VxeCurd/default/DefaultListAction.vue"
import DefaultToolbarBtn from "@/components/VxeCurd/default/DefaultToolbarBtn.vue"
const register = (opt: VxeCrudHolder) => set(opt.gridOpt || {}, "treeConfig.transform", true)
const api: Api = new Api("/sys/menu")

const items: CrudItem[] = reactive([
  { field: "code", title: "编码", column: { treeNode: true }, search: "$input" },
  { field: "name", title: "菜单名称", column: true, search: "$input", form: "$input", formRules: { required: true } },
  { field: "path", title: "请求地址", column: true, form: "$input", formRules: { required: true } },
  { field: "permission", title: "权限标识", column: true, form: "$input", formRules: { required: true } },
  { field: "component", title: "前端组件", column: true, form: "$input", formRules: { required: true } }
])
const option: VxeCrudOptions = reactive({ action: [{ content: "修改" }] })

const curdRef = ref<VxeCurdStore>()

onMounted(() => {})
</script>
