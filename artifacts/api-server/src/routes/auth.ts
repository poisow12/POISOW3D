import { Router, type IRouter } from "express";
const router: IRouter = Router();
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] ?? "poisow3d2024";

router.post("/auth/login", (req, res): void => {
  const { password } = req.body as { password?: string };
  console.log("Login attempt, password match:", password === ADMIN_PASSWORD);
  console.log("Session ID:", req.sessionID);
  if (!password || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Contraseña incorrecta" });
    return;
  }
  (req.session as Record<string, unknown>)["isAdmin"] = true;
  req.session.save((err) => {
    if (err) console.error("Session save error:", err);
    console.log("Session saved, isAdmin:", (req.session as Record<string, unknown>)["isAdmin"]);
    res.json({ ok: true });
  });
});

router.get("/auth/me", (req, res): void => {
  const isAdmin = (req.session as Record<string, unknown>)["isAdmin"] === true;
  res.json({ isAdmin });
});

router.post("/auth/logout", (req, res): void => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

export default router;