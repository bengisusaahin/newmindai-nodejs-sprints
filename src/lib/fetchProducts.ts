import axios from 'axios';
import { Product, ProductApiResponse } from './types';

export async function fetchProducts(): Promise<Product[]> {
  const baseUrl = 'https://e-commerce-m3d4.onrender.com/products';
  const query = 'sort=rating:desc&limit=10';
  const urls = Array.from({ length: 10 }, (_, i) => `${baseUrl}?${query}&offset=${i * 10}`);

  const responses = await Promise.all(urls.map(url => axios.get<ProductApiResponse>(url)));
  return responses.flatMap(res => res.data.products);
}
