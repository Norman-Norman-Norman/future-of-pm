import {
  deliveries as seedDeliveries,
  orderDetails as seedOrderDetails,
  orders as seedOrders,
  productReviews as seedProductReviews,
  products as seedProducts
} from './seedData';
import { Delivery } from './models/delivery';
import { Order } from './models/order';
import { OrderDetail } from './models/orderDetail';
import { Product } from './models/product';
import { ProductReview } from './models/productReview';

let products: Product[] = [...seedProducts];
let productReviews: ProductReview[] = [...seedProductReviews];
let orders: Order[] = [...seedOrders];
let orderDetails: OrderDetail[] = [...seedOrderDetails];
let deliveries: Delivery[] = [...seedDeliveries];

export const resetProducts = () => {
  products = [...seedProducts];
};

export const resetProductReviews = () => {
  productReviews = [...seedProductReviews];
};

export const resetOrders = () => {
  orders = [...seedOrders];
};

export const resetOrderDetails = () => {
  orderDetails = [...seedOrderDetails];
};

export const resetDeliveries = () => {
  deliveries = [...seedDeliveries];
};

export const resetAnalyticsState = () => {
  resetProducts();
  resetProductReviews();
  resetOrders();
  resetOrderDetails();
  resetDeliveries();
};

export const productStore = {
  all: () => products,
  findById: (id: number) => products.find(product => product.productId === id),
  add: (product: Product) => products.push(product),
  replace: (id: number, product: Product) => {
    const index = products.findIndex(existing => existing.productId === id);
    if (index === -1) return undefined;
    products[index] = product;
    return products[index];
  },
  remove: (id: number) => {
    const index = products.findIndex(product => product.productId === id);
    if (index === -1) return undefined;
    return products.splice(index, 1)[0];
  }
};

export const productReviewStore = {
  all: () => productReviews,
  findByProductId: (productId: number) => productReviews.filter(review => review.productId === productId)
};

export const orderStore = {
  all: () => orders,
  findById: (id: number) => orders.find(order => order.orderId === id),
  add: (order: Order) => orders.push(order),
  replace: (id: number, order: Order) => {
    const index = orders.findIndex(existing => existing.orderId === id);
    if (index === -1) return undefined;
    orders[index] = order;
    return orders[index];
  },
  remove: (id: number) => {
    const index = orders.findIndex(order => order.orderId === id);
    if (index === -1) return undefined;
    return orders.splice(index, 1)[0];
  }
};

export const orderDetailStore = {
  all: () => orderDetails,
  findById: (id: number) => orderDetails.find(orderDetail => orderDetail.orderDetailId === id),
  add: (orderDetail: OrderDetail) => orderDetails.push(orderDetail),
  replace: (id: number, orderDetail: OrderDetail) => {
    const index = orderDetails.findIndex(existing => existing.orderDetailId === id);
    if (index === -1) return undefined;
    orderDetails[index] = orderDetail;
    return orderDetails[index];
  },
  remove: (id: number) => {
    const index = orderDetails.findIndex(orderDetail => orderDetail.orderDetailId === id);
    if (index === -1) return undefined;
    return orderDetails.splice(index, 1)[0];
  }
};

export const deliveryStore = {
  all: () => deliveries,
  findById: (id: number) => deliveries.find(delivery => delivery.deliveryId === id),
  add: (delivery: Delivery) => deliveries.push(delivery),
  replace: (id: number, delivery: Delivery) => {
    const index = deliveries.findIndex(existing => existing.deliveryId === id);
    if (index === -1) return undefined;
    deliveries[index] = delivery;
    return deliveries[index];
  },
  remove: (id: number) => {
    const index = deliveries.findIndex(delivery => delivery.deliveryId === id);
    if (index === -1) return undefined;
    return deliveries.splice(index, 1)[0];
  }
};
