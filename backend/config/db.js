// KA HOR (warnings bixisa)
const conn = await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// KA DAMBEEYA (nadiif, warnings la'aan)
const conn = await mongoose.connect(process.env.MONGODB_URI)