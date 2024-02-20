<template>
  <vxe-curd
    ref="curdRef"
    :options="{
      api: api,
      grid: {
        columns,
        formConfig: {
          items: items
        }
      },
      form: {
        items: formItems
      }
    }"
    @register="registerGrid"
  >
    <template #form-action="{ crudStore }">
      <vxe-button type="submit" status="primary" content="提交" />
      <vxe-button type="button" content="取消" @click="crudStore.closeModal" />
    </template>
    <template #action="{ row, crudStore }">
      <vxe-button type="text" status="primary" @click="crudStore.showModal(row)" content="编辑" />
      <vxe-button type="text" status="danger" @click="crudStore.onDelete(row)" content="删除" />
      <vxe-button transfer type="text" content="更多">
        <template #dropdowns>
          <vxe-button type="text" content="下拉按钮1" />
          <vxe-button type="text" content="下拉按钮2" />
          <vxe-button type="text" content="下拉按钮3" />
        </template>
      </vxe-button>
    </template>
    <template #toolbar-btns="{ crudStore }">
      <vxe-button @click="crudStore.showModal()" icon="vxe-icon-add" content="新增" />
    </template>
  </vxe-curd>
</template>
<script setup lang="ts">
import VxeCurd from "@/components/VxeCurd/index.vue"
import { onMounted, reactive, ref } from "vue"
import { set } from "lodash-es"
import { type Api, VxeCrudRegister, VxeCurdStore } from "@/components/VxeCurd/helper"
const registerGrid = (opt: VxeCrudRegister) => set(opt.gridOpt, "treeConfig.transform", true)
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
  { field: "name", title: "菜单名称", itemRender: { name: "$input", props: { placeholder: "请输入" } } },
  { field: "component", title: "前端组件", itemRender: { name: "$input", props: { placeholder: "请输入" } } },
  { field: "path", title: "请求地址", itemRender: { name: "$input", props: { placeholder: "请输入" } } },
  { field: "icon", title: "图标", itemRender: { name: "$input", props: { placeholder: "请输入" } } },
  { field: "description", title: "描述", itemRender: { name: "$input", props: { placeholder: "请输入" } } },
  { field: "permission", title: "权限标识", itemRender: { name: "$input", props: { placeholder: "请输入" } } }
]

const curdRef = ref<VxeCurdStore>()

onMounted(() => {})
</script>
