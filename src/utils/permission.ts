import { usePermissionStoreHook } from "@/store/modules/permission"

/** 全局权限判断函数，和权限指令 v-permission 功能类似 */
export const checkPermission = (permissionArr: string[]): boolean => {
  if (Array.isArray(permissionArr) && permissionArr.length > 0) {
    const { permissions } = usePermissionStoreHook()
    return permissions.some((p) => permissionArr.includes(p))
  } else {
    console.error(`need permissions! Like v-permission="['sys:admin:show','sys:admin:manager']"`)
    return false
  }
}
