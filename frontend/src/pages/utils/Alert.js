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

export const ShowWarning = (message) => {
  return Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Okay",
  });
};
