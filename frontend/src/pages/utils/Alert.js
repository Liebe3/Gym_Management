import Swal from "sweetalert2";

export const showError = (message) => {
  Swal.fire({
    icon: "error",
    text: message,
  });
};

export const showSuccess = (message) => {
  Swal.fire({
    icon: "success",
    text: message,
  });
};
