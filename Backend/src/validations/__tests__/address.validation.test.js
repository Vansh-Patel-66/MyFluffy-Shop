import { createAddressSchema, updateAddressSchema } from "../address.validation.js";

describe("Address Validation Schemas", () => {
  
  describe("createAddressSchema", () => {
    it("should validate a correct address payload", () => {
      const validData = {
        user_id: "123e4567-e89b-12d3-a456-426614174000", // Valid UUID format
        full_name: "John Doe",
        address_line: "123 Main St",
        city: "New York",
        state: "NY",
        pincode: "10001",
      };

      const { error, value } = createAddressSchema.validate(validData);
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });

    it("should fail validation if required fields are missing", () => {
      const invalidData = {
        full_name: "John Doe",
        // missing user_id, address_line, city, state, pincode
      };

      const { error } = createAddressSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('"user_id" is required');
    });

    it("should fail validation if user_id is not a valid UUID", () => {
      const invalidData = {
        user_id: "not-a-uuid",
        full_name: "John Doe",
        address_line: "123 Main St",
        city: "New York",
        state: "NY",
        pincode: "10001",
      };

      const { error } = createAddressSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('"user_id" must be a valid GUID');
    });
  });

  describe("updateAddressSchema", () => {
    it("should validate a payload with partial fields", () => {
      const validPartialData = {
        city: "Los Angeles",
        state: "CA",
      };

      const { error, value } = updateAddressSchema.validate(validPartialData);
      expect(error).toBeUndefined();
      expect(value).toEqual(validPartialData);
    });

    it("should allow boolean values for is_default", () => {
      const validData = {
        is_default: true,
      };

      const { error } = updateAddressSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });
});
