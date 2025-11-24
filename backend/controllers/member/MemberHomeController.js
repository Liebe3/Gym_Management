const Member = require("../../models/Member");
const Session = require("../../models/Session");
const Trainer = require("../../models/Trainer");
const User = require("../../models/User");

exports.getActiveMemberHomeData = async (req, res) => {
    try {
        const userId = req.user.id; // Get from auth middleware

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // Fetch member data with all related information
        const member = await Member.findOne({ user: userId })
            .populate({
                path: "user",
                select: "firstName lastName email phone role",
            })
            .populate({
                path: "membershipPlan",
                select: "name price duration durationType description",
            })
            .populate({
                path: "trainer",
                select: "specialization experience rating",
                populate: {
                    path: "user",
                    select: "firstName lastName email phone",
                },
            });

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "No active membership found for this user",
            });
        }

        // Calculate membership status
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let membershipStatus = member.status;
        let daysRemaining = 0;
        let isExpired = false;
        let expiresAt = null;

        if (member.endDate) {
            const endDate = new Date(member.endDate);
            endDate.setHours(0, 0, 0, 0);

            if (endDate < today) {
                membershipStatus = "expired";
                isExpired = true;
            } else {
                const timeDiff = endDate.getTime() - today.getTime();
                daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
                expiresAt = member.endDate;
            }
        }

        // Fetch recent sessions for this member
        const recentSessions = await Session.find({ member: member._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({
                path: "trainer",
                select: "specialization",
                populate: {
                    path: "user",
                    select: "firstName lastName",
                },
            })
            .select("date time duration notes intensity status");

        // Fetch upcoming sessions
        const upcomingSessions = await Session.find({
            member: member._id,
            date: { $gte: today },
        })
            .sort({ date: 1 })
            .limit(3)
            .populate({
                path: "trainer",
                select: "specialization",
                populate: {
                    path: "user",
                    select: "firstName lastName",
                },
            })
            .select("date time duration notes intensity status");

        res.status(200).json({
            success: true,
            data: {
                member: {
                    _id: member._id,
                    user: member.user,
                    membershipPlan: member.membershipPlan,
                    trainer: member.trainer,
                    startDate: member.startDate,
                    endDate: member.endDate,
                    autoRenew: member.autoRenew,
                    createdAt: member.createdAt,
                },
                membershipStatus: {
                    status: membershipStatus,
                    isExpired,
                    daysRemaining,
                    expiresAt,
                    autoRenew: member.autoRenew,
                },
                sessions: {
                    recent: recentSessions,
                    upcoming: upcomingSessions,
                },
                stats: {
                    totalSessions: await Session.countDocuments({
                        member: member._id,
                    }),
                    completedSessions: await Session.countDocuments({
                        member: member._id,
                        status: "completed",
                    }),
                    upcomingCount: upcomingSessions.length,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching member home data:", error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format",
            });
        }

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};