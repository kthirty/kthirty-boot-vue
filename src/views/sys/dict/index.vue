<script lang="ts" setup>
import VxeCurd from "@/components/VxeCurd/index.vue"
import { Api, CrudItem, VxeCrudOptions } from "@/components/VxeCurd/types"
import { reactive } from "vue/dist/vue"
import { VxeCurdProps } from "@/components/VxeCurd/helper"

defineOptions({ name: "sys-dict" })
const api = new Api("/sys/dict")
const items: CrudItem[] = reactive([
  { field: "code", title: "字典编码", column: true, search: true, form: true, rules: "required" },
  { field: "name", title: "字典名称", column: true, search: true, form: true, rules: "required" },
  { field: "description", title: "描述", column: true, search: true, form: true, rules: "required" }
])
const option: VxeCrudOptions = reactive({
  action: VxeCurdProps.DefaultAction,
  formAction: VxeCurdProps.DefaultFormAction,
  toolbarButtons: VxeCurdProps.DefaultToolbar
})
</script>

<template>
  <vxe-curd :api="api" :items="items" :option="option" />
</template>
