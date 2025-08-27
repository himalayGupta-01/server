import  { Types } from "mongoose";
import { problemModel, progressModel, studentModel } from "../Database/db.js";

export default class ServiceController {
  static getStudentProfile = async (req, res) => {
    try {
      const student = await studentModel.findById(req.studentId);
      if (student) {
        return res.status(200).json({ student: student });
      }
      return res.status(401).json({ error: "Unauthorized" });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  };

  static addProblem = async (req, res) => {
    try {
      const problem = req.body;
      const doc = new problemModel(problem);
      const result = await doc.save();
      return res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  };

  static updateProgress = async (req, res) => {
    const studentId = req.studentId;
    const problemId = req.query.problemId;
    const completed = req.query.completed;

    try {
      const progress = await progressModel.findOneAndUpdate(
        { userId: studentId, problemId: problemId },
        { completed: completed },
        { new: true, upsert: true }
      );

      res.status(200).json(progress);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" });
    }
  };

  static getProgress = async (req, res) => {
    try {
      const problems = await problemModel.aggregate([
        {
          $lookup: {
            from: "progresses", 
            let: { problemId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$problemId", "$$problemId"] },
                      { $eq: ["$userId", new Types.ObjectId(req.studentId)] },
                    ],
                  },
                },
              },
            ],
            as: "progress",
          },
        },
        {
          $addFields: {
            completed: {
              $cond: [
                { $gt: [{ $size: "$progress" }, 0] },
                { $arrayElemAt: ["$progress.completed", 0] },
                false,
              ],
            },
          },
        },
        {
          $project: {
            topic: 1,
            subTopic: 1,
            ytLink: 1,
            leetCodeLink: 1,
            articleLink: 1,
            levelIndicator: 1,
            completed: 1
          },
        },
      ]);
      res.status(200).json(problems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static getProgressStats = async (req, res) => {
    try {
      const totalProblems = await problemModel.find();

      const solvedProblem = await progressModel
        .find({
          userId: req.studentId,
          completed: true,
        })
        .populate("problemId");

      const totalCounts = totalProblems.reduce((acc, prob) => {
        acc[prob.levelIndicator] = (acc[prob.levelIndicator] || 0) + 1;
        return acc;
      }, {});

      const solvedCounts = solvedProblem.reduce((acc, prog) => {
        const level = prog.problemId.levelIndicator; 
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});

      const result = {
        EasyTotal: totalCounts.Easy,
        MediumTotal: totalCounts.Medium,
        ToughTotal: totalCounts.Tough,
        EasySolved: solvedCounts.Easy || 0,
        MediumSolved: solvedCounts.Medium || 0,
        ToughSolved: solvedCounts.Tough || 0,
      };
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
