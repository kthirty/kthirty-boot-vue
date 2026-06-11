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
import SubTableDisplay from './sub-table-display.vue';
import {
  extractRowDefaultsFromRows,
  filterDataRows,
} from './use-sub-table-form-defaults';

defineOptions({ name: 'SubTable', inheritAttrs: false });

const props = withDefaults(defineProps<SubTableProps>(), {
  columns: () => [],
  disabled: false,
  rowSelection: true,
  showAdd: true,
  inlineEdit: false,
  modalEdit: true,
  showEdit: true,
  showDelete: true,
  rowKey: '_subTableRowKey',
});

const SubTableRowModal = defineAsyncComponent(
  () => import('./sub-table-row-modal.vue'),
);

const modelValue = defineModel<Recordable<any>[]>('value', {
  default: () => [],
});

/** 从表单 fieldName 绑定的 defaultValue 中缓存的新增行默认值 */
const rowDefaults = ref<Recordable<any>>({});

const modalRef =
  useTemplateRef<InstanceType<typeof SubTableRowModal>>('modalRef');
const selectedRowKeys = ref<string[]>([]);
/** 弹框确认时写入的行索引（与表格勾选无关） */
const modalEditingIndexes = ref<number[]>([]);

let rowKeySeed = 0;

const columnMap = computed(() => {
  const map = new Map<string, SubTableColumnSchema>();
  props.columns.forEach((col) => map.set(col.fieldName, col));
  return map;
});

const tableColumns = computed(() =>
  props.columns.map((col) => ({
    dataIndex: col.fieldName,
    key: col.fieldName,
    title: typeof col.label === 'string' ? col.label : '',
    width: col.width,
  })),
);

const canBatchOperate = computed(
  () => !props.disabled && selectedRowKeys.value.length > 0,
);

const rowSelectionConfig = computed(() => {
  if (!props.rowSelection) {
    return undefined;
  }
  return {
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: string[]) => {
      selectedRowKeys.value = keys;
    },
  };
});

const scrollConfig = computed(() =>
  props.maxHeight ? { y: props.maxHeight } : undefined,
);

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

    // 从表单 defaultValue 解析 __defaultRow 配置行
    const defaults = extractRowDefaultsFromRows(rows, props.columns);
    if (Object.keys(defaults).length > 0) {
      rowDefaults.value = defaults;
    }

    // 剔除默认配置行，仅展示业务数据
    const dataRows = filterDataRows(rows);
    const normalized = normalizeRows(dataRows);
    const changed =
      dataRows.length !== rows.length ||
      normalized.some(
        (row, index) => row[props.rowKey] !== dataRows[index]?.[props.rowKey],
      );
    if (changed) {
      modelValue.value = normalized;
    }
  },
  { deep: true, immediate: true },
);

/** 新增行：默认值来自父表单 fieldName 对应的 defaultValue */
function createEmptyRow() {
  const row: Recordable<any> = { ...rowDefaults.value };
  ensureRowKey(row);
  return row;
}

function addRow() {
  modelValue.value = [...(modelValue.value ?? []), createEmptyRow()];
}

function getSelectedIndexes() {
  const selectedKeys = new Set(selectedRowKeys.value);
  return (modelValue.value ?? [])
    .map((row, index) => (selectedKeys.has(row[props.rowKey]) ? index : -1))
    .filter((index) => index >= 0);
}

function deleteSelectedRows() {
  const selectedKeys = new Set(selectedRowKeys.value);
  modelValue.value = (modelValue.value ?? []).filter(
    (row) => !selectedKeys.has(row[props.rowKey]),
  );
  selectedRowKeys.value = [];
}

function clearModalEditingIndexes() {
  modalEditingIndexes.value = [];
}

function onModalConfirm(values: Recordable<any>) {
  const indexes = modalEditingIndexes.value;
  if (indexes.length === 0) {
    return;
  }
  const list = [...(modelValue.value ?? [])];
  const isBatch = indexes.length > 1;
  indexes.forEach((index) => {
    const originKey = list[index]?.[props.rowKey];
    const merged = { ...list[index] };
    Object.entries(values).forEach(([key, value]) => {
      if (!isBatch) {
        merged[key] = value;
        return;
      }
      // 批量编辑：留空字段不覆盖
      if (value !== undefined && value !== null && value !== '') {
        merged[key] = value;
      }
    });
    merged[props.rowKey] = originKey;
    list[index] = merged;
  });
  modelValue.value = list;
  clearModalEditingIndexes();
}

function handleBatchEdit() {
  if (!props.modalEdit || props.disabled) {
    return;
  }
  const indexes = getSelectedIndexes();
  if (indexes.length === 0) {
    return;
  }
  const firstIndex = indexes[0]!;
  modalEditingIndexes.value = indexes;
  modalRef.value?.open(modelValue.value![firstIndex]!, indexes);
}

function onCellChange(index: number, field: string, value: any) {
  const list = [...(modelValue.value ?? [])];
  const originKey = list[index]?.[props.rowKey];
  list[index] = { ...list[index], [field]: value, [props.rowKey]: originKey };
  modelValue.value = list;
}

function isColumnInlineEditable(col: SubTableColumnSchema) {
  return props.inlineEdit && !props.disabled && col.editable !== false;
}
</script>

<template>
  <div class="sub-table w-full">
    <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
      <span v-if="rowSelection" class="text-muted-foreground text-sm">
        {{ $t('ui.subTable.selectedCount', [selectedRowKeys.length]) }}
      </span>
      <div class="flex flex-wrap items-center gap-2">
        <Button v-if="showAdd && !disabled" type="primary" @click="addRow">
          <IconifyIcon class="mr-1 size-4" icon="lucide:plus" />
          {{ $t('ui.actionTitle.create', ['']) }}
        </Button>
        <Button
          v-if="modalEdit && showEdit"
          :disabled="!canBatchOperate"
          @click="handleBatchEdit"
        >
          <IconifyIcon class="mr-1 size-4" icon="lucide:pencil" />
          {{ $t('common.edit') }}
        </Button>
        <Popconfirm
          v-if="showDelete"
          :disabled="!canBatchOperate"
          :title="$t('ui.actionMessage.deleteConfirm', [''])"
          @confirm="deleteSelectedRows"
        >
          <Button :disabled="!canBatchOperate" danger>
            <IconifyIcon class="mr-1 size-4" icon="lucide:trash-2" />
            {{ $t('common.delete') }}
          </Button>
        </Popconfirm>
      </div>
    </div>

    <Table
      :columns="tableColumns"
      :data-source="modelValue"
      :pagination="false"
      :row-key="rowKey"
      :row-selection="rowSelectionConfig"
      :scroll="scrollConfig"
      bordered
      size="small"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="columnMap.get(String(column.key))">
          <SubTableCell
            v-if="isColumnInlineEditable(columnMap.get(String(column.key))!)"
            :column="columnMap.get(String(column.key))!"
            :disabled="disabled"
            :index="index"
            :row="record"
            @change="(field, value) => onCellChange(index, field, value)"
          />
          <SubTableDisplay
            v-else
            :column="columnMap.get(String(column.key))!"
            :row="record"
          />
        </template>
      </template>
    </Table>

    <SubTableRowModal
      v-if="modalEdit"
      ref="modalRef"
      :columns="columns"
      :modal-title="modalTitle"
      @close="clearModalEditingIndexes"
      @confirm="onModalConfirm"
    />
  </div>
</template>
