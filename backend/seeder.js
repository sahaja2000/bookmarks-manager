import mongoose from 'mongoose'
import dotenv from 'dotenv'

import users from './data/seedingData.js'
import User from './models/userModel.js'
import connectDB from './congig/db.js'

dotenv.config()
connectDB()

const importData = async () => {
  try {
    //first deletes
    await User.deleteMany()
    //then inserts
    await User.insertMany(users)

    console.log('Data imported...')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    //deletes
    await User.deleteMany()

    console.log('Data deleted...')
    process.exit()
  } catch (error) {
    console.error(`${error}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
