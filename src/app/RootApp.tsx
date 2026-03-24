import { RouterProvider } from 'react-router';
import { router } from './routes';
import { RobotControlProps } from './types/robot-interfaces';

export default function RootApp(props?: RobotControlProps) {
  // 如果需要，可以在这里传递props到router的loader中
  return <RouterProvider router={router} />;
}