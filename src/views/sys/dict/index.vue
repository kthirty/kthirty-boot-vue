<script lang="ts" setup>
import VxeCurd from "@/components/VxeCurd/index.vue"
import { Api, CrudItem, VxeCrudOptions } from "@/components/VxeCurd/types"
import { reactive } from "vue"
import { VxeCurdProps, VxeDefaultOption } from "@/components/VxeCurd/helper"

defineOptions({ name: "sys-dict" })
const api = new Api("/sys/dict")
const items: CrudItem[] = reactive([
  { field: "code", title: "字典编码", column: true, search: "$input", form: "$input", rules: "required" },
  { field: "name", title: "字典名称", column: true, search: "$input", form: "$input", rules: "required" },
  { field: "description", title: "描述", column: true, search: "$input", form: "$input" }
])
const option: VxeCrudOptions = reactive({
  action: [
    ...VxeCurdProps.DefaultAction,
    {
      icon: "vxe-icon-setting",
      tooltip: "配置",
      onClick: ({ row }) => {
        drawer.current = row
        drawer.visible = true
      }
    }
  ],
  formAction: VxeCurdProps.DefaultFormAction,
  toolbarButtons: VxeCurdProps.DefaultToolbar
})

const drawer = reactive({
  title: "字典详情",
  visible: false,
  current: {},
  before: (param: any) => {
    param.dictId = drawer.current?.id
    param.code = drawer.current?.code
  }
})
const detailItems: CrudItem[] = reactive([
  { field: "value", title: "字典值", column: true, form: "$input", rules: "required" },
  { field: "label", title: "字典标签", column: true, form: "$input", rules: "required" },
  { field: "description", title: "描述", column: true, form: "textarea" },
  { field: "sort", title: "排序", column: true, form: "$input" }
])
</script>

<template>
  <div>
    <vxe-curd :api="api" :items="items" :option="option" />
    <el-drawer :title="drawer.title" v-model="drawer.visible" width="50%">
      <vxe-curd
        :api="new Api('/sys/dictItem')"
        :items="detailItems"
        :option="{ ...VxeDefaultOption, beforeSearch: drawer.before, beforeSubmit: drawer.before }"
      />
    </el-drawer>
  </div>
</template>
