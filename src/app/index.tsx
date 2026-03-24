/**
 * 主入口文件
 * 默认导出带路由的应用（RootApp）
 * 也可以单独导出原始的App组件（用于嵌入式场景）
 */

import RootApp from './RootApp';
import App from './App';

// 默认导出带路由的完整应用
export default RootApp;

// 同时导出原始App组件，以便在不需要路由时使用
export { App };
