export type Employee = {
  ad: string;
  soyad: string;
  email: string;
  pozisyon: string;
  ise_giris_tarihi: string;
  maas: number;
};

export type EmployeeWithoutSalary = Omit<Employee, 'maas'>;

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  store_id: number;
  category_id: number;
  rating: number;
  sell_count: number;
  images: {
    url: string;
    index: number;
  }[];
};

