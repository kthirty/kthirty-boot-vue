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
  Tree,
  Dropdown,
} from 'ant-design-vue';

export function registerGlobComp(app: App) {
  app
    .use(Input)
    .use(Alert)
    .use(Tabs)
    .use(Steps)
    .use(Tree)
    .use(Row)
    .use(Col)
    .use(Button)
    .use(Drawer)
    .use(Dropdown)
    .use(Tooltip)
    .use(Layout);
}
