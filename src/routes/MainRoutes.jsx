import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// User Management Pages
const ViewUsers = Loadable(lazy(() => import('pages/UserManagement/ViewUsers')));

// Book Management Pages
const ViewBooks = Loadable(lazy(() => import('pages/BookManagement/ViewBooks')));
const AssignBook = Loadable(lazy(() => import('pages/BookManagement/AssignBook')));
// Lease Management Pages
const LeaseOverview = Loadable(lazy(() => import('pages/LeaseManagement/LeaseOverview')));
const BorrowHistory = Loadable(lazy(() => import('pages/Reports/BorrowHistory')));
const Reports = Loadable(lazy(() => import('pages/Reports/Reports')));

// Notifications Pages
const NotificationsOverview = Loadable(lazy(() => import('pages/Notifications/NotificationsOverview')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
import ProtectedRoute from './ProtectedRoute';
// ==============================|| MAIN ROUTING ||============================== //


const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    
    {
      path: 'user-management',
      element: (
        <ProtectedRoute>
          <ViewUsers />
        </ProtectedRoute>
      )  // Protected route (only accessible if logged in)
    },
    {
      path: 'book-management',
      element: (
        <ProtectedRoute>
          <ViewBooks />
        </ProtectedRoute>
      )  // Protected route
    },
    {
      path: 'assign-book',
      element: (
        <ProtectedRoute>
          <AssignBook />
        </ProtectedRoute>
      )  // Protected route
    },
    {
      path: 'lease-management',
      element: (
        <ProtectedRoute>
          <LeaseOverview />
        </ProtectedRoute>
      )  // Protected route
    },
    {
      path: 'borrow-history',
      element: (
        <ProtectedRoute>
          <BorrowHistory />
        </ProtectedRoute>
      )  // Protected route
    },
    {
      path: 'reports',
      element: (
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      )  // Protected route
    },
    {
      path: 'notifications',
      element: (
        <ProtectedRoute>
          <NotificationsOverview />
        </ProtectedRoute>
      )  // Protected route
    }
  ]
};


export default MainRoutes;
