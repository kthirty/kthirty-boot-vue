import type { DefaultOptionType } from 'ant-design-vue/es/select';
import type { ColumnType } from 'ant-design-vue/es/table';

import type { DevFormApi } from './api';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import { FormItem, Input, Select, Switch } from 'ant-design-vue';

import { z } from '#/adapter/form';
import { $t } from '#/locales';
import { useDictStore } from '#/store';

import { isTableNameExists } from './api';
import {
  dbTypeToComponent,
  dbTypeToFieldType,
  fieldAttributeOptions,
  fieldTypeOptions,
  formComponentOptions,
} from './options';

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'tableName',
      label: $t('develop.form.tableName'),
      component: 'Input',
    },
  ];
}

export function useFormColumns(
  onActionClick: OnActionClickFn<any>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'tableName',
      title: $t('develop.form.tableName'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'tableTypeLabel',
      title: $t('develop.form.tableType'),
      minWidth: 100,
      align: 'left',
    },
    {
      field: 'listTypeLabel',
      title: $t('develop.form.listType'),
      minWidth: 100,
      align: 'left',
    },
    {
      field: 'isDbSyncLabel',
      title: $t('develop.form.isDbSync'),
      minWidth: 100,
      align: 'center',
    },
    {
      field: 'remarks',
      title: $t('develop.form.remarks'),
      minWidth: 120,
      align: 'left',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'tableName',
          nameTitle: $t('develop.form.title'),
          onClick: onActionClick,
        },
        options: [
          { code: 'edit', text: $t('common.edit') },
          { code: 'delete', text: $t('common.delete') },
          {
            code: 'more',
            children: [{ code: 'syncDb', text: $t('develop.option.syncDb') }],
          },
          /* {
            code: 'syncDb',
            text: $t('develop.option.syncDb'),
            disabled: (row: DevFormApi.Form) => {
              return row.isDbSync !== '0';
            },
          },*/
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.operation'),
      width: 160,
    },
  ];
}
const dictStore = useDictStore();

export function useFormSchema(id: any): VbenFormSchema[] {
  return [
    {
      fieldName: 'tableName',
      label: $t('develop.form.tableName'),
      component: 'Input',
      rules: z
        .string()
        .min(2, { message: '表名长度需在2-64个字符之间' })
        .max(64, { message: '表名长度需在2-64个字符之间' })
        .regex(/^[a-z_]\w*$/i, {
          message: '表名只能包含字母、数字和下划线，且不能以数字开头',
        })
        .nonempty({ message: `${$t('develop.form.tableName')}为必填项` })
        .refine(
          async (value: string) => {
            return !(await isTableNameExists(value, id.value));
          },
          (value) => ({
            message: $t('ui.formRules.alreadyExists', [
              $t('develop.form.tableName'),
              value,
            ]),
          }),
        ),
    },
    {
      fieldName: 'tableType',
      label: $t('develop.form.tableType'),
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: dictStore.getDict('dev_table_type'),
      },
    },
    {
      fieldName: 'listType',
      label: $t('develop.form.listType'),
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: dictStore.getDict('dev_list_type'),
      },
    },
    {
      fieldName: 'remarks',
      label: $t('develop.form.remarks'),
      component: 'Textarea',
    },
  ];
}

function getInputColumn(name: string) {
  return {
    title: $t(`develop.form.fields.${name}`),
    dataIndex: `${name}`,
    key: `${name}`,
    customRender: (opt: { index: number; record: DevFormApi.DevFormItem }) => {
      return h(
        FormItem,
        { name: `items[${opt.index}].${name}`, required: true },
        h(Input, {
          disabled: opt.record.disabled,
          value: opt.record[name],
          onChange: (e: any) => {
            opt.record[name] = e.target.value;
          },
        }),
      );
    },
  };
}
function getSwitchColumn(name: string) {
  return {
    title: $t(`develop.form.fields.${name}`),
    dataIndex: `${name}`,
    key: `${name}`,
    customRender: (opt: { record: DevFormApi.DevFormItem }) => {
      return h(Switch, {
        disabled: opt.record.disabled,
        checked: opt.record[name],
        onChange: (checked: any) => {
          opt.record[name] = checked;
        },
      });
    },
  };
}
function getSelectColumn(name: string, options: DefaultOptionType[]) {
  return {
    title: $t(`develop.form.fields.${name}`),
    dataIndex: `${name}`,
    key: `${name}`,
    customRender: (opt: { record: DevFormApi.DevFormItem }) => {
      return h(Select, {
        disabled: opt.record.disabled,
        value: opt.record[name],
        class: 'w-full',
        onChange: (e: any) => {
          opt.record[name] = e;
        },
        options,
      });
    },
  };
}
// 根据数据库字段类型，推断实体类型与界面显示组件
export function inferFieldTypeAndComponent(record: DevFormApi.DevFormItem) {
  const dbType = (record.columnType || '').toLowerCase();
  if (!record.fieldType || record.fieldType === '') {
    record.fieldType = dbTypeToFieldType[dbType] || 'String';
  }
  if (!record.formComponent || record.formComponent === '') {
    record.formComponent = dbTypeToComponent[dbType] || 'Input';
  }
  if (!record.queryComponent || record.queryComponent === '') {
    record.queryComponent = dbTypeToComponent[dbType] || 'Input';
  }
}

export function useDatabaseColumns(itemTypeOptions: DefaultOptionType[], dbTypeOptions: DefaultOptionType[]): ColumnType<DevFormApi.DevFormItem>[] {
  return [
    {
      title: $t('develop.form.fields.type'),
      dataIndex: 'type',
      key: 'type',
      customRender: (opt: { record: DevFormApi.DevFormItem }) => {
        const key = JSON.stringify({
          type: opt.record.columnType,
          length: +(opt.record.columnLength || -1),
          decimalLength: +(opt.record.columnPointLength || -1),
        });

        return h(Select, {
          value: itemTypeOptions.some((it) => it.value === key) ? key : '',
          class: 'w-full',
          showSearch: true,
          filterOption: (input, option) => {
            return (
              option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
          },
          onChange: (e: any) => {
            opt.record.type = e;
            const obj = JSON.parse(e);
            opt.record.columnType = obj.type;
            opt.record.columnLength = obj.length === -1 ? '' : obj.length;
            opt.record.columnPointLength =
              obj.decimalLength === -1 ? '' : obj.decimalLength;
            inferFieldTypeAndComponent(opt.record);
          },
          options: itemTypeOptions,
        });
      },
    },
    getInputColumn('columnName'),
    getSelectColumn('columnType', dbTypeOptions),
    getInputColumn('columnLength'),
    getInputColumn('columnPointLength'),
    getInputColumn('columnDefaultVal'),
    getInputColumn('columnRemarks'),
  ];
}
export function useEntityColumns(): ColumnType<DevFormApi.DevFormItem>[] {
  return [
    getSelectColumn('fieldType', fieldTypeOptions),
    getSelectColumn('fieldAttribute', fieldAttributeOptions),
    getInputColumn('dictCode'),
  ];
}
export function usePageColumns(): ColumnType<DevFormApi.DevFormItem>[] {
  return [
    getSelectColumn('formComponent', formComponentOptions),
    getInputColumn('weight'),
    getSelectColumn('queryComponent', formComponentOptions),
    getSwitchColumn('formRequired'),
    getSwitchColumn('isShowQuery'),
    getSwitchColumn('isShowForm'),
    getSwitchColumn('isShowList'),
    getSwitchColumn('isAllowSort'),
  ];
}
export function useExtraColumns(): ColumnType<DevFormApi.DevFormItem>[] {
  return [
    getSwitchColumn('columnNullable'),
    getInputColumn('formRegexp'),
    getSwitchColumn('isReadonly'),
  ];
}
export function useForeignKeyColumns(): ColumnType<DevFormApi.DevFormItem>[] {
  return [
    getInputColumn('foreignKeyMainTable'),
    getInputColumn('foreignKeyMainColumn'),
  ];
}
export function useIndexColumns(): ColumnType<DevFormApi.DevFormItem>[] {
  return [];
}

export function useInitItems(): DevFormApi.DevFormItem[] {
  const id = Date.now().toString();
  const res: DevFormApi.DevFormItem[] = [
    {
      id: `${id}_id`,
      columnName: 'id',
      columnType: 'varchar',
      columnLength: 32,
      fieldType: 'String',
      fieldAttribute: '2',
      columnNullable: true,
      weight: 0,
    },
    {
      id: `${id}_create_by`,
      columnName: 'create_by',
      columnType: 'varchar',
      columnLength: 32,
      fieldType: 'String',
      fieldAttribute: '1',
      columnNullable: true,
      weight: 0,
    },
    {
      id: `${id}_update_by`,
      columnName: 'update_by',
      columnType: 'varchar',
      columnLength: 32,
      fieldType: 'String',
      fieldAttribute: '1',
      columnNullable: true,
      weight: 0,
    },
    {
      id: `${id}_create_date`,
      columnName: 'create_date',
      columnType: 'timestamp',
      columnLength: 3,
      fieldType: 'Date',
      fieldAttribute: '1',
      columnNullable: true,
      weight: 0,
    },
    {
      id: `${id}_update_date`,
      columnName: 'update_date',
      columnType: 'timestamp',
      columnLength: 3,
      fieldType: 'Date',
      fieldAttribute: '1',
      columnNullable: true,
      weight: 0,
    },
  ];
  res.forEach((item) => {
    inferFieldTypeAndComponent(item);
  });
  return res;
}


export function useColumns(
  onActionClick: OnActionClickFn<DevFormApi.DevForm>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'tableName',
      title: $t('develop.form.tableName'),
      minWidth: 140,
    },
    {
      field: 'remarks',
      title: $t('develop.form.remarks'),
      minWidth: 160,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: dictStore.getDict('dev_table_type'),
      },
      field: 'tableType',
      title: $t('develop.form.tableType'),
      width: 100,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: dictStore.getDict('dev_list_type'),
      },
      field: 'listType',
      title: $t('develop.form.listType'),
      width: 110,
    },
    {
      cellRender: { name: 'CellTag', options: dictStore.getDict('whether') },
      field: 'isDbSync',
      title: $t('develop.form.isDbSync'),
      width: 110,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'tableName',
          nameTitle: $t('develop.form.title'),
          onClick: onActionClick,
        },
        options: [
          { code: 'data', text: $t('develop.form.button.data') },
          { code: 'syncDb', text: $t('develop.form.button.syncDb') },
          {
            code: 'generateCode',
            text: $t('develop.form.button.generateCode'),
          },
          'edit',
          'delete',
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('develop.form.operation'),
      width: 350,
    },
  ];
}
