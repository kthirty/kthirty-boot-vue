import type { Component } from 'vue';

import { defineAsyncComponent } from 'vue';

const formModules = import.meta.glob('../forms/**/*.vue');

function normalizeFormKey(formKey: string) {
  return formKey
    .replace(/^\/+/, '')
    .replace(/^views\//, '')
    .replace(/^flowable\/forms\//, '')
    .replace(/\.vue$/, '');
}

/**
 * 根据 BPMN 节点 formKey 动态加载业务表单组件。
 * formKey 对应 views/flowable/task/forms 目录下的相对路径，如 demo、leave/apply。
 */
export function getFormComponent(formKey?: string): Component | null {
  if (!formKey) {
    return null;
  }

  const normalizedKey = normalizeFormKey(formKey);

  for (const [path, loader] of Object.entries(formModules)) {
    const relativePath = path
      .replace(/^\.\.\/forms\//, '')
      .replace(/\.vue$/, '');

    if (relativePath === normalizedKey) {
      return defineAsyncComponent(
        loader as () => Promise<{ default: Component }>,
      );
    }
  }

  return null;
}
