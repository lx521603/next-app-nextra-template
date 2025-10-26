import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs';
// 导入 Location 组件
import Location from '@/components/Location';

const docsComponents = getDocsMDXComponents();

// 定义全局组件
const globalComponents = {
  Location: Location,
  // 可以在这里添加其他全局组件
};

export const useMDXComponents = (components?: any): any => ({
  ...docsComponents,
  ...globalComponents, // 添加全局组件
  ...components,
});