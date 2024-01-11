import { type App } from "vue"
import Avue from "@smallwei/avue"
import axios from "axios"
import zhLocale from "@smallwei/avue/lib/locale/lang/zh"

export function loadAvue(app: App) {
  app.use(Avue, { axios: axios, locale: zhLocale })
}
