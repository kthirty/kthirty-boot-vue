<template>
  <div>
    <vxe-curd :api="api" :items="items" :option="option" />
    <el-drawer :title="drawer.title" v-model="drawer.visible">
      <vxe-table
        ref="xTreeRef"
        show-overflow
        :row-config="{ keyField: 'id' }"
        :show-header="false"
        :tree-config="{ expandAll: true, transform: true, rowField: 'id', parentField: 'parentId' }"
        :checkbox-config="drawer.config"
        :data="drawer.menus"
      >
        <vxe-column type="checkbox" tree-node align="left" />
      </vxe-table>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer.visible = false">取消</el-button>
          <el-button type="primary" @click="drawer.submit">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import VxeCurd from "@/components/VxeCurd/index.vue"
import { Api, CrudItem, VxeCrudOptions } from "@/components/VxeCurd/types"
import { VxeCurdProps } from "@/components/VxeCurd/helper"
import { reactive, ref } from "vue"
import { VxeTableInstance } from "vxe-table"
import { ElNotification } from "element-plus"
import { queryHasMenus, saveConfigMenus } from "@/views/sys/role/role.api"
import { queryAllMenus } from "@/views/sys/menu/menu.api"

const api: Api = new Api("/sys/role")

const items: CrudItem[] = reactive([
  { field: "code", title: "代码", column: { treeNode: true }, search: "input" },
  { field: "name", title: "角色名", column: true, search: "input", form: "input" },
  { field: "enName", title: "角色英文名", column: true, form: "input" }
])

const xTreeRef = ref<VxeTableInstance<any>>()
const drawer = reactive({
  visible: false,
  title: "",
  role: {},
  open: async (row: any) => {
    drawer.title = `“${row.name}”权限配置`
    drawer.role = row
    const { data: allMenus } = await queryAllMenus()
    drawer.menus = allMenus
    const { data: hasMenus } = await queryHasMenus(row.id)
    drawer.config.checkRowKeys = hasMenus
    drawer.visible = true
  },
  submit: () => {
    const arr = xTreeRef.value?.getCheckboxRecords()?.map((it) => it.id) || []
    saveConfigMenus(drawer.role.id, arr).then(({ success }) => {
      if (success) {
        ElNotification.success("保存成功")
        drawer.visible = false
      }
    })
  },
  menus: [],
  config: { labelField: "name", checkRowKeys: [], checkStrictly: true }
})

const option: VxeCrudOptions = reactive({
  action: [...VxeCurdProps.DefaultAction, { icon: "vxe-icon-setting", onClick: ({ row }) => drawer.open(row) }],
  formAction: VxeCurdProps.DefaultFormAction,
  grid: {
    treeConfig: {
      transform: true
    }
  }
})
</script>
