import API from "../API/Api";

export const AuthService = {
  // Register a new user
  registerUser: async (userData) => {
    try {
      const response = await API.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw {
        message:
          error.response?.data?.message ||
          error.message ||
          "Error registering user",
      };
    }
  },

  loginUser: async (credentials) => {
    try {
      const response = await API.post("/auth/login", credentials);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); //for flexible
      }
      return response.data;
    } catch (error) {
      throw {
        message:
          error.response?.data?.message ||
          error.message ||
          "Error loggin in user",
      };
    }
  },

  // You can add other auth-related functions here, such as:
  // logoutUser: () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  // },

  // checkAuthStatus: async () => {
  //   // Logic to verify token on page load
  // },
};

// //register
// export const registerUser = async (userData) => {
//   const response = await API.post("/auth/register", userData);
//   return response.data;
// };

// // Login
// export const loginUser = async (credentials) => {
//   const response = await API.post("/auth/login", credentials);
//   if (response.data.token) {
//     // Save token and user data in localStorage
//     localStorage.setItem("token", response.data.token);
//     localStorage.setItem("user", JSON.stringify(response.data.user));
//   }
//   return response.data;
// };
