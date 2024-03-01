<template>
  <vxe-curd :api="api" :options="opt" @register="register" />
</template>
<script lang="ts" setup>
import VxeCurd from "@/components/VxeCurd/index.vue"
import { Api, CrudItem, VxeCrudHolder } from "@/components/VxeCurd/types"
import { set } from "lodash-es"

const register = (opt: VxeCrudHolder) => set(opt.gridOpt, "treeConfig.transform", true)
const api: Api = new Api("/sys/post")

const opt: CrudItem[] = [
  { field: "code", title: "岗位代码", column: { treeNode: true }, search: "input" },
  { field: "name", title: "岗位名称", column: true, search: "input", form: "input" },
  { field: "sort", title: "排序", column: true, form: "input" },
  { field: "description", title: "描述", column: true, form: "input" }
]
</script>
