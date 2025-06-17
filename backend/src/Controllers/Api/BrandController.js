const asyncHandler = require("express-async-handler");
const Brand = require("../models/Brand");
const BrandApiResource = require("../Resources/BrandApiResource");

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.index = asyncHandler(async (req, res, next) => {
  try {
    let query = Brand.aggregate([
      {
        $lookup: {
          from: "benihs",
          localField: "_id",
          foreignField: "brand_id",
          as: "benihs",
        },
      },
      {
        $addFields: {
          benihs_count: { $size: "$benihs" },
        },
      },
      {
        $project: {
          benihs: 0, // Exclude the benihs array from result
        },
      },
    ]);

    // Apply limit if specified
    if (req.query.limit) {
      query = query.limit(parseInt(req.query.limit));
    }

    const brands = await query.exec();

    res.status(200).json({
      success: true,
      count: brands.length,
      data: BrandApiResource.collection(brands),
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get single brand
// @route   GET /api/v1/brands/:id
// @access  Public
exports.show = asyncHandler(async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id)
      .populate({
        path: "benihs",
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "popularBenihs",
        options: { sort: { createdAt: -1 } },
      });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // Get benihs count
    const benihsCount = await Brand.aggregate([
      { $match: { _id: brand._id } },
      {
        $lookup: {
          from: "benihs",
          localField: "_id",
          foreignField: "brand_id",
          as: "benihs",
        },
      },
      {
        $project: {
          count: { $size: "$benihs" },
        },
      },
    ]);

    // Add count to brand object
    brand._doc.benihs_count = benihsCount[0]?.count || 0;

    res.status(200).json({
      success: true,
      data: new BrandApiResource(brand),
    });
  } catch (err) {
    next(err);
  }
});
