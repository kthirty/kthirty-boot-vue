import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemUserApi } from '#/api/system/user';

import { z } from '@vben/common-ui';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
    },
    {
      component: 'Input',
      fieldName: 'realName',
      label: $t('system.user.realName'),
    },
  ];
}
export function useColumns<T = SystemUserApi.SystemUser>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'code',
      title: $t('system.user.code'),
    },
    {
      field: 'username',
      title: $t('system.user.username'),
    },
    {
      field: 'realName',
      title: $t('system.user.realName'),
    },
    {
      field: 'email',
      title: $t('system.user.email'),
    },
    {
      field: 'phone',
      title: $t('system.user.phone'),
    },
    {
      field: 'roleName',
      title: $t('system.user.roleName'),
    },
    {
      field: 'deptName',
      title: $t('system.user.deptName'),
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.user.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.user.operation'),
      width: 130,
    },
  ];
}

export function useFormSchema(
  validateRepeatPassword: (value: string) => Promise<boolean>,
): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'realName',
      label: $t('system.user.realName'),
      rules: 'required',
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: $t('system.user.password'),
    },
    {
      component: 'InputPassword',
      fieldName: 'repeatPassword',
      label: $t('system.user.repeatPassword'),
      rules: z
        .string()
        .refine(async (value) => await validateRepeatPassword(value), {
          message: '两次输入的密码不一致',
        }),
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.user.email'),
      rules: z.string().email({ message: '请输入正确的邮箱地址' }),
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('system.user.phone'),
    },
    {
      component: 'DatePicker',
      fieldName: 'birthday',
      label: $t('system.user.birthday'),
    },
    {
      component: 'Select',
      fieldName: 'sex',
      label: $t('system.user.sex'),
      componentProps: {
        options: [
          { label: '男', value: '1' },
          { label: '女', value: '2' },
        ],
      },
    },
  ];
}
