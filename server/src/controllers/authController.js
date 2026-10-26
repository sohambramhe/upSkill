import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken, publicUser } from "../utils/token.js";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email || !password)
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  if (password.length < 8)
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  if (await User.exists({ email: email.toLowerCase() }))
    return res.status(409).json({ message: "Email already registered" });
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    passwordHash: await bcrypt.hash(password, 12),
  });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select(
    "+passwordHash",
  );
  if (
    !user ||
    !user.passwordHash ||
    !(await bcrypt.compare(password || "", user.passwordHash))
  )
    return res.status(401).json({ message: "Invalid email or password" });
  res.json({ token: signToken(user), user: publicUser(user) });
});
export const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential || !process.env.GOOGLE_CLIENT_ID)
    return res
      .status(400)
      .json({ message: "Google sign-in is not configured" });
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const p = ticket.getPayload();
  if (!p?.email || !p.email_verified)
    return res
      .status(401)
      .json({ message: "Google account email is not verified" });
  let user = await User.findOne({
    $or: [{ googleId: p.sub }, { email: p.email.toLowerCase() }],
  });
  if (!user)
    user = await User.create({
      name: p.name || p.email.split("@")[0],
      email: p.email.toLowerCase(),
      googleId: p.sub,
      avatar: p.picture || "",
    });
  else if (!user.googleId) {
    user.googleId = p.sub;
    if (!user.avatar) user.avatar = p.picture || "";
    await user.save();
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});
export const me = asyncHandler(async (req, res) =>
  res.json({ user: publicUser(req.user) }),
);
