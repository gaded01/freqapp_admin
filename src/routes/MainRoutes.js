import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const Subscriber = Loadable(lazy(() => import('pages/subscriber')));
const Bill = Loadable(lazy(() => import('pages/bills')));
const Plan = Loadable(lazy(() => import('pages/plan')));
const Support = Loadable(lazy(() => import('pages/support')));
const Information = Loadable(lazy(() => import('pages/information')));
// const Logout = Loadable(lazy(() => import('pages/logout')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

const PrivateRoutes = Loadable(
  lazy(() => import('middleware/PrivateRoutes'))
);
// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      element: <PrivateRoutes />,
      children: [
        {
          path: '/dashboard',
          element: <DashboardDefault />
        },
        {
          path: '/subscriber',
          element: <Subscriber />
        },
        {
          path: '/bill',
          element: <Bill />
        },
        {
          path: '/plan',
          element: <Plan />
        },
        {
          path: '/support',
          element: <Support />
        },
        {
          path: '/information',
          element: <Information />
        },
        // {
        //   path: '/logout',
        //   element: <Logout />
        // },
        {
          path: 'color',
          element: <Color />
        },
        // {
        //   path: 'dashboard',
        //   children: [
        //     {
        //       path: 'default',
        //       element: <DashboardDefault />
        //     }
        //   ]
        // }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'icons/ant',
      element: <AntIcons />
    }
  ]
};

export default MainRoutes;
