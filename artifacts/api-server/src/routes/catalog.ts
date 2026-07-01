import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, catalogTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

const SEED_ITEMS = [
  { name: "Llavero personalizado", description: "Con tu nombre, iniciales, logo o diseño favorito. Pequeño, ligero y resistente.", detail: "Perfecto como regalo o para identificar tus llaves con estilo.", price: "4,50€", badge: "Más pedido", badgeVariant: "orange", iconType: "keychain", sortOrder: 0 },
  { name: "Soporte de móvil", description: "Para escritorio o uso vertical. Estable, con el ángulo que necesites.", detail: "Diseño limpio que encaja en cualquier espacio de trabajo.", price: "7€", badge: "Popular", badgeVariant: "green", iconType: "phone", sortOrder: 1 },
  { name: "Figura gaming / meme", description: "Personajes, logos, memes en 3D desde tu imagen o diseño. Cada pieza es única.", detail: "Trae tu referencia y lo imprimimos tal cual.", price: "desde 6€", badge: "A medida", badgeVariant: "orange", iconType: "figure", sortOrder: 2 },
  { name: "Organizador de escritorio", description: "Compartimentos para bolígrafos, cables, notas o lo que necesites tener a mano.", detail: "Las medidas y divisiones, a tu gusto.", price: "9€", badge: "Personalizable", badgeVariant: "green", iconType: "organizer", sortOrder: 3 },
  { name: "Maceta decorativa", description: "Geométrica, moderna o con diseño propio. Para plantas pequeñas o suculentas.", detail: "Con o sin agujero de drenaje, a elegir.", price: "desde 5€", badge: "Ecofriendly", badgeVariant: "green", iconType: "pot", sortOrder: 4 },
  { name: "Pieza a medida", description: "¿Tienes un STL, una imagen o solo una idea? Lo imprimimos sin problema.", detail: "Presupuesto sin compromiso antes de confirmar.", price: "Consultar", badge: "100% personalizado", badgeVariant: "orange", iconType: "custom", sortOrder: 5 },
];

async function seedIfEmpty() {
  const existing = await db.select().from(catalogTable).limit(1);
  if (existing.length === 0) {
    await db.insert(catalogTable).values(SEED_ITEMS);
  }
}

// Public: get active catalog items
router.get("/catalog", async (_req, res): Promise<void> => {
  await seedIfEmpty();
  const items = await db.select().from(catalogTable)
    .where(eq(catalogTable.active, true))
    .orderBy(asc(catalogTable.sortOrder), asc(catalogTable.id));
  res.json(items);
});

// Admin: get all catalog items (including inactive)
router.get("/catalog/all", requireAdmin, async (_req, res): Promise<void> => {
  await seedIfEmpty();
  const items = await db.select().from(catalogTable)
    .orderBy(asc(catalogTable.sortOrder), asc(catalogTable.id));
  res.json(items);
});

const CatalogBody = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  detail: z.string().min(1),
  price: z.string().min(1),
  badge: z.string().default(""),
  badgeVariant: z.enum(["orange", "green"]).default("orange"),
  iconType: z.enum(["keychain", "phone", "figure", "organizer", "pot", "custom"]).default("custom"),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

router.post("/catalog", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CatalogBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Datos inválidos" }); return; }
  const [item] = await db.insert(catalogTable).values(parsed.data).returning();
  res.status(201).json(item);
});

router.patch("/catalog/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0]! : req.params.id!, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }
  const parsed = CatalogBody.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Datos inválidos" }); return; }
  const [updated] = await db.update(catalogTable).set(parsed.data).where(eq(catalogTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "No encontrado" }); return; }
  res.json(updated);
});

router.delete("/catalog/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0]! : req.params.id!, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }
  const [deleted] = await db.delete(catalogTable).where(eq(catalogTable.id, id)).returning();
  if (!deleted) { res.status(404).json({ error: "No encontrado" }); return; }
  res.json({ ok: true });
});

export default router;
