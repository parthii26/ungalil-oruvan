import { ForbiddenError, NotFoundError, BusinessRuleError } from "@/lib/errors";
import * as ordersRepo from "@/lib/repositories/orders";

export function getCustomerOrder(orderId: string, customerId: string) {
  const order = ordersRepo.getOrderById(orderId);
  if (!order) throw new NotFoundError("Order not found.");
  if (order.customer_id !== customerId) throw new ForbiddenError("You cannot view this order.");
  return {
    order,
    items: ordersRepo.listOrderItems(order.id),
    events: ordersRepo.listOrderEvents(order.id),
  };
}

export function getOrderByNumberForCustomer(orderNumber: string, customerId: string) {
  const order = ordersRepo.getOrderByNumber(orderNumber);
  if (!order) throw new NotFoundError("Order not found.");
  if (order.customer_id !== customerId) throw new ForbiddenError("You cannot view this order.");
  return {
    order,
    items: ordersRepo.listOrderItems(order.id),
    events: ordersRepo.listOrderEvents(order.id),
  };
}

export function listMine(customerId: string) {
  return ordersRepo.listOrdersForCustomer(customerId);
}

export function adminGet(orderId: string) {
  const order = ordersRepo.getOrderById(orderId);
  if (!order) throw new NotFoundError("Order not found.");
  return {
    order,
    items: ordersRepo.listOrderItems(order.id),
    events: ordersRepo.listOrderEvents(order.id),
  };
}

export function adminCancel(orderId: string) {
  const order = ordersRepo.getOrderById(orderId);
  if (!order) throw new NotFoundError("Order not found.");
  if (order.status !== "pending_payment") {
    throw new BusinessRuleError("Only pending-payment orders can be cancelled in Stage 1.");
  }
  return ordersRepo.cancelPendingOrder(orderId);
}
