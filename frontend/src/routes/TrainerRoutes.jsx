import { Route } from "react-router-dom";
import ClientsProfile from "../trainerPanel/clients/ClientsProfile";
import MyClients from "../trainerPanel/clients/MyClients";
import TrainerLayout from "../trainerPanel/components/TrainerLayout";
import MySessions from "../trainerPanel/MySessions";
import Profile from "../trainerPanel/profile/Profile";
// import Reports from "../trainerPanel/Reports";
import SessionDetailPage from "../trainerPanel/session/SessionDetailPage";
import TrainerDashboard from "../trainerPanel/TrainerDashboard";
import ProtectedRoute from "./ProtectedRoutes";

const TrainerRoutes = () => (
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
      path="/trainer/sessions"
      element={
        <ProtectedRoute allowedRoles={["trainer"]}>
          <TrainerLayout>
            <MySessions />
          </TrainerLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/trainer/sessions/:sessionId"
      element={
        <ProtectedRoute allowedRoles={["trainer"]}>
          <TrainerLayout>
            <SessionDetailPage />
          </TrainerLayout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/trainer/clients/:id/sessions"
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

    {/* for report in the future */}
    {/* <Route
      path="/trainer/report"
      element={
        <ProtectedRoute allowedRoles={["trainer"]}>
          <TrainerLayout>
            <Reports />
          </TrainerLayout>
        </ProtectedRoute>
      }
    /> */}

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

export default TrainerRoutes;
