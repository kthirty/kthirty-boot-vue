export interface PageProps {
  title?: string;
  description?: string;
  contentClass?: string;
  /**
   * 根据 content 可见高度自适应，内容区使用 flex 布局并限制溢出，
   * 便于子组件（如 VxeGrid）通过 h-full 撑满剩余高度。
   * 若需整页滚动，可通过 contentClass 传入 overflow-y-auto。
   */
  autoContentHeight?: boolean;
  headerClass?: string;
  footerClass?: string;
}
