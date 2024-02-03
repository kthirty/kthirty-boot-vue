/** 所有 api 接口的响应数据都应该准守该格式 */
interface ApiResponseData<T> {
  code: string
  data: T
  message: string
  success: boolean
}
interface ApiResponsePageData<T> {
  code: string
  data: {
    records: T[]
    pageNumber: number
    pageSize: number
    totalRow: number
    totalPage: number
  }
  message: string
  success: boolean
}
