// import { motion } from "framer-motion";
// import { useEffect, useState } from "react";
// import { showError, showSuccess } from "../../../../pages/utils/Alert";
// import memberService from "../../../../services/memberService";
// import memberHomeService from "../../services/memberPanel/memberHomeService";

// const MemberSessionBooking = ({ onSuccess, onClose }) => {
//   const [form, setForm] = useState({
//     trainerId: "",
//     date: "",
//     startTime: "",
//     endTime: "",
//     notes: "",
//   });

//   const [trainers, setTrainers] = useState([]);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Fetch member's assigned trainers
//   useEffect(() => {
//     const fetchTrainers = async () => {
//       try {
//         setLoading(true);
//         // Get only member's assigned trainers
//         const trainers = await memberHomeService.getAssignedTrainers();
//         setTrainers(trainers || []);

//         if (!trainers || trainers.length === 0) {
//           showError("No trainers assigned to you. Contact admin.");
//         }
//       } catch (error) {
//         console.error("Error fetching trainers:", error);
//         showError("Failed to load your assigned trainers");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrainers();
//   }, []);

//   // Fetch available slots when trainer and date change
//   useEffect(() => {
//     if (form.trainerId && form.date) {
//       fetchAvailableSlots();
//     }
//   }, [form.trainerId, form.date]);

//   const fetchAvailableSlots = async () => {
//     try {
//       setLoadingSlots(true);
//       const response = await memberService.getAvailableSlots(
//         form.trainerId,
//         form.date
//       );

//       if (response.success) {
//         setAvailableSlots(response.availableSlots || []);
//       }
//     } catch (error) {
//       console.error("Error fetching available slots:", error);
//       showError("Failed to load available time slots");
//     } finally {
//       setLoadingSlots(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//       // Reset time slots if trainer or date changes
//       ...(name === "trainerId" || name === "date"
//         ? { startTime: "", endTime: "" }
//         : {}),
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!form.trainerId) newErrors.trainerId = "Please select a trainer";
//     if (!form.date) newErrors.date = "Please select a date";
//     if (!form.startTime) newErrors.startTime = "Please select start time";
//     if (!form.endTime) newErrors.endTime = "Please select end time";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       showError("Please fill in all required fields");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await memberService.bookSession({
//         trainerId: form.trainerId,
//         date: form.date,
//         startTime: form.startTime,
//         endTime: form.endTime,
//         notes: form.notes,
//       });

//       if (response.success) {
//         showSuccess("Session booked successfully!");
//         setForm({
//           trainerId: "",
//           date: "",
//           startTime: "",
//           endTime: "",
//           notes: "",
//         });
//         onSuccess?.();
//         onClose?.();
//       }
//     } catch (error) {
//       showError(error.response?.data?.message || "Failed to book session");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTrainerName = (trainerId) => {
//     const trainer = trainers.find((t) => t._id === trainerId);
//     return trainer ? `${trainer.user.firstName} ${trainer.user.lastName}` : "";
//   };

//   const minDate = new Date().toISOString().split("T")[0];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
//     >
//       <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//         Book a Session
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Trainer Selection */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Select Trainer <span className="text-red-500">*</span>
//           </label>
//           <select
//             name="trainerId"
//             value={form.trainerId}
//             onChange={handleChange}
//             disabled={loading}
//             className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
//               errors.trainerId
//                 ? "border-red-500"
//                 : "border-gray-300 dark:border-gray-600"
//             } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50`}
//           >
//             <option value="">Choose a trainer</option>
//             {trainers.map((trainer) => (
//               <option key={trainer._id} value={trainer._id}>
//                 {trainer.user.firstName} {trainer.user.lastName}
//                 {trainer.specializations?.length > 0 &&
//                   ` (${trainer.specializations[0]})`}
//               </option>
//             ))}
//           </select>
//           {errors.trainerId && (
//             <p className="mt-1 text-sm text-red-500">{errors.trainerId}</p>
//           )}
//         </div>

//         {/* Date Selection */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Select Date <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="date"
//             name="date"
//             value={form.date}
//             onChange={handleChange}
//             min={minDate}
//             disabled={loading || !form.trainerId}
//             className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
//               errors.date
//                 ? "border-red-500"
//                 : "border-gray-300 dark:border-gray-600"
//             } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
//           />
//           {errors.date && (
//             <p className="mt-1 text-sm text-red-500">{errors.date}</p>
//           )}
//         </div>

//         {/* Time Slot Selection */}
//         {form.trainerId && form.date && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Select Time Slot <span className="text-red-500">*</span>
//             </label>

//             {loadingSlots ? (
//               <div className="flex justify-center items-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
//               </div>
//             ) : availableSlots.length === 0 ? (
//               <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
//                 <p className="text-sm text-yellow-800 dark:text-yellow-200">
//                   No available slots for {getTrainerName(form.trainerId)} on
//                   this date
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
//                 {availableSlots.map((slot, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => {
//                       setForm((prev) => ({
//                         ...prev,
//                         startTime: slot.startTime,
//                         endTime: slot.endTime,
//                       }));
//                       setErrors((prev) => ({
//                         ...prev,
//                         startTime: "",
//                         endTime: "",
//                       }));
//                     }}
//                     className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                       form.startTime === slot.startTime &&
//                       form.endTime === slot.endTime
//                         ? "bg-emerald-600 text-white"
//                         : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
//                     }`}
//                   >
//                     {slot.startTime} - {slot.endTime}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {errors.startTime && (
//               <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
//             )}
//           </div>
//         )}

//         {/* Notes */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Notes (Optional)
//           </label>
//           <textarea
//             name="notes"
//             value={form.notes}
//             onChange={handleChange}
//             placeholder="Add any additional notes for your trainer..."
//             rows="3"
//             className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={loading}
//             className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading || availableSlots.length === 0}
//             className="flex-1 px-6 py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Booking..." : "Book Session"}
//           </button>
//         </div>
//       </form>
//     </motion.div>
//   );
// };

// export default MemberSessionBooking;
