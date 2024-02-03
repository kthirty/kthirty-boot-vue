<script lang="ts" setup>
import { nextTick, reactive, ref } from "vue"
import { getPage, type Menu } from "./menu.api"
import {
  type VxeFormInstance,
  type VxeFormProps,
  type VxeGridInstance,
  type VxeGridProps,
  type VxeModalInstance,
  type VxeModalProps
} from "vxe-table"
import { ElMessage, ElMessageBox, type ElMessageBoxOptions } from "element-plus"
import VxeCurd from "@/components/VxeCurd/index.vue"

defineOptions({ name: "sys-menu" })

const tableData = ref<Menu[]>()

getPage({}).then((res) => {
  tableData.value = res.data.records
  console.log(tableData.value)
})

const xGridDom = ref<VxeGridInstance>()

const xFormDom = ref<VxeFormInstance>()
const xFormOpt: VxeFormProps = reactive({
  span: 24,
  titleWidth: "100px",
  loading: false,
  /** 是否显示标题冒号 */
  titleColon: false,
  /** 表单数据 */
  data: {
    username: "",
    password: ""
  },
  /** 项列表 */
  items: [
    {
      field: "username",
      title: "用户名",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      field: "password",
      title: "密码",
      itemRender: { name: "$input", props: { placeholder: "请输入" } }
    },
    {
      align: "right",
      itemRender: {
        name: "$buttons",
        children: [
          { props: { content: "取消" }, events: { click: () => xModalDom.value?.close() } },
          {
            props: { type: "submit", content: "确定", status: "primary" },
            events: { click: () => crudStore.onSubmitForm() }
          }
        ]
      }
    }
  ],
  /** 校验规则 */
  rules: {
    username: [
      {
        required: true,
        validator: ({ itemValue }) => {
          switch (true) {
            case !itemValue:
              return new Error("请输入")
            case !itemValue.trim():
              return new Error("空格无效")
          }
        }
      }
    ],
    password: [
      {
        required: true,
        validator: ({ itemValue }) => {
          switch (true) {
            case !itemValue:
              return new Error("请输入")
            case !itemValue.trim():
              return new Error("空格无效")
          }
        }
      }
    ]
  }
})
const xModalDom = ref<VxeModalInstance>()
const xModalOpt: VxeModalProps = reactive({
  title: "",
  beforeHideMethod: () => {
    xFormDom.value?.clearValidate()
    return Promise.resolve()
  }
})
const xGridOpt: VxeGridProps = reactive({
  loading: true,
  autoResize: true,
  pagerConfig: {},
  formConfig: {
    items: [
      {
        field: "name",
        itemRender: {
          name: "$input",
          props: { placeholder: "名称", clearable: true }
        }
      },
      {
        field: "code",
        itemRender: {
          name: "$input",
          props: { placeholder: "代码", readonly: true }
        }
      },
      {
        itemRender: {
          name: "$buttons",
          children: [
            {
              props: { type: "submit", content: "查询", status: "primary" }
            },
            {
              props: { type: "reset", content: "重置" }
            }
          ]
        }
      }
    ]
  },
  treeConfig: {
    transform: true
  },
  /** 工具栏配置 */
  toolbarConfig: {
    refresh: true,
    custom: true,
    slots: { buttons: "toolbar-btns" }
  },
  /** 列配置 */
  columns: [
    {
      field: "code",
      title: "编码",
      treeNode: true
    },
    {
      field: "name",
      title: "名称"
    },
    {
      field: "path",
      title: "路径"
    },
    {
      field: "createDate",
      title: "创建时间"
    },
    {
      title: "操作",
      slots: { default: "operate" }
    }
  ],
  /** 数据代理配置项（基于 Promise API） */
  proxyConfig: {
    /** 是否代理表单 */
    form: true,
    /** 是否自动加载，默认为 true */
    // autoLoad: false,
    props: {
      total: "total"
    },
    ajax: {
      query: ({ page, form }) => {
        xGridOpt.loading = true
        crudStore.clearTable()
        return new Promise((resolve) => {
          let total = 0
          let result: Menu[] = []
          /** 加载数据 */
          const callback = (res: any) => {
            if (res?.data) {
              // 总数
              total = res.data.totalRow
              // 列表数据
              result = res.data.records
            }
            xGridOpt.loading = false
            // 返回值有格式要求，详情见 vxe-table 官方文档
            resolve({ total, result })
          }

          /** 接口需要的参数 */
          const params = {
            username: form.username || undefined,
            phone: form.phone || undefined,
            size: page.pageSize,
            currentPage: page.currentPage
          }
          /** 调用接口 */
          getPage(params).then(callback).catch(callback)
        })
      }
    }
  }
})
const crudStore = reactive({
  /** 表单类型，true 表示修改，false 表示新增 */
  isUpdate: true,
  /** 加载表格数据 */
  commitQuery: () => xGridDom.value?.commitProxy("query"),
  /** 清空表格数据 */
  clearTable: () => xGridDom.value?.reloadData([]),
  /** 点击显示弹窗 */
  onShowModal: (row?: Menu) => {
    if (row) {
      crudStore.isUpdate = true
      xModalOpt.title = "修改用户"
      // 赋值
      xFormOpt.data.username = row.name
    } else {
      crudStore.isUpdate = false
      xModalOpt.title = "新增用户"
    }
    // 禁用表单项
    const props = xFormOpt.items?.[0]?.itemRender?.props
    props && (props.disabled = crudStore.isUpdate)
    xModalDom.value?.open()
    nextTick(() => {
      !crudStore.isUpdate && xFormDom.value?.reset()
      xFormDom.value?.clearValidate()
    })
  },
  /** 确定并保存 */
  onSubmitForm: () => {
    if (xFormOpt.loading) return
    xFormDom.value?.validate((errMap) => {
      if (errMap) return
      xFormOpt.loading = true
      const callback = () => {
        xFormOpt.loading = false
        xModalDom.value?.close()
        ElMessage.success("操作成功")
        !crudStore.isUpdate && crudStore.afterInsert()
        crudStore.commitQuery()
      }
      if (crudStore.isUpdate) {
        // 模拟调用修改接口成功
        setTimeout(() => callback(), 1000)
      } else {
        // 模拟调用新增接口成功
        setTimeout(() => callback(), 1000)
      }
    })
  },
  /** 新增后是否跳入最后一页 */
  afterInsert: () => {
    const pager = xGridDom.value?.getProxyInfo()?.pager
    if (pager) {
      const currentTotal = pager.currentPage * pager.pageSize
      if (currentTotal === pager.total) {
        ++pager.currentPage
      }
    }
  },
  /** 删除 */
  onDelete: (row: any) => {
    const tip = `确定 <strong style="color: red"> 删除 </strong> 用户 <strong style="color: #409eff"> ${row.username} </strong> ？`
    const config: ElMessageBoxOptions = {
      type: "warning",
      showClose: true,
      closeOnClickModal: true,
      closeOnPressEscape: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    }
    ElMessageBox.confirm(tip, "提示", config).then(() => {
      // deleteTableDataApi(row.id).then(() => {
      //   ElMessage.success("删除成功")
      //   crudStore.afterDelete()
      //   crudStore.commitQuery()
      // })
    })
  },
  /** 删除后是否返回上一页 */
  afterDelete: () => {
    const tableData: Menu[] = xGridDom.value!.getData()
    const pager = xGridDom.value?.getProxyInfo()?.pager
    if (pager && pager.currentPage > 1 && tableData.length === 1) {
      --pager.currentPage
    }
  }
})
</script>
<template lang="pug">
div(class='app-container')
  vxe-grid(ref="xGridDom" v-bind="xGridOpt")
    template(v-slot:toolbar-btns)
      vxe-button 新增用户
      vxe-button 批量删除
    template(v-slot:operate="{row}")
      el-button(link @click="crudStore.onShowModal(row)") 编辑
      el-button(link @click='crudStore.onDelete(row)') 删除
  vxe-modal(v-bind='xModalOpt' ref="xModalDom")
    vxe-form(ref="xFormDom" v-bind="xFormOpt")/
</template>
