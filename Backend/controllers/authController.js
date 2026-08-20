const pool = require("../db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {

    try {

        const {
            role,
            full_name,
            email,
            dob,
            contact_no,
            password,
        } = req.body;

          const allowedRoles = ["student", "teacher"];

        if (!allowedRoles.includes(role)) {
          return res.status(400).json({
            message: "Invalid role selected.",
          });
        }

        if (
            !full_name ||
            !email ||
            !dob ||
            !contact_no ||
            !password
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

const client = await pool.connect();

try {
  await client.query("BEGIN");

  // Insert into users
  const userResult = await client.query(
    `INSERT INTO users
    (full_name, email, dob, contact_no, password, role)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id`,
    [
      full_name,
      email,
      dob,
      contact_no,
      hashedPassword,
      role,
    ]
  );

  const userId = userResult.rows[0].id;

  // Create teacher profile
  if (role === "teacher") {
    await client.query(
      `INSERT INTO teachers
      (user_id, status, experience_years)
      VALUES ($1, 'Active', 0)`,
      [userId]
    );
  }

  await client.query("COMMIT");

  res.status(201).json({
    message: "User Registered Successfully",
  });

} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
}

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};



const signin = async (req, res) => {
  try {
    const { email, password , role } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];
  

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Verify selected role
    if (user.role !== role) {
      return res.status(401).json({
        message: "Selected role does not match this account.",
      });
    }
    
    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      stack: err.stack,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    // Security: Don't reveal whether the email exists
    if (userResult.rows.length === 0) {
      return res.status(200).json({
        message:
          "If an account with this email exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `UPDATE users
       SET reset_token = $1,
           reset_token_expiry = $2
       WHERE email = $3`,
      [token, expiry, email]
    );

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    await sendEmail(
      email,
      "Password Reset",
      `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `
    );

    return res.status(200).json({
      message:
        "If an account with this email exists, a reset link has been sent.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate input
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    // Find user with matching token
    const result = await pool.query(
      `SELECT * FROM users
       WHERE reset_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid reset link",
      });
    }

    const user = result.rows[0];

    // Check if token has expired
    if (new Date(user.reset_token_expiry) < new Date()) {
      return res.status(400).json({
        message: "Reset link has expired",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await pool.query(
      `UPDATE users
       SET password = $1,
           reset_token = NULL,
           reset_token_expiry = NULL
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    return res.status(200).json({
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
    signup, signin, forgotPassword, resetPassword ,
};