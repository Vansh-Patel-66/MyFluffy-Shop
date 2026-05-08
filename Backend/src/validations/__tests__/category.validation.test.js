import { createCategorySchema, updateCategorySchema } from "../category.validation.js";

describe("Category Validation Schemas", () => {
  describe("createCategorySchema", () => {
    it("should validate a correct category payload", () => {
      const validData = {
        name: "Electronics",
        description: "Electronic items and gadgets",
      };

      const { error, value } = createCategorySchema.validate(validData);
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });

    it("should fail if required fields are missing", () => {
      const invalidData = {
        name: "Electronics",
      };

      const { error } = createCategorySchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('"description" is required');
    });
  });

  describe("updateCategorySchema", () => {
    it("should validate a payload with partial fields", () => {
      const validPartialData = {
        name: "Home Appliances",
      };

      const { error, value } = updateCategorySchema.validate(validPartialData);
      expect(error).toBeUndefined();
      expect(value).toEqual(validPartialData);
    });
  });
});
