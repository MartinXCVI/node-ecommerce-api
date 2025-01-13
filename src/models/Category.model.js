import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({

})

const Category = mongoose.model("Category", CategorySchema) // Schema defined as Category

export default Category