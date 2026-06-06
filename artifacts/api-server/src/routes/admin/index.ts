import { Router, type IRouter } from "express";
import { signAdminToken } from "../../middlewares/adminAuth";

const router: IRouter = Router();

router.post("/admin/login", (req, res): void => {
  const { username, password } = req.body as { username?: string; password?: string };

  const validUsername = process.env.ADMIN_USERNAME ?? "admin";
  const validPassword = process.env.ADMIN_PASSWORD ?? "cosmos@2024";

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  if (username !== validUsername || password !== validPassword) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signAdminToken(username);
  res.json({ token, username });
});

export default router;
