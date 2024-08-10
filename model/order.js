import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    cartItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        size: {
          type: String,
          required: true,
          lowercase: true,
        },

        colour: {
          type: Object,
          required: true,
        },
      },
    ],

    shippingInfo: {
      name: {
        type: String,
        required: true,
      },

      phoneNumber: {
        type: String,
        required: true,
      },

      email: {
        type: String,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    canceledBy: {
      type: String,
    },

    cancellationReason: {
      type: String,
    },

    status: {
      type: String,
      enum: ["confirmed", "pending", "delivered", "canceled"],
      required: true,
      default: "pending",
      lowercase: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
      required: true,
    },

    shiprocketOrderId: {
      type: String,
    },

    shiprocketShipmentId: {
      type: Number,
    },

    transactionId: {
      type: String,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
