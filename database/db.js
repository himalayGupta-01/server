import mongoose from "mongoose";

const connectDB = () => {
  mongoose.connect(process.env.URL, { dbName: "Service" }).then(() => {
    console.log("Connected to DB");
  });
};

const studentSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const problemSchema = mongoose.Schema(
  {
    topic: { type: String, required: true },
    subTopic: { type: String, required: true },
    ytLink: { type: String, required: true },
    leetCodeLink: { type: String, required: true },
    articleLink: { type: String, required: true },
    levelIndicator: {
      type: String,
      enum: ["Easy", "Medium", "Tough"],
      default: "Easy",
    },
  },
  { timestamps: true }
);

const progressSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const studentModel = mongoose.model("Student", studentSchema);
const problemModel = mongoose.model("Problem", problemSchema);
const progressModel = mongoose.model("Progress", progressSchema);

export { connectDB, studentModel, problemModel, progressModel };
