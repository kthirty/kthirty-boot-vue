<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { SubTableColumnSchema, SubTableProps } from './types';

import {
  computed,
  defineAsyncComponent,
  ref,
  useTemplateRef,
  watch,
} from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Button, Popconfirm, Table } from 'ant-design-vue';

import { $t } from '#/locales';

import SubTableCell from './sub-table-cell.vue';

defineOptions({ name: 'SubTable', inheritAttrs: false });

const props = withDefaults(defineProps<SubTableProps>(), {
  columns: () => [],
  disabled: false,
  inlineEdit: true,
  modalEdit: true,
  showAdd: true,
  showDelete: true,
  rowKey: '_subTableRowKey',
});

const SubTableRowModal = defineAsyncComponent(
  () => import('./sub-table-row-modal.vue'),
);

const modelValue = defineModel<Recordable<any>[]>('value', {
  default: () => [],
});

const modalRef =
  useTemplateRef<InstanceType<typeof SubTableRowModal>>('modalRef');
const editingRowIndex = ref(-1);

let rowKeySeed = 0;

const columnMap = computed(() => {
  const map = new Map<string, SubTableColumnSchema>();
  props.columns.forEach((col) => map.set(col.field, col));
  return map;
});

function ensureRowKey(row: Recordable<any>) {
  if (!row[props.rowKey]) {
    row[props.rowKey] = `sub-row-${++rowKeySeed}`;
  }
  return row[props.rowKey];
}

function normalizeRows(rows: Recordable<any>[] = []) {
  return rows.map((row) => {
    const nextRow = { ...row };
    ensureRowKey(nextRow);
    return nextRow;
  });
}

watch(
  () => modelValue.value,
  (rows) => {
    if (!rows?.length) {
      return;
    }
    const normalized = normalizeRows(rows);
    const changed = normalized.some(
      (row, index) => row[props.rowKey] !== rows[index]?.[props.rowKey],
    );
    if (changed) {
      modelValue.value = normalized;
    }
  },
  { deep: true, immediate: true },
);

function createEmptyRow() {
  const row: Recordable<any> = {};
  props.columns.forEach((col) => {
    row[col.field] = col.defaultValue ?? undefined;
  });
  ensureRowKey(row);
  return row;
}

function updateRowField(index: number, field: string, value: any) {
  const list = [...(modelValue.value ?? [])];
  const row = { ...list[index], [field]: value };
  list[index] = row;
  modelValue.value = list;
}

function addRow() {
  modelValue.value = [...(modelValue.value ?? []), createEmptyRow()];
}

function deleteRow(index: number) {
  const list = [...(modelValue.value ?? [])];
  list.splice(index, 1);
  modelValue.value = list;
}

function onModalConfirm(values: Recordable<any>) {
  if (editingRowIndex.value < 0) {
    return;
  }
  const list = [...(modelValue.value ?? [])];
  const originKey = list[editingRowIndex.value]?.[props.rowKey];
  list[editingRowIndex.value] = {
    ...list[editingRowIndex.value],
    ...values,
    [props.rowKey]: originKey,
  };
  modelValue.value = list;
  editingRowIndex.value = -1;
}

function handleModalOpen(row: Recordable<any>, index: number) {
  editingRowIndex.value = index;
  modalRef.value?.open(row, index);
}

function isColumnEditable(col?: SubTableColumnSchema) {
  return col && col.editable !== false && props.inlineEdit && !!col.component;
}

const tableColumns = computed(() => {
  const cols = props.columns.map((col) => ({
    dataIndex: col.field,
    key: col.field,
    title: col.title,
    width: col.width,
  }));

  if (props.modalEdit || props.showDelete) {
    cols.push({
      dataIndex: 'action',
      key: 'action',
      title: $t('system.role.operation'),
      width: props.modalEdit && props.showDelete ? 140 : 100,
    });
  }

  return cols;
});

const scrollConfig = computed(() => {
  if (!props.maxHeight) {
    return undefined;
  }
  return { y: props.maxHeight };
});
</script>

<template>
  <div class="sub-table w-full">
    <div v-if="showAdd && !disabled" class="mb-2 flex justify-end">
      <Button size="small" type="primary" @click="addRow">
        <IconifyIcon class="mr-1 size-4" icon="lucide:plus" />
        {{ $t('ui.actionTitle.create', ['']) }}
      </Button>
    </div>
    <Table
      :columns="tableColumns"
      :data-source="modelValue"
      :pagination="false"
      :row-key="rowKey"
      :scroll="scrollConfig"
      bordered
      size="small"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'action'">
          <div class="flex items-center gap-1">
            <Button
              v-if="modalEdit"
              :disabled="disabled"
              size="small"
              type="link"
              @click="handleModalOpen(record, index)"
            >
              {{ $t('common.edit') }}
            </Button>
            <Popconfirm
              v-if="showDelete"
              :disabled="disabled"
              :title="$t('ui.actionMessage.deleteConfirm', [''])"
              @confirm="deleteRow(index)"
            >
              <Button :disabled="disabled" danger size="small" type="link">
                {{ $t('common.delete') }}
              </Button>
            </Popconfirm>
          </div>
        </template>
        <template v-else>
          <SubTableCell
            v-if="isColumnEditable(columnMap.get(String(column.key)))"
            :column="columnMap.get(String(column.key))!"
            :disabled="disabled"
            :index="index"
            :row="record"
            @change="(field, value) => updateRowField(index, field, value)"
          />
          <span v-else>{{ record[column.dataIndex as string] ?? '' }}</span>
        </template>
      </template>
    </Table>
    <SubTableRowModal
      ref="modalRef"
      :columns="columns"
      :modal-title="modalTitle"
      @confirm="onModalConfirm"
    />
  </div>
</template>
