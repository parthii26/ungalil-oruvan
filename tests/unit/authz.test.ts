import { describe, expect, it, beforeAll } from "vitest";
import { resetDb } from "../../lib/db/store";
import { getCustomerOrder } from "../../lib/services/orders";
import { loginAdmin, loginCustomer, registerCustomer } from "../../lib/services/auth";
import { ForbiddenError, UnauthorizedError } from "../../lib/errors";
import { findProfileByEmail } from "../../lib/repositories/customers";

beforeAll(() => resetDb());

describe("authorization", () => {
  it("customer A cannot read customer B order", () => {
    expect(() => getCustomerOrder("order-demo-1", "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb")).toThrow(ForbiddenError);
  });

  it("registration always creates customer, never admin", () => {
    const user = registerCustomer(
      {
        full_name: "New Person",
        email: "newperson@varizel.dev",
        password: "Password123",
        phone: "9999900000",
      },
      null,
    );
    expect(user.role).toBe("customer");
    const profile = findProfileByEmail("newperson@varizel.dev");
    expect(profile?.role).toBe("customer");
  });

  it("customer login rejects admin credentials", () => {
    expect(() => loginCustomer({ email: "admin@varizel.dev", password: "Admin123!Dev" }, null)).toThrow(ForbiddenError);
  });

  it("admin login rejects customer credentials", () => {
    expect(() => loginAdmin({ email: "ananya@varizel.dev", password: "Customer123!" })).toThrow(ForbiddenError);
  });

  it("admin login accepts provisioned admin", () => {
    const user = loginAdmin({ email: "admin@varizel.dev", password: "Admin123!Dev" });
    expect(user.role).toBe("admin");
  });

  it("wrong password is unauthorized", () => {
    expect(() => loginCustomer({ email: "ananya@varizel.dev", password: "nope" }, null)).toThrow(UnauthorizedError);
  });
});
