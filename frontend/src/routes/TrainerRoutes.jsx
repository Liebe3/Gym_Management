import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes";
import TrainerLayout from "../trainerPanel/components/TrainerLayout";
import TrainerDashboard from "../trainerPanel/TrainerDashboard";
import MySessions from "../trainerPanel/MySessions";
import MyMembers from "../trainerPanel/MyMembers";
import Reports from "../trainerPanel/Reports";
import Profile from "../trainerPanel/Profile";

export const TrainerRoutes = (
  <>
    <Route
      path="/trainer/dashboard"
      element={
        <ProtectedRoute allowedRoles={["trainer"]}>
          <TrainerDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/trainer/schedule"
      element={
        <ProtectedRoute allowedRoles={["trainer"]}>
          <TrainerLayout>
            <MySessions />
          </TrainerLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/trainer/client"
      element={
        <ProtectedRoute allowedRoles={["trainer"]}>
          <TrainerLayout>
            <MyMembers />
          </TrainerLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/trainer/report"
      element={
        <ProtectedRoute allowedRoles={["trainer"]}>
          <TrainerLayout>
            <Reports />
          </TrainerLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/trainer/profile"
      element={
        <ProtectedRoute allowedRoles={["trainer"]}>
          <TrainerLayout>
            <Profile />
          </TrainerLayout>
        </ProtectedRoute>
      }
    />
  </>
);
