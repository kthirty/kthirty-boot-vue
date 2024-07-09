<template>
  <a-input-search
    v-model:value="state"
    :placeholder="props.placeholder"
    enter-button="选择"
    @search="showModal"
  />
  <BasicModal @register="register"> Modal Info. </BasicModal>
</template>
<script setup lang="ts">
  import BasicModal from '@/components/Modal/src/BasicModal.vue';
  import { ref, watch } from 'vue';
  import { useRuleFormItem } from '@/hooks/component/useFormItem';
  import { useModal } from '@/components/Modal';

  defineOptions({ name: 'ApiModalTableSelect' });

  const props = defineProps({
    value: {
      type: Array,
    },
    placeholder: {
      type: String,
    },
  });
  const emit = defineEmits(['options-change', 'change', 'update:value']);
  const emitData = ref<any[]>([]);
  const [state] = useRuleFormItem(props, 'value', 'change', emitData);

  const [register, { openModal }] = useModal();

  watch(
    () => state.value,
    (v) => {
      emit('update:value', v);
    },
  );
  const showModal = () => {
    openModal();
  };
</script>
