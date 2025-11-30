const Trainer = require("../models/Trainer");
const User = require("../models/User");
const { addStatsToTrainers } = require("../utils/trainerStats");

exports.getAllTrainer = async (req, res) => {
  // Check if 'all' parameter is requested
  if (req.query.all === "true" || req.query.all === true) {
    try {
      const filter = {};

      // Apply status filter if provided
      if (req.query.status && req.query.status !== "all") {
        filter.status = req.query.status;
      }

      // Apply availability filter if provided
      if (req.query.availability !== undefined) {
        filter.isAvailableForNewClients =
          req.query.availability === "true" || req.query.availability === true;
      }

      // Handle search if provided
      if (req.query.search) {
        const userIds = await User.find({
          $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { lastName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }).select("_id");

        filter.$or = [
          {
            specializations: {
              $elemMatch: { $regex: req.query.search, $options: "i" },
            },
          },
          { user: { $in: userIds.map((u) => u._id) } },
        ];
      }

      const trainers = await Trainer.find(filter)
        .populate({ path: "user", select: "firstName lastName email" })
        .sort({ createdAt: -1 });

      // Get stats for all trainers
      const trainersWithStats = await addStatsToTrainers(trainers);

      const totalFiltered = await Trainer.countDocuments(filter);

      const { buildCounts } = require("../utils/aggregationHelper");
      const counts = {
        status: await buildCounts(Trainer, "status"),
        isAvailableForNewClients: await buildCounts(
          Trainer,
          "isAvailableForNewClients"
        ),
      };

      const { buildResponse } = require("../utils/responseBuilder");
      const response = buildResponse(
        trainersWithStats,
        { page: 1, limit: trainersWithStats.length, skip: 0 }, // fake pagination
        filter,
        counts,
        totalFiltered
      );

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching all trainers:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // ✅ For paginated requests, also add stats
  try {
    const {
      searchableFields = ["specializations"],
      filterableFields = {
        status: "status",
        availability: "isAvailableForNewClients",
      },
      arrayFields = ["specializations"],
      populate = [{ path: "user", select: "firstName lastName email" }],
      countableFields = ["status", "isAvailableForNewClients"],
      customSearch = {
        model: User,
        fields: ["firstName", "lastName", "email"],
        key: "user",
      },
      defaultSort = { createdAt: -1 },
    } = {};

    // Use the base controller logic but intercept before sending response
    const {
      buildQuery,
      buildSort,
      buildPagination,
    } = require("../utils/queryBuilder");
    const {
      buildCounts,
      findRelatedIds,
    } = require("../utils/aggregationHelper");

    let filter = buildQuery(
      req,
      searchableFields,
      filterableFields,
      arrayFields
    );

    // Custom user search
    if (customSearch && req.query.search) {
      const userIds = await findRelatedIds(
        customSearch.model,
        req.query.search,
        customSearch.fields
      );
      filter.$or = [
        ...(filter.$or || []),
        {
          [customSearch.key]: {
            $in: userIds.length > 0 ? userIds : [null],
          },
        },
      ];
    }

    const sort = buildSort(req.query.sortBy, req.query.sortOrder, defaultSort);

    const { page, limit, skip } = buildPagination(
      req.query.page,
      req.query.limit,
      req.query.all
    );

    let queryChain = Trainer.find(filter);
    populate.forEach((pop) => {
      queryChain = queryChain.populate(pop);
    });

    const trainers = await queryChain.sort(sort).skip(skip).limit(limit);

    // ✅ Add stats to paginated results
    const trainersWithStats = await addStatsToTrainers(trainers);

    const totalFiltered = await Trainer.countDocuments(filter);

    const counts = {};
    for (const field of countableFields) {
      counts[field] = await buildCounts(Trainer, field);
    }

    const { buildResponse } = require("../utils/responseBuilder");
    const response = buildResponse(
      trainersWithStats, // ✅ Use trainersWithStats instead of trainers
      { page, limit, skip },
      filter,
      counts,
      totalFiltered
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTrainer = async (req, res) => {
  try {
    const {
      userId,
      gender,
      status,
      specializations,
      experience,
      workSchedule,
      isAvailableForNewClients,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);
    const isNotTrainer = !user || user.role !== "trainer";
    if (isNotTrainer) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    // Check if trainer profile already exists
    const existingTrainer = await Trainer.findOne({ user: userId });
    if (existingTrainer) {
      return res.status(400).json({
        success: false,
        message: "Trainer profile already exists for this user",
      });
    }

    // Validate specializations if provided
    if (
      specializations &&
      (!Array.isArray(specializations) || specializations.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Specializations must be empty",
      });
    }

    // Validate experience
    if (experience && (typeof experience !== "number" || experience < 0)) {
      return res.status(400).json({
        success: false,
        message: "Experience must be a non-negative number",
      });
    }

    // Validate work schedule structure
    if (!workSchedule || typeof workSchedule !== "object") {
      return res.status(400).json({
        success: false,
        message: "Work schedule must be an object",
      });
    }

    // Validate at least 1 working day
    const workingDays = Object.entries(workSchedule).filter(
      ([_, schedule]) => schedule.isWorking
    );

    if (workingDays.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Work schedule must have at least 1 working day",
      });
    }

    // Validate time input for each working day
    for (const [day, schedule] of workingDays) {
      if (!schedule.startTime || !schedule.endTime) {
        return res.status(400).json({
          success: false,
          message: `Working day '${day}' must have both startTime and endTime`,
        });
      }

      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (
        !timeRegex.test(schedule.startTime) ||
        !timeRegex.test(schedule.endTime)
      ) {
        return res.status(400).json({
          success: false,
          message: `Working day '${day}' has invalid time format. Use HH:MM`,
        });
      }

      const [startHour, startMinute] = schedule.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = schedule.endTime.split(":").map(Number);

      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;

      if (endTotalMinutes <= startTotalMinutes) {
        return res.status(400).json({
          success: false,
          message: `Working day '${day}' must have an end time later than start time`,
        });
      }
    }

    const trainerData = {
      user: userId,
      status: status || "inactive",
      isAvailableForNewClients:
        isAvailableForNewClients !== undefined
          ? isAvailableForNewClients
          : false,
      createdBy: req.user?.id,
      lastUpdatedBy: req.user?.id,
    };

    if (gender) trainerData.gender = gender;
    if (specializations) trainerData.specializations = specializations;
    if (experience !== undefined) trainerData.experience = experience;
    if (workSchedule) trainerData.workSchedule = workSchedule;

    const newTrainer = new Trainer(trainerData);
    await newTrainer.save();

    await newTrainer.populate("user", "firstName lastName email");

    res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      trainer: newTrainer,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getTrainerById = async (req, res) => {
  try {
    const { id } = req.params;

    const trainer = await Trainer.findById(id).populate({
      path: "user",
      select: "firstName lastName email",
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Reuse helper but wrap in array (it expects an array of trainers)
    const [trainerWithStats] = await addStatsToTrainers([trainer]);

    res.status(200).json({
      success: true,
      data: trainerWithStats,
    });
  } catch (error) {
    console.error("Get trainer by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      gender,
      experience,
      status,
      specializations,
      workSchedule,
      isAvailableForNewClients,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Trainer id is required",
      });
    }

    const existingTrainer = await Trainer.findById(id);
    if (!existingTrainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    const isInvalidSpecializations =
      specializations &&
      (!Array.isArray(specializations) || specializations.length === 0);

    if (isInvalidSpecializations) {
      return res.status(400).json({
        success: false,
        message: "Specializations must be a non-empty array",
      });
    }

    const isInvalidExperience =
      experience && (typeof experience !== "number" || experience < 0);
    if (isInvalidExperience) {
      return res.status(400).json({
        success: false,
        message: "Experience must be a non-negative number",
      });
    }

    if (workSchedule) {
      if (typeof workSchedule !== "object") {
        return res.status(400).json({
          success: false,
          message: "Work schedule must be an object",
        });
      }

      const workingDays = Object.entries(workSchedule).filter(
        ([_, schedule]) => schedule.isWorking
      );

      if (workingDays.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Work schedule must have atleast 1 working day",
        });
      }

      for (const [day, schedule] of workingDays) {
        if (!schedule.startTime || !schedule.endTime) {
          return res.status(400).json({
            success: false,
            message: `Working day '${day}' must have both startTime and endTime`,
          });
        }

        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        const isInvalidTimeFormat =
          !timeRegex.test(schedule.startTime) ||
          !timeRegex.test(schedule.endTime);
        if (isInvalidTimeFormat) {
          return res.status(400).json({
            success: false,
            message: `Working day '${day}' has invalid time format. Use HH:MM`,
          });
        }

        const [startHour, startMinute] = schedule.startTime
          .split(":")
          .map(Number);

        const [endHour, endMinute] = schedule.endTime.split(":").map(Number);

        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        if (endTotalMinutes <= startTotalMinutes) {
          return res.status(400).json({
            success: false,
            message: `Working day '${day}' must have an end time later than start time`,
          });
        }
      }
    }

    const updateData = {
      lastUpdatedBy: req.user?.id,
    };

    if (gender) updateData.gender = gender;
    if (status) updateData.status = status;
    if (specializations) updateData.specializations = specializations;
    if (experience !== undefined) updateData.experience = experience;
    if (workSchedule) updateData.workSchedule = workSchedule;
    if (isAvailableForNewClients !== undefined)
      updateData.isAvailableForNewClients = isAvailableForNewClients;

    const updatedTrainer = await Trainer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("user", "firstName lastName email");

    res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      trainer: updatedTrainer,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      });
    }

    console.error("Update trainer error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTrainer = await Trainer.findByIdAndDelete(id);

    if (!deleteTrainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Trainer Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
