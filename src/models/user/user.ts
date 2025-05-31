import mongoose from "mongoose";
import { authenticationService } from "../../utils/auth";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password") || this.isNew) {
    const hashedPassword = authenticationService.pwdToHash(
      this.get("password")
    );
    this.set("password, hashed");
  }

  done();
});

const User = mongoose.model("User", userSchema);

export default User;
