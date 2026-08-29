import axios from 'axios';
import { api } from './config';
import { frontendLogger } from '../logger';
import { Product, ProductDetail, ProductReview } from '../types/product';

const productUrl = (path = '') => `${api.baseURL}${api.endpoints.products}${path}`;

export const fetchProducts = async (): Promise<Product[]> => {
  const url = productUrl();
  frontendLogger.apiRequest('GET', url);
  const { data, status } = await axios.get<Product[]>(url);
  frontendLogger.apiResponse('GET', url, status, { count: data.length });
  return data;
};

export const fetchProductDetail = async (productId: string): Promise<ProductDetail> => {
  const url = productUrl(`/${productId}`);
  frontendLogger.apiRequest('GET', url);
  const { data, status } = await axios.get<ProductDetail>(url);
  frontendLogger.apiResponse('GET', url, status, { productId: data.productId });
  return data;
};

export const fetchProductReviews = async (productId: string): Promise<ProductReview[]> => {
  const url = productUrl(`/${productId}/reviews`);
  frontendLogger.apiRequest('GET', url);
  const { data, status } = await axios.get<ProductReview[]>(url);
  frontendLogger.apiResponse('GET', url, status, { count: data.length });
  return data;
};

export const fetchRelatedProducts = async (productId: string): Promise<Product[]> => {
  const url = productUrl(`/${productId}/related?limit=4`);
  frontendLogger.apiRequest('GET', url);
  const { data, status } = await axios.get<Product[]>(url);
  frontendLogger.apiResponse('GET', url, status, { count: data.length });
  return data;
};
