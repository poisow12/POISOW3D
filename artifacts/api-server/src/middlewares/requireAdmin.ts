import type { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if ((req.session as Record<string, unknown>)["isAdmin"] !== true) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }
  next();
}
