import type { DefaultOptionType } from 'ant-design-vue/es/select';
import type { ColumnType } from 'ant-design-vue/es/table';

import type { Ref } from 'vue';

import type { DevReportApi } from './api';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  Select,
} from 'ant-design-vue';

import { z } from '#/adapter/form';
import { $t } from '#/locales';
import { useDictStore } from '#/store';

import { codeExists } from './api';
import {
  fieldTypeOptions,
  listComponentOptions,
  queryComponentOptions,
} from './options';

/** 列表查询表单 */
export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'code',
      label: $t('develop.report.code'),
      component: 'Input',
    },
    {
      fieldName: 'name',
      label: $t('develop.report.name'),
      component: 'Input',
    },
  ];
}

/** 列表表格列 */
export function useColumns(
  onActionClick: OnActionClickFn<DevReportApi.DevReport>,
): VxeTableGridOptions['columns'] {
  const dictStore = useDictStore();
  return [
    {
      field: 'code',
      title: $t('develop.report.code'),
      minWidth: 140,
    },
    {
      field: 'name',
      title: $t('develop.report.name'),
      minWidth: 160,
    },
    {
      field: 'dsKey',
      title: $t('develop.report.dsKey'),
      minWidth: 120,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: dictStore.getDict('whether'),
      },
      field: 'isPage',
      title: $t('develop.report.isPage'),
      width: 100,
    },
    {
      field: 'remarks',
      title: $t('develop.report.remarks'),
      minWidth: 160,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('develop.report.title'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          { code: 'preview', text: $t('develop.report.preview'), icon: 'lucide:eye' },
          'edit',
          'delete',
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.operation'),
      width: 200,
    },
  ];
}

/** 报表表单（主表） */
export function useFormSchema(
  id: Ref<string | undefined>,
  dsOptions: DefaultOptionType[] = [],
): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        disabled: !!id.value,
        placeholder: $t('develop.report.codePlaceholder'),
      },
      fieldName: 'code',
      label: $t('develop.report.code'),
      rules: z
        .string()
        .nonempty({ message: $t('develop.report.codeRequired') })
        .max(64, { message: $t('develop.report.codeLength') })
        .regex(/^[a-z_]\w*$/i, {
          message: $t('develop.report.codePattern'),
        })
        .refine(
          async (value) => !(await codeExists(value, id.value)),
          (value) => ({
            message: $t('develop.report.codeExists', [value]),
          }),
        ),
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('develop.report.name'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: dsOptions,
        placeholder: $t('develop.report.dsKeyPlaceholder'),
      },
      fieldName: 'dsKey',
      label: $t('develop.report.dsKey'),
      rules: 'selectRequired',
    },
    {
      component: 'Switch',
      componentProps: {
        checkedValue: '1',
        class: 'w-auto',
        unCheckedValue: '0',
      },
      defaultValue: '1',
      fieldName: 'isPage',
      label: $t('develop.report.isPage'),
    },
    {
      component: 'Textarea',
      componentProps: {
        rows: 6,
        placeholder: $t('develop.report.reportSqlPlaceholder'),
      },
      fieldName: 'reportSql',
      formItemClass: 'col-span-full',
      label: $t('develop.report.reportSql'),
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'remarks',
      formItemClass: 'col-span-full',
      label: $t('develop.report.remarks'),
    },
  ];
}

/** 字段配置 - 文本输入列 */
function getInputColumn(name: string, title: string, width = 130) {
  return {
    customRender: (opt: { record: Record<string, any> }) =>
      h(Input, {
        class: 'w-full',
        value: opt.record[name],
        'onUpdate:value': (value: any) => {
          opt.record[name] = value;
        },
      }),
    dataIndex: name,
    key: name,
    title,
    width,
  } as ColumnType<Record<string, any>>;
}

/** 字段配置 - 数字输入列 */
function getNumberColumn(name: string, title: string, width = 90) {
  return {
    customRender: (opt: { record: Record<string, any> }) =>
      h(InputNumber, {
        class: 'w-full',
        min: 0,
        value: opt.record[name],
        'onUpdate:value': (value: any) => {
          opt.record[name] = value;
        },
      }),
    dataIndex: name,
    key: name,
    title,
    width,
  } as ColumnType<Record<string, any>>;
}

/** 字段配置 - 下拉列 */
function getSelectColumn(
  name: string,
  title: string,
  options: DefaultOptionType[],
  width = 120,
) {
  return {
    customRender: (opt: { record: Record<string, any> }) =>
      h(Select, {
        class: 'w-full',
        options,
        value: opt.record[name],
        'onUpdate:value': (value: any) => {
          opt.record[name] = value;
        },
      }),
    dataIndex: name,
    key: name,
    title,
    width,
  } as ColumnType<Record<string, any>>;
}

/** 字段配置 - 开关列 */
function getCheckboxColumn(name: string, title: string, width = 70) {
  return {
    align: 'center' as const,
    customRender: (opt: { record: Record<string, any> }) =>
      h(Checkbox, {
        checked: opt.record[name] === '1' || opt.record[name] === true,
        'onUpdate:checked': (value: boolean) => {
          opt.record[name] = value ? '1' : '0';
        },
      }),
    dataIndex: name,
    key: name,
    title,
    width,
  } as ColumnType<Record<string, any>>;
}

/** 字段配置表格列 */
export function useReportItemColumns(onRemove: (index: number) => void) {
  return [
    {
      title: '#',
      width: 50,
      customRender: (opt: { index: number }) => opt.index + 1,
    },
    getInputColumn('columnName', $t('develop.report.fields.columnName')),
    getInputColumn('columnRemarks', $t('develop.report.fields.columnRemarks')),
    getSelectColumn(
      'fieldType',
      $t('develop.report.fields.fieldType'),
      fieldTypeOptions,
      110,
    ),
    getInputColumn('dictCode', $t('develop.report.fields.dictCode'), 120),
    getNumberColumn('weight', $t('develop.report.fields.weight'), 90),
    getCheckboxColumn('isShowList', $t('develop.report.fields.isShowList')),
    getCheckboxColumn('isShowQuery', $t('develop.report.fields.isShowQuery')),
    getCheckboxColumn('isAllowSort', $t('develop.report.fields.isAllowSort')),
    getSelectColumn(
      'queryComponent',
      $t('develop.report.fields.queryComponent'),
      queryComponentOptions,
      130,
    ),
    getSelectColumn(
      'listComponent',
      $t('develop.report.fields.listComponent'),
      listComponentOptions,
      110,
    ),
    {
      align: 'center' as const,
      fixed: 'right' as const,
      key: 'operation',
      title: $t('common.operation'),
      width: 80,
      customRender: (opt: { index: number }) =>
        h(
          Button,
          {
            danger: true,
            size: 'small',
            type: 'link',
            onClick: () => onRemove(opt.index),
          },
          () => $t('common.delete'),
        ),
    },
  ] as ColumnType<Record<string, any>>[];
}

