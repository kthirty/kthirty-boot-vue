import { ref } from "vue"
import { defineStore } from "pinia"
import { getClient, setClient } from "@/utils/cache/local-storage"

export interface ClientInfo {
  // 客户端ID
  id: string
}

const randomString = () => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let result = ""
  for (let i = 30; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return "V1" + result
}

export const useClientStore = defineStore("client", () => {
  const localClient = getClient()
  const client = ref<ClientInfo>(localClient || { id: randomString() })
  setClient(client.value)
  const getId = () => {
    return client.value.id
  }
  return { getId }
})
