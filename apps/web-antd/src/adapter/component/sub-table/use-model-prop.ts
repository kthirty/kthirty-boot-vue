import { isString } from '@vben/utils';

/** 与 adapter/form.ts 中的 modelPropNameMap 保持一致 */
const MODEL_PROP_NAME_MAP: Record<string, string> = {
  Checkbox: 'checked',
  Radio: 'checked',
  Switch: 'checked',
  Upload: 'fileList',
};

const BASE_MODEL_PROP_NAME = 'value';

export function getModelPropName(component?: string): string {
  if (component && isString(component)) {
    return MODEL_PROP_NAME_MAP[component] ?? BASE_MODEL_PROP_NAME;
  }
  return BASE_MODEL_PROP_NAME;
}

export function createModelBind(
  component: string | undefined,
  value: any,
  onUpdate: (val: any) => void,
) {
  const propName = getModelPropName(component);
  return {
    [propName]: value,
    [`onUpdate:${propName}`]: onUpdate,
  };
}
