import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide product description']
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      lowercase: true,
      trim: true
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex'
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0
    },
    originalPrice: {
      type: Number,
      required: [true, 'Please provide original price'],
      min: 0
    },
    image: {
      type: String,
      required: [true, 'Please provide a primary product image URL']
    },
    images: {
      type: [String],
      default: []
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL']
    },
    stock: {
      type: Number,
      required: true,
      default: 50,
      min: 0
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 100,
      min: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isNewItem: {
      type: Boolean,
      default: false
    },
    details: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
