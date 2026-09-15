import { loadDb } from "@/lib/db/store";
import { listAllOrders } from "@/lib/repositories/orders";
import { listCustomers } from "@/lib/repositories/customers";

export interface AnalyticsSummary {
  totalRevenuePaise: number;
  totalOrders: number;
  confirmedOrders: number;
  pendingOrders: number;
  averageOrderValuePaise: number;
  topProducts: { name: string; qty: number; revenuePaise: number }[];
  totalCustomers: number;
  totalStockUnits: number;
  activeBatches: number;
}

/** Stage 2 Analytics & Reporting Service */
export class ReportService {
  isConfigured(): boolean {
    return true;
  }

  getSummary(): AnalyticsSummary {
    const db = loadDb();
    const orders = listAllOrders();
    const customers = listCustomers();

    const confirmed = orders.filter((o) => o.status !== "pending_payment" && o.status !== "cancelled");
    const pending = orders.filter((o) => o.status === "pending_payment");
    const totalRevenuePaise = confirmed.reduce((sum, o) => sum + o.grand_total_paise, 0);
    const averageOrderValuePaise = confirmed.length > 0 ? Math.round(totalRevenuePaise / confirmed.length) : 0;

    const productSales: Record<string, { name: string; qty: number; revenuePaise: number }> = {};
    for (const item of db.order_items ?? []) {
      if (!productSales[item.product_name]) {
        productSales[item.product_name] = { name: item.product_name, qty: 0, revenuePaise: 0 };
      }
      productSales[item.product_name].qty += item.quantity;
      productSales[item.product_name].revenuePaise += item.line_total_paise;
    }

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8);

    const totalStockUnits = (db.product_variants ?? []).reduce((sum, v) => sum + (v.stock_qty ?? 0), 0);
    const activeBatches = (db.batches ?? []).filter((b) => b.remaining_quantity > 0).length;

    return {
      totalRevenuePaise,
      totalOrders: orders.length,
      confirmedOrders: confirmed.length,
      pendingOrders: pending.length,
      averageOrderValuePaise,
      topProducts,
      totalCustomers: customers.length,
      totalStockUnits,
      activeBatches,
    };
  }
}

export const reportService = new ReportService();

