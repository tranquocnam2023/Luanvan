export class ProductRequest {
    ProductId: string;
    ProductName: string;
    BasePrice: number;
    CategoryId: number;
    SupplierId: string;
    fileImageThumbnail: File | null; 
    IsVariant: boolean;

    constructor(
        ProductId: string,
        ProductName: string,
        BasePrice: number,
        CategoryId: number,
        SupplierId: string,
        fileImageThumbnail: File | null,
        IsVariant: boolean
    ) {
        this.ProductId = ProductId;
        this.ProductName = ProductName;
        this.BasePrice = BasePrice;
        this.CategoryId = CategoryId;
        this.SupplierId = SupplierId;
        this.fileImageThumbnail = fileImageThumbnail;
        this.IsVariant = IsVariant;
    }
}