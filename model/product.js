import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    category: { type: String, required: true },

    subCategory: {
      type: Object,
      required: true,
    },

    title: {
      type: String,
      required: true,
      lowercase: true,
    },

    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },

          ref: {
            type: String,
            required: true,
          },
        },
      ],

      required: true,

      default: [],

      validate: {
        validator: function (v) {
          return v.length >= 4;
        },

        message: (props) =>
          `At least 4 images are required, but only ${props.value.length} provided.`,
      },
    },

    discount: {
      type: Number,
      default: 0,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    visibility: {
      type: Boolean,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    sizes: [
      {
        size: {
          type: String,
          lowercase: true,
          required: true,
        },

        colours: [
          {
            colour: {
              name: {
                type: String,
                lowercase: true,
                required: true,
              },

              hex: {
                type: String,
                required: true,
              },
            },

            quantity: {
              type: Number,
              required: true,
            },

            _id: false,
          },
        ],
        _id: false,
      },
    ],

    fabric: {
      type: String,
      required: true,
      lowercase: true,
    },

    brand: {
      type: String,
      lowercase: true,
    },

    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

ProductSchema.index({
  description: "text",
  title: "text",
  fabric: "text",
  brand: "text",
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
