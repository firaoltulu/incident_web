import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
// User
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// company
// const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// Accident
const AccidentListPage = lazy(() => import('src/pages/dashboard/accident/list'));
const AccidentDetailsPage = lazy(() => import('src/pages/dashboard/accident/details'));
const AccidentCreatePage = lazy(() => import('src/pages/dashboard/accident/new'));
// const AccidentEditPage = lazy(() => import('src/pages/dashboard/accident/edit'));

// Role
const TourDetailsPage = lazy(() => import('src/pages/dashboard/role/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/role/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/role/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/role/edit'));
// work-Flow
const OrderListPage = lazy(() => import('src/pages/dashboard/workflow/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/workflow/details'));
const OrderCreatePage = lazy(() => import('src/pages/dashboard/workflow/new'));
const OrderEditPage = lazy(() => import('src/pages/dashboard/workflow/edit'));
// report
// const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const AccidentReportListPage = lazy(() => import('src/pages/dashboard/report/list'));


// //////////////////////////////////////////////////////////////////////////////////////////////


// App
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// Test render page by role
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// Blank page
const ParamsPage = lazy(() => import('src/pages/dashboard/params'));
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: ':id/account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'company',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          // { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'accident',
        children: [
          { element: <AccidentListPage />, index: true },
          { path: 'list', element: <AccidentListPage /> },
          { path: ':id', element: <AccidentDetailsPage /> },
          { path: 'new', element: <AccidentCreatePage /> },
          { path: ':id/edit', element: <OrderEditPage /> },

        ],
      },
      {
        path: 'role',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      {
        path: 'workflow',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
          { path: 'new', element: <OrderCreatePage /> },
          { path: ':id/edit', element: <OrderEditPage /> },

        ],
      },

      {
        path: 'report',
        children: [
          { element: <AccidentReportListPage />, index: true },
          { path: 'list', element: <AccidentReportListPage /> },
        ],
      },


      // /////////////////////////////////////////////////////////////////



      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'params', element: <ParamsPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
