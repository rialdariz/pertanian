const asyncHandler = require("express-async-handler");
const Benihs = require("../models/Benihs");
const BenihsApiResource = require("../resources/BenihsApiResource");

// @desc    Get all benihs
// @route   GET /api/v1/benihs
// @access  Public
exports.index = asyncHandler(async (req, res, next) => {
  let query = Benihs.find().populate("brand_id category_id");

  // Filter by category_id
  if (req.query.category_id) {
    query = query.where("category_id", req.query.category_id);
  }

  // Filter by brand_id
  if (req.query.brand_id) {
    query = query.where("brand_id", req.query.brand_id);
  }

  // Filter by is_popular
  if (req.query.is_popular) {
    query = query.where("is_popular", req.query.is_popular === "true");
  }

  // Limit results
  if (req.query.limit) {
    query = query.limit(parseInt(req.query.limit));
  }

  const benihs = await query.exec();

  res.status(200).json({
    success: true,
    count: benihs.length,
    data: BenihsApiResource.collection(benihs),
  });
});

// @desc    Get single benih by ID
// @route   GET /api/v1/benihs/:id
// @access  Public
exports.show = asyncHandler(async (req, res, next) => {
  const benih = await Benihs.findById(req.params.id)
    .populate("category_id")
    .populate("benefits")
    .populate("testimonials")
    .populate("photos")
    .populate("brand_id");

  if (!benih) {
    return res.status(404).json({
      success: false,
      message: "Benih not found",
    });
  }

  res.status(200).json({
    success: true,
    data: new BenihsApiResource(benih),
  });
});

// @desc    Get single benih by slug
// @route   GET /api/v1/benihs/slug/:slug
// @access  Public
exports.showBySlug = asyncHandler(async (req, res, next) => {
  const benih = await Benihs.findOne({ slug: req.params.slug })
    .populate("category_id")
    .populate("benefits")
    .populate("testimonials")
    .populate("photos")
    .populate("brand_id");

  if (!benih) {
    return res.status(404).json({
      success: false,
      message: "Benih not found",
    });
  }

  res.status(200).json({
    success: true,
    data: new BenihsApiResource(benih),
  });
});
