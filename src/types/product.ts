
export interface Product {
  id: string;
  name: string;
  description: string;
  subCategory?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  products: Product[];
}
