import { createProductSchema, updateProductSchema } from "../product.validation.js";

describe("Product Validation Schemas", () => {
  describe("createProductSchema", () => {
    it("should validate a correct product payload", () => {
      const validData = {
        name: "Smartphone",
        description: "A very smart phone",
        cost_price: 500,
        selling_price: 600,
        image_url: "http://example.com/image.jpg",
      };

      const { error, value } = createProductSchema.validate(validData);
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });

    it("should fail if required fields are missing", () => {
      const invalidData = {
        description: "A very smart phone",
      };

      const { error } = createProductSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('"name" is required');
    });

    it("should fail if image_url is not a valid URI", () => {
      const invalidData = {
        name: "Smartphone",
        image_url: "not-a-valid-uri",
      };

      const { error } = createProductSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('"image_url" must be a valid uri');
    });
  });

  describe("updateProductSchema", () => {
    it("should validate a payload with partial fields", () => {
      const validPartialData = {
        selling_price: 650,
        stock: 50,
      };

      const { error, value } = updateProductSchema.validate(validPartialData);
      expect(error).toBeUndefined();
      expect(value).toEqual(validPartialData);
    });
  });
});
