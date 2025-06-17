class BrandResource {
  constructor(brand) {
    this.brand = brand;
  }

  toArray() {
    return {
      id: this.brand._id,
      name: this.brand.name,
      description: this.brand.description,
      logo: this.brand.logo,
      website: this.brand.website,
      is_active: this.brand.is_active,
      created_at: this.brand.createdAt,
      updated_at: this.brand.updatedAt,
    };
  }
}

module.exports = BrandResource;
