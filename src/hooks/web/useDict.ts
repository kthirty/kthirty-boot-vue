import { useDictStore } from '@/store/modules/dict';

export function useDict() {
  const dictStore = useDictStore();

  function getDict(code: string) {
    return dictStore.getDict.has(code) ? dictStore.getDict.get(code) : [];
  }

  return { getDict };
}
