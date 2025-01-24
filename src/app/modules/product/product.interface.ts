// import { Model } from "mongoose";

export interface Product {
  name: string;
  brand: string;
  price: number;
  type: 'Mountain' | 'Road' | 'Hybrid' | 'BMX' | 'Electric';
  description: string;
  quantity: number;
  inStock: boolean;
}

// export interface StudentModel extends Model<Product>  {
//   isUserExits(id: string) : Promise<Product | null>
// };
