import { createOrderSchema, updateOrderSchema } from "../order.validation.js";

describe("Order Validation Schemas", () => {
  describe("createOrderSchema", () => {
    it("should validate a correct order payload", () => {
      const validData = {
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        sub_total_amount: 100,
        finale_amount: 110,
        delivery_charge: 10,
      };

      const { error, value } = createOrderSchema.validate(validData);
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });

    it("should fail if required fields are missing", () => {
      const invalidData = {
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        sub_total_amount: 100,
        // missing finale_amount
      };

      const { error } = createOrderSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('"finale_amount" is required');
    });
  });

  describe("updateOrderSchema", () => {
    it("should validate a payload with partial fields", () => {
      const validPartialData = {
        order_status: "Shipped",
      };

      const { error, value } = updateOrderSchema.validate(validPartialData);
      expect(error).toBeUndefined();
      expect(value).toEqual(validPartialData);
    });
  });
});
