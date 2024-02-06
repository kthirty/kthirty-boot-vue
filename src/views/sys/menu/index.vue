<template>
  <vxe-curd
    ref="curdRef"
    :columns="columns"
    :api="api"
    :search-items="items"
    :form-items="formItems"
    @registerGrid="registerGrid"
  />
</template>
<script setup lang="ts">
import VxeCurd from "@/components/VxeCurd/index.vue"
import { onMounted, reactive, ref } from "vue"
import { type Api } from "@/components/VxeCurd/helper"
const registerGrid = (opt: any) => (opt.treeConfig.transform = true)
const api: Api = { query: "/menu/page", insert: "/menu/save", update: "/menu/update", delete: "/menu/remove" }

const columns = reactive([
  { field: "code", title: "编码", treeNode: true },
  { field: "name", title: "菜单名称" },
  { field: "path", title: "请求地址" },
  { field: "permission", title: "权限标识" },
  { field: "component", title: "前端组件" }
])
const items = reactive([
  { field: "name", title: "名称", itemRender: { name: "$input", props: { placeholder: "请输入" } } }
])
const formItems = [
  { field: "code", title: "菜单编码" },
  { field: "name", title: "菜单名称", itemRender: { name: "$input", props: { placeholder: "请输入" } } },
  { field: "component", title: "前端组件", itemRender: { name: "$input", props: { placeholder: "请输入" } } },
  { field: "path", title: "请求地址", itemRender: { name: "$input", props: { placeholder: "请输入" } } },
  { field: "icon", title: "图标", itemRender: { name: "$input", props: { placeholder: "请输入" } } },
  { field: "description", title: "描述", itemRender: { name: "$input", props: { placeholder: "请输入" } } },
  { field: "permission", title: "权限标识", itemRender: { name: "$input", props: { placeholder: "请输入" } } }
]

const curdRef = ref(null)

onMounted(() => {})
</script>
