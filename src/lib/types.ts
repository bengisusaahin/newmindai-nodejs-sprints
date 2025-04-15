export type Employee = {
    ad: string;
    soyad: string;
    email: string;
    pozisyon: string;
    ise_giris_tarihi: string;
    maas: number;
  };

  export type ApiResponse<T> = {
    success: boolean;
    data: T;
    error?: string | undefined;
  };