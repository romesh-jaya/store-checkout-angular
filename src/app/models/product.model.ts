export class Product {
  constructor(
    public name: string,
    public unitPrice: number[],
    public barcode?: string,
    public serverId?: string
  ) {}
}
