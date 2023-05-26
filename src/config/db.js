import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // useCreateIndex: true, // Used to be needed, but no longer unnecessary.
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    })

    console.log(`\nMongoDB Connected: ${conn.connection.host}.`)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
