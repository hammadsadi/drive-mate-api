import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `
        SELECT id, name, email, phone, role FROM users
        `
  );
  return result.rows?.length > 0 ? result.rows : [];
};

const updateUserProfile = async (
  payload: Record<string, unknown>,
  userId: number,
  userInfo: JwtPayload
) => {
  const { name, email, phone, role } = payload;
  if (userInfo.role !== "admin" && userInfo.id !== userId) {
    throw new Error("Unauthorized");
  }
  const getUser = await pool.query(
    `
    SELECT * FROM users WHERE id = $1
    `,
    [userId]
  );

  if (getUser.rows?.length === 0) {
    throw new Error("User not found");
  }
  const currentUser = getUser?.rows[0];
  const updatePayload = {
    name: name || currentUser.name,
    email: email || currentUser.email,
    phone: phone || currentUser.phone,
    role: role || currentUser.role,
  };

  const result = await pool.query(
    `
    UPDATE users SET name = $1, email = $2, phone = $3, role = $4 WHERE id = $5 RETURNING *
    `,
    [
      updatePayload.name,
      updatePayload.email,
      updatePayload.phone,
      updatePayload.role,
      userId,
    ]
  );
  const response = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    role: result.rows[0].role,
    phone: result.rows[0].phone,
  };
  return result.rows?.length > 0 ? response : null;
};

const deleteUser = async (id: number) => {
  const result = await pool.query(
    `
      DELETE FROM users WHERE id = $1 RETURNING *
      `,
    [id]
  );
  return result.rows?.length > 0 ? result.rows[0] : null;
};

export const userService = {
  getAllUsers,
  updateUserProfile,
  deleteUser,
};
