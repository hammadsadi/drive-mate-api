import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";
const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  if (result.rows?.length === 0) {
    throw new Error("User not found");
  }
  const user = result.rows[0];
  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid password");
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  };
};

const userRegister = async (payload: Record<string, unknown>) => {
  const { name, email, password, role, phone } = payload;
  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `
      INSERT INTO users(name, email, password, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *
      `,
    [name, email, hashedPassword, role, phone]
  );
  const user = result.rows[0];
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  };
};
export const authService = {
  loginUser,
  userRegister,
};
