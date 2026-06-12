
import type { VxeUIExport} from '#/adapter/vxe-table';
import {$t, $te} from "@vben/locales";
import type { Recordable } from '@vben/types';
import {h} from "vue";
import {isFunction, isString} from "@vben/utils";
import {Button, Popconfirm, Switch} from "ant-design-vue";
import { IconifyIcon } from '@vben/icons';

function addSwitch(vxeUI:VxeUIExport) {
  vxeUI.renderer.add('CellSwitch', {
    renderTableDefault({attrs, props}, {column, row}) {
      const loadingKey = `__loading_${column.field}`;
      const finallyProps = {
        checkedChildren: $t('common.enabled'),
        checkedValue: '1',
        unCheckedChildren: $t('common.disabled'),
        unCheckedValue: '0',
        ...props,
        checked: row[column.field],
        loading: row[loadingKey] ?? false,
        'onUpdate:checked': onChange,
      };

      async function onChange(newVal: any) {
        row[loadingKey] = true;
        try {
          const result = await attrs?.beforeChange?.(newVal, row);
          if (result !== false) {
            row[column.field] = newVal;
          }
        } finally {
          row[loadingKey] = false;
        }
      }

      return h(Switch, finallyProps);
    },
  });
}

function addCellOperation(vxeUI:VxeUIExport) {
  /**
   * 注册表格的操作按钮渲染器
   */
  vxeUI.renderer.add('CellOperation', {
    renderTableDefault({attrs, options, props}, {column, row}) {
      const defaultProps = {size: 'small', type: 'link', ...props};
      let align: string;
      switch (column.align) {
        case 'center': {
          align = 'center';
          break;
        }
        case 'left': {
          align = 'start';
          break;
        }
        default: {
          align = 'end';
          break;
        }
      }
      const presets: Recordable<Recordable<any>> = {
        delete: {
          danger: true,
          text: $t('common.delete'),
        },
        edit: {
          text: $t('common.edit'),
        },
      };
      const operations: Array<Recordable<any>> = (
        options || ['edit', 'delete']
      )
        .map((opt) => {
          if (isString(opt)) {
            return presets[opt]
              ? {code: opt, ...presets[opt], ...defaultProps}
              : {
                code: opt,
                text: $te(`common.${opt}`) ? $t(`common.${opt}`) : opt,
                ...defaultProps,
              };
          } else {
            return {...defaultProps, ...presets[opt.code], ...opt};
          }
        })
        .map((opt) => {
          const optBtn: Recordable<any> = {};
          Object.keys(opt).forEach((key) => {
            optBtn[key] = isFunction(opt[key]) ? opt[key](row) : opt[key];
          });
          return optBtn;
        })
        .filter((opt) => opt.show !== false);

      function renderBtn(opt: Recordable<any>, listen = true) {
        return h(
          Button,
          {
            ...props,
            ...opt,
            icon: undefined,
            onClick: listen
              ? () =>
                attrs?.onClick?.({
                  code: opt.code,
                  row,
                })
              : undefined,
          },
          {
            default: () => {
              const content = [];
              if (opt.icon) {
                content.push(
                  h(IconifyIcon, {class: 'size-5', icon: opt.icon}),
                );
              }
              content.push(opt.text);
              return content;
            },
          },
        );
      }

      function renderConfirm(opt: Recordable<any>) {
        let viewportWrapper: HTMLElement | null = null;
        return h(
          Popconfirm,
          {
            /**
             * 当popconfirm用在固定列中时，将固定列作为弹窗的容器时可能会因为固定列较窄而无法容纳弹窗
             * 将表格主体区域作为弹窗容器时又会因为固定列的层级较高而遮挡弹窗
             * 将body或者表格视口区域作为弹窗容器时又会导致弹窗无法跟随表格滚动。
             * 鉴于以上各种情况，一种折中的解决方案是弹出层展示时，禁止操作表格的滚动条。
             * 这样既解决了弹窗的遮挡问题，又不至于让弹窗随着表格的滚动而跑出视口区域。
             */
            getPopupContainer(el) {
              viewportWrapper = el.closest('.vxe-table--viewport-wrapper');
              return document.body;
            },
            placement: 'topLeft',
            title: $t('ui.actionTitle.delete', [attrs?.nameTitle || '']),
            ...props,
            ...opt,
            icon: undefined,
            onOpenChange: (open: boolean) => {
              // 当弹窗打开时，禁止表格的滚动
              if (open) {
                viewportWrapper?.style.setProperty('pointer-events', 'none');
              } else {
                viewportWrapper?.style.removeProperty('pointer-events');
              }
            },
            onConfirm: () => {
              attrs?.onClick?.({
                code: opt.code,
                row,
              });
            },
          },
          {
            default: () => renderBtn({...opt}, false),
            description: () =>
              h(
                'div',
                {class: 'truncate'},
                $t('ui.actionMessage.deleteConfirm', [
                  row[attrs?.nameField || 'name'],
                ]),
              ),
          },
        );
      }

      const btns = operations.map((opt) =>
        opt.code === 'delete' ? renderConfirm(opt) : renderBtn(opt),
      );
      return h(
        'div',
        {
          class: 'flex table-operations',
          style: {justifyContent: align},
        },
        btns,
      );
    },
  });
}

export function addRenderer(vxeUI: VxeUIExport){
  /**
   * 解决vxeTable在热更新时可能会出错的问题
   */
  vxeUI.renderer.forEach((_item, key) => {
    if (key.startsWith('Cell')) {
      vxeUI.renderer.delete(key);
    }
  });
  addSwitch(vxeUI);
  addCellOperation(vxeUI);
}


