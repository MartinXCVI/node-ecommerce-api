import { Schema, model } from 'mongoose';
const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    }
});
const Category = model("Category", CategorySchema); // Schema defined as Category
export default Category;
