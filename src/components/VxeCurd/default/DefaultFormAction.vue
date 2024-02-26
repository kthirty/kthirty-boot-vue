<script lang="ts" setup>
import type { VxeCurdStore } from "../types"

defineOptions({ name: "vxe-curd-default-form-action" })
const props = defineProps({ store: { type: Object as () => VxeCurdStore, required: true } })
</script>
<template>
  <vxe-button type="submit" status="primary" content="提交" />
  <vxe-button type="button" content="取消" @click="props.curdStore.closeModal" />
</template>
