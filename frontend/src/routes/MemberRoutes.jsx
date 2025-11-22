import { Route } from "react-router-dom";
import MemberLayout from "../memberPanel/layout/MemberLayout";
import MemberHome from "../memberPanel/pages/MemberHome";
import Membership from "../memberPanel/pages/Membership";
import Profile from "../memberPanel/pages/Profile";
import Trainer from "../memberPanel/pages/Trainer";
import ProtechtedRoute from "./ProtectedRoutes";

const MemberRoutes = () => (
  <>
    <Route
      path="/member/home"
      element={
        <ProtechtedRoute allowedRoles={["member"]}>
          <MemberLayout title="Home">
            <MemberHome />
          </MemberLayout>
        </ProtechtedRoute>
      }
    />

    <Route
      path="/member/membership"
      element={
        <ProtechtedRoute allowedRoles={["member"]}>
          <MemberLayout title="Membership Plans">
            <Membership />
          </MemberLayout>
        </ProtechtedRoute>
      }
    />

    <Route
      path="/member/trainer"
      element={
        <ProtechtedRoute allowedRoles={["member"]}>
          <MemberLayout title="Find a Trainer">
            <Trainer />
          </MemberLayout>
        </ProtechtedRoute>
      }
    />

    {/* for future feature */}
    {/* <Route
        path="/member/paymnet"
        element={
          <ProtechtedRoute allowedRoles={["member"]}>
            <MemberLayout title="Payment">
              <Payment />
            </MemberLayout>
          </ProtechtedRoute>
        }
      /> */}

    <Route
      path="/member/profile"
      element={
        <ProtechtedRoute allowedRoles={["member"]}>
          <MemberLayout title="My Profile">
            <Profile />
          </MemberLayout>
        </ProtechtedRoute>
      }
    />
  </>
);

export default MemberRoutes;
