<template>
  <vxe-curd ref="curdRef" :columns="columns" :api="api" :form-items="items">
    <template #operate="{ row }">
      {{ row.id }}
    </template>
  </vxe-curd>
</template>
<script setup lang="ts">
import VxeCurd from "@/components/VxeCurd/index.vue"
import { onMounted, reactive, ref } from "vue"

const columns = reactive([
  {
    field: "code",
    title: "编码",
    treeNode: true
  },
  {
    field: "name",
    title: "名称"
  },
  {
    field: "path",
    title: "路径"
  },
  {
    title: "操作",
    slots: { default: "operate" }
  }
])
const api = { query: "/menu/page", insert: "/menu/save" }
const items = reactive([
  {
    field: "name",
    title: "名称",
    itemRender: { name: "$input", props: { placeholder: "请输入" } }
  }
])
const curdRef = ref(null)

onMounted(() => {
  console.log("curdRef", curdRef.value.demoFun())
})
</script>
