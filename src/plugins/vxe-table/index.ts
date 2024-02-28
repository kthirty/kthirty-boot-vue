import { type App } from "vue"
// https://vxetable.cn/#/table/start/install
import VXETable from "vxe-table"
// https://github.com/x-extends/vxe-table-plugin-element
import VXETablePluginElement from "vxe-table-plugin-element"

VXETable.use(VXETablePluginElement)

import "./setup"
import "./renderer"

export function loadVxeTable(app: App) {
  /** Vxe Table 组件完整引入 */
  app.use(VXETable)
}
