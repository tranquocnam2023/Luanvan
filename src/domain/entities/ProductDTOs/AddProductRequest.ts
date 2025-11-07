export class ProductRequest {
    ProductName: string;
    BasePrice: number;
    CategoryId: number;
    SupplierId: string;
    fileImageThumbnail: File | null; 
    IsVariant: boolean;

    constructor(
        ProductName: string,
        BasePrice: number,
        CategoryId: number,
        SupplierId: string,
        fileImageThumbnail: File | null,
        IsVariant: boolean
    ) {
        this.ProductName = ProductName;
        this.BasePrice = BasePrice;
        this.CategoryId = CategoryId;
        this.SupplierId = SupplierId;
        this.fileImageThumbnail = fileImageThumbnail;
        this.IsVariant = IsVariant;
    }
}