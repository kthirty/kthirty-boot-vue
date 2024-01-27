import { type Directive } from "vue"
import { usePermissionStore } from "@/store/modules/permission"

/** 权限指令，和权限判断函数 checkPermission 功能类似 */
export const permission: Directive = {
  mounted(el, binding) {
    const { value: permissionRoles } = binding
    const { permissions } = usePermissionStore()
    if (Array.isArray(permissionRoles) && permissionRoles.length > 0) {
      const hasPermission = permissions.some((p) => permissionRoles.includes(p))
      // hasPermission || (el.style.display = "none") // 隐藏
      hasPermission || el.parentNode?.removeChild(el) // 销毁
    } else {
      throw new Error(`need permissions! Like v-permission="['sys:admin:show','sys:admin:manager']"`)
    }
  }
}
