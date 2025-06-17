const mongoose = require("mongoose");
const softDelete = require("mongoose-delete");

const BenihBenefitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    benih_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Benih",
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }
);

// Add soft delete plugin
BenihBenefitSchema.plugin(softDelete, {
  deletedAt: true,
  overrideMethods: true,
});

const BenihBenefit = mongoose.model("BenihBenefit", BenihBenefitSchema);

module.exports = BenihBenefit;
