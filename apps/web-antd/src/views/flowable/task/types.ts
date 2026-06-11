import type { FlwTaskApi } from './api';

export interface FlowTaskFormExpose {
  getExtraParams?: () => Record<string, any>;
  validate?: () => Promise<boolean>;
}

export interface FlowTaskFormProps {
  task: FlwTaskApi.Task;
}
