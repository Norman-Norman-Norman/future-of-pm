import { deliveryStore, orderDetailStore, orderStore, productStore } from './dataStore';

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

const activeOrderIds = () => new Set(
  orderStore
    .all()
    .filter(order => order.status !== 'cancelled')
    .map(order => order.orderId)
);

const activeOrderDetails = () => {
  const orderIds = activeOrderIds();
  return orderDetailStore.all().filter(detail => orderIds.has(detail.orderId));
};

export const getSummary = () => {
  const orders = orderStore.all();
  const activeOrders = orders.filter(order => order.status !== 'cancelled');
  const grossOrderValue = activeOrderDetails().reduce(
    (total, detail) => total + detail.quantity * detail.unitPrice,
    0
  );
  const averageOrderValue = activeOrders.length === 0 ? 0 : grossOrderValue / activeOrders.length;
  const pendingDeliveries = deliveryStore
    .all()
    .filter(delivery => delivery.status === 'pending' || delivery.status === 'in-transit')
    .length;
  const lowStockCount = getLowStock().length;

  return {
    totalOrders: orders.length,
    grossOrderValue: roundCurrency(grossOrderValue),
    averageOrderValue: roundCurrency(averageOrderValue),
    pendingDeliveries,
    lowStockCount,
    generatedAt: new Date().toISOString()
  };
};

export const getOrdersByStatus = () => {
  const counts = new Map<string, number>(ORDER_STATUSES.map(status => [status, 0]));
  for (const order of orderStore.all()) {
    counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
  }
  return ORDER_STATUSES.map(status => ({ status, count: counts.get(status) ?? 0 }));
};

export const getDeliveryPerformance = () => {
  let onTime = 0;
  let late = 0;
  let notYetDelivered = 0;

  for (const delivery of deliveryStore.all()) {
    if (!delivery.actualDeliveryDate) {
      notYetDelivered += 1;
      continue;
    }
    if (new Date(delivery.actualDeliveryDate).getTime() <= new Date(delivery.scheduledDate).getTime()) {
      onTime += 1;
    } else {
      late += 1;
    }
  }

  const delivered = onTime + late;
  return {
    onTime,
    late,
    notYetDelivered,
    onTimeRate: delivered === 0 ? 0 : Math.round((onTime / delivered) * 100)
  };
};

export const getRecentOrders = (limit = 5) => [...orderStore.all()]
  .sort((a, b) => {
    const dateDelta = new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
    return dateDelta === 0 ? b.orderId - a.orderId : dateDelta;
  })
  .slice(0, limit)
  .map(order => ({
    orderId: order.orderId,
    name: order.name,
    status: order.status,
    orderDate: order.orderDate,
    totalValue: roundCurrency(
      orderDetailStore
        .all()
        .filter(detail => detail.orderId === order.orderId)
        .reduce((total, detail) => total + detail.quantity * detail.unitPrice, 0)
    )
  }));

export const getTopProducts = (limit = 5) => {
  const totals = new Map<number, { productId: number; unitsSold: number; revenue: number }>();
  for (const detail of activeOrderDetails()) {
    const current = totals.get(detail.productId) ?? { productId: detail.productId, unitsSold: 0, revenue: 0 };
    current.unitsSold += detail.quantity;
    current.revenue += detail.quantity * detail.unitPrice;
    totals.set(detail.productId, current);
  }

  return [...totals.values()]
    .map(total => {
      const product = productStore.findById(total.productId);
      return {
        ...total,
        revenue: roundCurrency(total.revenue),
        name: product?.name ?? `Unknown product #${total.productId}`
      };
    })
    .sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue || a.productId - b.productId)
    .slice(0, limit);
};

export const getLowStock = () => productStore
  .all()
  .filter(product => product.stockLevel <= product.reorderPoint)
  .sort((a, b) => (a.stockLevel - a.reorderPoint) - (b.stockLevel - b.reorderPoint) || a.productId - b.productId)
  .map(product => ({
    productId: product.productId,
    name: product.name,
    sku: product.sku,
    stockLevel: product.stockLevel,
    reorderPoint: product.reorderPoint
  }));

export const parseLimit = (value: unknown, defaultLimit = 5, maxLimit = 25) => {
  if (value === undefined) return defaultLimit;
  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > maxLimit) {
    return undefined;
  }
  return limit;
};
