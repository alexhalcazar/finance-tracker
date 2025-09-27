import { expect, test, vi, describe } from "vitest";
import {
  insertUser,
  updateUserById,
  deleteUserById,
  selectUserById,
} from "#models/userModel.js";

const userData = {
  username: "Alex",
  email: "myEmail",
  password_hash: "hashedPassword",
};

const updateUser = { user_id: 1, username: "Jay", email: "newEmail" };

const returnedData = {
  ...userData,
  user_id: 1,
  created_at: new Date("2025-09-25T00:00:00Z"),
  updated_at: new Date("2025-09-25T00:00:00Z"),
};

const insertMock = vi.fn().mockResolvedValue([returnedData]);

vi.mock("#db", () => ({
  default: vi.fn(() => ({
    insert: insertMock,
    where: vi.fn(() => ({
      update: vi.fn(() => ({
        returning: vi.fn().mockResolvedValue([updateUser]),
      })),
      del: vi.fn(() => ({
        returning: vi.fn().mockResolvedValue([returnedData]),
      })),
    })),
    select: vi.fn(() => ({
      where: vi.fn().mockResolvedValue([returnedData]),
    })),
  })),
}));

describe("User Model", () => {
  test("insert new user into the 'users' table", async () => {
    const result = await insertUser(userData);
    expect(result).toEqual(returnedData);
  });

  test("update an existing user from the 'users' table", async () => {
    const result = await updateUserById(updateUser);
    expect(result).toEqual(updateUser);
  });

  test("delete an exisiting user from the 'users' table", async () => {
    const result = await deleteUserById(1);
    expect(result).toEqual(returnedData);
  });

  test("select an existing user from the 'users' table", async () => {
    const result = await selectUserById(1);
    expect(result).toEqual(returnedData);
  });
});
