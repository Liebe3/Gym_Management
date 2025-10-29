import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import DashboardLayout from "../admin/dashboard/DashboardLayout";
import Dashboard from "../admin/dashboard/Dashboard";
import MemberSection from "../admin/dashboard/components/MemberSection";
import MemberShipPlansSection from "../admin/dashboard/components/MemberShipPlansSection";
import TrainerSection from "../admin/dashboard/components/TrainerSection";
import SessionSection from "../admin/dashboard/components/SessionSection";
import UserSection from "../admin/dashboard/components/UserSection";

export const AdminRoutes = (
  <>
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/membership-plans"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <DashboardLayout>
            <MemberShipPlansSection />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/member"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <DashboardLayout>
            <MemberSection />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/trainer"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <DashboardLayout>
            <TrainerSection />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/session"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <DashboardLayout>
            <SessionSection />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/user"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <DashboardLayout>
            <UserSection />
          </DashboardLayout>
        </ProtectedRoute>
      }
    />
  </>
);
