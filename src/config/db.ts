import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      // useCreateIndex: true, // Used to be needed, but no longer unnecessary.
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err: any) {
    const message: any = // Typescript complains about the bright variants.
      'Something went wrong with the mongoose connection (db.ts)!!!'
    console.log('\n\n', message.brightRed.bold, '\n\n', err)
    process.exit(1)
  }
}
