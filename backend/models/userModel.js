import mongoose from 'mongoose'

//a schema for bookmark
const bookmarkSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

//a schema for category
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    bookmarks: [bookmarkSchema],
  },
  {
    timestamps: true,
  }
)

//a schema for user
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    categories: [categorySchema],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('user', userSchema)

export default User
