import assert from "node:assert/strict";
import test from "node:test";
import {
  passwordSchema,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
  logoutSchema,
} from "../validations/auth.validation.js";

test("password complexity is required for register, reset, and change", () => {
  assert.equal(passwordSchema.safeParse("short").success, false);
  assert.equal(passwordSchema.safeParse("Password1!").success, true);
  assert.equal(passwordSchema.safeParse("Password1_").success, false);
});

test("register accepts trimmed lowercase email and trimmed phone", () => {
  const parsed = registerSchema.parse({
    email: "  Alex@Example.COM  ",
    phone: " 9876543210 ",
    password: "Password1!",
    confirmPassword: "Password1!",
  });

  assert.equal(parsed.email, "alex@example.com");
  assert.equal(parsed.phone, "9876543210");
  assert.equal("confirmPassword" in parsed, false);
});

test("login requires phone and a non-empty password without complexity rules", () => {
  const parsed = loginSchema.parse({
    phone: " 9876543210 ",
    password: "any",
  });

  assert.equal(parsed.phone, "9876543210");
  assert.equal(parsed.password, "any");
  assert.equal(loginSchema.safeParse({ phone: "9876543210", password: "" }).success, false);
});

test("forgot password trims phone like login and register", () => {
  const parsed = forgotPasswordSchema.parse({ phone: " 9876543210 " });
  assert.equal(parsed.phone, "9876543210");
});

test("reset password accepts token + newPassword only", () => {
  const parsed = resetPasswordSchema.parse({
    token: "  abc123  ",
    newPassword: "Password1!",
    confirmPassword: "Password1!",
  });

  assert.equal(parsed.token, "abc123");
  assert.equal(parsed.newPassword, "Password1!");
  assert.equal("confirmPassword" in parsed, false);
});

test("change password requires confirmPassword because the API expects it", () => {
  assert.equal(
    changePasswordSchema.safeParse({
      currentPassword: "OldPass1!",
      newPassword: "Password1!",
    }).success,
    false,
  );

  const parsed = changePasswordSchema.parse({
    currentPassword: "OldPass1!",
    newPassword: "Password1!",
    confirmPassword: "Password1!",
  });

  assert.equal(parsed.confirmPassword, "Password1!");
});

test("refresh and logout accept an empty body", () => {
  assert.deepEqual(refreshTokenSchema.parse({}), {});
  assert.deepEqual(refreshTokenSchema.parse(undefined), {});
  assert.deepEqual(logoutSchema.parse({}), {});
  assert.deepEqual(logoutSchema.parse(undefined), {});
});
