import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, ordersTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

const NTFY_TOPIC = process.env["NTFY_TOPIC"] ?? "poisow3d-encargos-zjybmyuppu";

async function notifyNewOrder(order: {
  id: number;
  name: string;
  product: string;
  contact: string;
}): Promise<void> {
  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: "POST",
      headers: {
        "Title": `Nuevo encargo #${order.id} — ${order.product}`,
        "Priority": "high",
        "Tags": "printer",
        "Content-Type": "text/plain",
      },
      body: `De: ${order.name}\nContacto: ${order.contact}\nProducto: ${order.product}`,
    });
  } catch {
    // notification failure is non-critical
  }
}

const CreateOrderBody = z.object({
  name: z.string().min(1),
  product: z.string().min(1),
  details: z.string().min(1),
  contact: z.string().min(1),
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Datos incompletos o inválidos" });
    return;
  }
  const [order] = await db.insert(ordersTable).values(parsed.data).returning();
  req.log.info({ orderId: order.id }, "New order created");
  res.status(201).json({ id: order.id });

  // Fire-and-forget notification (after response is sent)
  void notifyNewOrder({
    id: order.id,
    name: order.name,
    product: order.product,
    contact: order.contact,
  });
});

router.get("/orders", requireAdmin, async (req, res): Promise<void> => {
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  res.json(orders);
});

router.patch("/orders/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }
  const { status } = req.body as { status?: string };
  if (!status || !["pending", "in_progress", "done"].includes(status)) {
    res.status(400).json({ error: "Estado inválido" });
    return;
  }
  const [updated] = await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id)).returning();
  if (!updated) {
    res.status(404).json({ error: "Encargo no encontrado" });
    return;
  }
  res.json(updated);
});

export default router;
