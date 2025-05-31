import mongoose from "mongoose";
import { authenticationService } from "../../utils/auth";
import { PostDoc } from "../post/post";

export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  posts?: Array<PostDoc>;
}

export interface CreateUserDto {
  email: string;
  password: string;
}

export interface UserModel extends mongoose.Model<UserDoc> {
  build(dto: CreateUserDto): UserDoc;
}

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

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hashedPassword = await authenticationService.pwdToHash(
      this.get("password")
    );
    this.set("password", hashedPassword);
  }

  next();
});

userSchema.statics.build = (createUserDto: CreateUserDto) =>
  new User(createUserDto);

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export default User;
