<script lang="ts" setup>
import type { VxeCurdStore } from "../types"

defineOptions({ name: "vxe-curd-default-form-action" })
const props = defineProps({
  store: { type: Object as () => VxeCurdStore, required: true },
  row: { type: Object, required: true }
})
</script>
<template>
  <vxe-button type="text" status="primary" @click="store.showModal(row)" icon="vxe-icon-edit" />
  <vxe-button type="text" status="danger" @click="store.onDelete(row)" icon="vxe-icon-delete" />
</template>
