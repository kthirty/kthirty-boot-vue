import { ref } from 'vue';

import { defineStore } from 'pinia';

import { queryAllItem } from '#/api';

export interface DictItem {
  label: string;
  value: number | string;
  color?: string;
  [key: string]: any;
}

export interface DictData {
  [key: string]: DictItem[];
}

export const useDictStore = defineStore(
  'dict',
  () => {
    // 存储所有字典数据
    const dictData = ref<DictData>({});
    // 加载状态
    const loading = ref(false);

    /**
     * 设置字典数据
     * @param key 字典键名
     * @param data 字典数据
     */
    function setDict(key: string, data: DictItem[]) {
      dictData.value[key] = data;
    }

    /**
     * 获取字典数据
     * @param key 字典键名
     */
    function getDict(key: string): DictItem[] {
      return dictData.value[key] || [];
    }

    /**
     * 移除字典数据
     * @param key 字典键名
     */
    function removeDict(key: string) {
      Reflect.deleteProperty(dictData.value, key);
    }

    /**
     * 清空所有字典数据
     */
    function clearAll() {
      dictData.value = {};
    }

    /**
     * 加载所有字典数据
     */
    async function loadAllDict() {
      if (loading.value) return;
      try {
        loading.value = true;
        const res = await queryAllItem();
        if (res) {
          clearAll();
          Object.entries(res).forEach(([key, value]) => {
            setDict(key, value as DictItem[]);
          });
        }
      } catch (error) {
        console.error('加载字典数据失败:', error);
      } finally {
        loading.value = false;
      }
    }
    function $reset() {
      dictData.value = {};
      loading.value = false;
    }

    return {
      dictData,
      loading,
      setDict,
      getDict,
      removeDict,
      clearAll,
      loadAllDict,
      $reset,
    };
  },
  {
    persist: true,
  },
);
