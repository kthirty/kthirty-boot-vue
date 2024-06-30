import type { App } from 'vue';
import { Button } from './Button';
import {
  Input,
  Layout,
  Alert,
  Row,
  Col,
  Tabs,
  Steps,
  Tooltip,
  Drawer,
  Dropdown,
} from 'ant-design-vue';
import VXETable from 'vxe-table';

export function registerGlobComp(app: App) {
  app
    .use(Input)
    .use(Alert)
    .use(Tabs)
    .use(Steps)
    .use(Row)
    .use(Col)
    .use(Button)
    .use(Drawer)
    .use(Dropdown)
    .use(Tooltip)
    .use(Layout)
    .use(VXETable);
}
