import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
  },
})

const User = mongoose.model("User", UserSchema)

export default User