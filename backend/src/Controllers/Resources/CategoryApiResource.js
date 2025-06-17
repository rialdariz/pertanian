class CategoryResource {
  constructor(category) {
    this.category = category;
  }

  async toArray() {
    // Populate parent category jika ada
    if (
      this.category.parent_id &&
      typeof this.category.parent_id === "object"
    ) {
      await this.category.populate("parent_id", "name slug");
    }

    return {
      id: this.category._id,
      name: this.category.name,
      slug: this.category.slug,
      description: this.category.description,
      image: this.category.image,
      parent: this.category.parent_id
        ? {
            id: this.category.parent_id._id,
            name: this.category.parent_id.name,
            slug: this.category.parent_id.slug,
          }
        : null,
      is_active: this.category.is_active,
      order: this.category.order,
      created_at: this.category.createdAt,
      updated_at: this.category.updatedAt,
    };
  }
}

module.exports = CategoryResource;
