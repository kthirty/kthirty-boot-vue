import { defineStore } from 'pinia';
import { queryAllItem } from '@/api/system/dict';
import { store } from '@/store';

interface DictState {
  dictList: Map<string, DictItem[]>;
}
interface DictItem {
  code: string;
  value: string;
  label: string;
  status: string;
  children?: DictItem[];
}

export const useDictStore = defineStore({
  id: 'app-dict',
  state: (): DictState => ({
    dictList: new Map(),
  }),
  getters: {
    getDict(state): Map<string, DictItem[]> {
      return state.dictList;
    },
  },
  actions: {
    async loadAllDict() {
      this.dictList.clear();
      const result = await queryAllItem();
      Object.keys(result).forEach((key: string) => {
        const value = result[key].map((item: Recordable) => {
          const dictItem: DictItem = {
            code: item.code,
            value: item.value,
            label: item.label,
            status: item.status,
          };
          if (Array.isArray(item.children) && item.children.length) {
            dictItem.children = item.children;
          }
          return dictItem;
        });
        this.dictList.set(key, value);
      });
    },
  },
});

// Need to be used outside the setup
export function useDictStoreWithOut() {
  return useDictStore(store);
}
