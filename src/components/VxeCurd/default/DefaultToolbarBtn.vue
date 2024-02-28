<script lang="ts" setup>
import type { VxeCurdStore } from "../types"

defineOptions({ name: "vxe-curd-default-form-action" })
const props = defineProps({ store: { type: Object as () => VxeCurdStore, required: true } })
</script>
<template>
  <vxe-button @click="store.showModal()" icon="vxe-icon-add" content="新增" />
</template>
