// const Member = require("../models/Member");
// const Session = require("../models/Session");
// const User = require("../models/User");

// exports.getTrainerClients = async (req, res) => {
//   try {
//     const { trainerId } = req.params;
//     const {
//       status,
//       search,
//       page = 1,
//       limit = 10,
//       sortBy = "startDate",
//       sortOrder = "desc",
//     } = req.query;

//     // Build filter
//     const filter = { trainer: trainerId };

//     // Apply status filter
//     if (status && status !== "all") {
//       filter.status = status;
//     }

//     // Apply search filter
//     if (search) {
//       const fullNameRegex = new RegExp(search, "i");
//       const userIds = await User.find({
//         $or: [
//           { firstName: { $regex: search, $options: "i" } },
//           { lastName: { $regex: search, $options: "i" } },
//           { email: { $regex: search, $options: "i" } },
//           {
//             $expr: {
//               $regexMatch: {
//                 input: { $concat: ["$firstName", " ", "$lastName"] },
//                 regex: fullNameRegex,
//               },
//             },
//           },
//         ],
//       }).select("_id");

//       filter.user = { $in: userIds.map((u) => u._id) };
//     }

//     // Pagination
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

//     // Fetch members with populated data
//     const members = await Member.find(filter)
//       .populate({
//         path: "user",
//         select: "firstName lastName email phone profilePhoto",
//       })
//       .populate({
//         path: "membershipPlan",
//         select: "name price duration durationType",
//       })
//       .sort(sort)
//       .skip(skip)
//       .limit(parseInt(limit));

//     const total = await Member.countDocuments(filter);

//     // Get next session for each member
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const memberIds = members.map((m) => m._id);

//     const nextSessions = await Session.find({
//       member: { $in: memberIds },
//       trainer: trainerId,
//       date: { $gte: today },
//       status: "scheduled",
//     })
//       .sort({ date: 1, startTime: 1 })
//       .limit(memberIds.length);

//     // Create map of member to next session
//     const nextSessionMap = {};
//     nextSessions.forEach((session) => {
//       const memberId = session.member.toString();
//       if (!nextSessionMap[memberId]) {
//         nextSessionMap[memberId] = session;
//       }
//     });

//     // Combine data
//     const clientsData = members.map((member) => {
//       const memberObj = member.toObject();
//       const memberId = member._id.toString();

//       return {
//         ...memberObj,
//         nextSession: nextSessionMap[memberId] || null,
//       };
//     });

//     // Get status counts for filtering UI
//     const statusCounts = await Member.aggregate([
//       { $match: { trainer: trainerId } },
//       { $group: { _id: "$status", count: { $sum: 1 } } },
//     ]);

//     const counts = {
//       all: total,
//       ...Object.fromEntries(statusCounts.map((s) => [s._id, s.count])),
//     };

//     res.status(200).json({
//       success: true,
//       data: clientsData,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         totalPages: Math.ceil(total / parseInt(limit)),
//       },
//       counts,
//     });
//   } catch (error) {
//     console.error("Get trainer clients error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

// exports.getClientDetails = async (req, res) => {
//   try {
//     const { trainerId, memberId } = req.params;

//     const member = await Member.findOne({
//       _id: memberId,
//       trainer: trainerId,
//     })
//       .populate({
//         path: "user",
//         select: "firstName lastName email phone profilePhoto",
//       })
//       .populate({
//         path: "membershipPlan",
//         select: "name price duration durationType features",
//       });

//     if (!member) {
//       return res.status(404).json({
//         success: false,
//         message: "Client not found or not assigned to this trainer",
//       });
//     }

//     // Get session statistics
//     const [totalSessions, completedSessions, upcomingSessions] =
//       await Promise.all([
//         Session.countDocuments({ member: memberId, trainer: trainerId }),
//         Session.countDocuments({
//           member: memberId,
//           trainer: trainerId,
//           status: "completed",
//         }),
//         Session.find({
//           member: memberId,
//           trainer: trainerId,
//           date: { $gte: new Date() },
//           status: "scheduled",
//         })
//           .sort({ date: 1, startTime: 1 })
//           .limit(5),
//       ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         ...member.toObject(),
//         stats: {
//           totalSessions,
//           completedSessions,
//           upcomingSessions,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Get client details error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };
