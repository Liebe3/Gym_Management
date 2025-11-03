import { Route } from "react-router-dom";
import MyClients from "../trainerPanel/clients/MyClients";
import TrainerLayout from "../trainerPanel/components/TrainerLayout";
import MySessions from "../trainerPanel/MySessions";
import Profile from "../trainerPanel/profile/Profile";
import Reports from "../trainerPanel/Reports";
import TrainerDashboard from "../trainerPanel/TrainerDashboard";
import ProtectedRoute from "./ProtectedRoutes";
import ClientsProfile from "../trainerPanel/clients/ClientsProfile";

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
            <MyClients />
          </TrainerLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/trainer/clients/:id"
      element={
        <ProtectedRoute allowedRoles={["trainer"]}>
          <TrainerLayout>
            <ClientsProfile />
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
