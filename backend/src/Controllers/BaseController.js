// File: controllers/BaseController.js

class BaseController {
  constructor(model) {
    this.model = model;
    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // Get all documents
  async getAll(req, res, next) {
    try {
      const docs = await this.model.find();
      res.status(200).json({
        success: true,
        count: docs.length,
        data: docs,
      });
    } catch (err) {
      next(err);
    }
  }

  // Get single document by ID
  async getOne(req, res, next) {
    try {
      const doc = await this.model.findById(req.params.id);

      if (!doc) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      res.status(200).json({
        success: true,
        data: doc,
      });
    } catch (err) {
      next(err);
    }
  }

  // Create new document
  async create(req, res, next) {
    try {
      const doc = await this.model.create(req.body);
      res.status(201).json({
        success: true,
        data: doc,
      });
    } catch (err) {
      next(err);
    }
  }

  // Update document
  async update(req, res, next) {
    try {
      const doc = await this.model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      res.status(200).json({
        success: true,
        data: doc,
      });
    } catch (err) {
      next(err);
    }
  }

  // Delete document
  async delete(req, res, next) {
    try {
      const doc = await this.model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return res.status(404).json({
          success: false,
          message: "Document not found",
        });
      }

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (err) {
      next(err);
    }
  }

  // Advanced query with filtering, sorting, pagination
  async advancedQuery(req, res, next) {
    try {
      // Copy req.query
      const reqQuery = { ...req.query };

      // Fields to exclude
      const removeFields = ["select", "sort", "page", "limit"];
      removeFields.forEach((param) => delete reqQuery[param]);

      // Create query string
      let queryStr = JSON.stringify(reqQuery);
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
      );

      // Finding resource
      let query = this.model.find(JSON.parse(queryStr));

      // Select fields
      if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
      }

      // Sort
      if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }

      // Pagination
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 25;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = await this.model.countDocuments();

      query = query.skip(startIndex).limit(limit);

      // Executing query
      const docs = await query;

      // Pagination result
      const pagination = {};
      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit,
        };
      }

      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit,
        };
      }

      res.status(200).json({
        success: true,
        count: docs.length,
        pagination,
        data: docs,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BaseController;
