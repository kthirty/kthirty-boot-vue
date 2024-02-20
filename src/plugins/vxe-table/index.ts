import { type App } from "vue"
// https://vxetable.cn/#/table/start/install
import VXETable from "vxe-table"
// https://github.com/x-extends/vxe-table-plugin-element
import VXETablePluginElement from "vxe-table-plugin-element"

VXETable.use(VXETablePluginElement)

/** 全局默认参数 */
VXETable.setup({
  /** 全局尺寸 */
  size: "medium",
  /** 全局 zIndex 起始值，如果项目的的 z-index 样式值过大时就需要跟随设置更大，避免被遮挡 */
  zIndex: 9999,
  /** 版本号，对于某些带数据缓存的功能有用到，上升版本号可以用于重置数据 */
  version: 0,
  /** 全局 loading 提示内容，如果为 null 则不显示文本 */
  loadingText: null,
  table: {
    showHeader: true,
    showOverflow: "tooltip",
    showHeaderOverflow: "tooltip",
    autoResize: true,
    // stripe: false,
    border: "inner",
    // round: false,
    emptyText: "暂无数据",
    rowConfig: {
      isHover: true,
      isCurrent: true,
      keyField: "_VXE_ID"
    },
    columnConfig: {
      resizable: false
    },
    align: "center",
    headerAlign: "center"
  },
  grid: {
    loading: true,
    border: true,
    showFooter: true,
    pagerConfig: {
      enabled: true
    },
    toolbarConfig: {
      refresh: true, // 显示刷新按钮
      import: true, // 显示导入按钮
      export: true, // 显示导出按钮
      print: true, // 显示打印按钮
      zoom: true, // 显示全屏按钮
      custom: true // 显示自定义列按钮
    },
    printConfig: {},
    columns: [],
    treeConfig: {
      transform: false,
      rowField: "id",
      parentField: "parentId"
      //childrenField: "children"
    },
    footerMethod: () => {
      return []
    },
    rowConfig: {
      isCurrent: false,
      isHover: true
    },
    proxyConfig: {
      seq: true,
      form: true,
      autoload: true,
      props: {
        result: "records",
        total: "totalRow",
        message: ""
      }
    }
  },
  pager: {
    // size: "medium",
    /** 配套的样式 */
    perfect: false,
    pageSize: 10,
    pagerCount: 7,
    pageSizes: [10, 20, 50, 100, 300, 500, 1000],
    layouts: ["Total", "PrevJump", "PrevPage", "Number", "NextPage", "NextJump", "Sizes", "FullJump"]
  },
  modal: {
    escClosable: true,
    showClose: true,
    showZoom: true,
    minWidth: 500,
    height: 400,
    lockView: true,
    mask: true,
    // duration: 3000,
    // marginSize: 20,
    dblclickZoom: false,
    showTitleOverflow: true,
    transfer: true,
    draggable: true
  }
})

export function loadVxeTable(app: App) {
  /** Vxe Table 组件完整引入 */
  app.use(VXETable)
}
