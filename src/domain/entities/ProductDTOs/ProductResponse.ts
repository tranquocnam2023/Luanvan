import { ProductImageResponse } from "../ProductImageDTOs/ProductImageResponse";

export class ProductResponse{
    ProductId: string;
    ProductName: string;
    BasePrice: number;
    CategoryId: number;
    CategoryName: string;
    SupplierId: string;
    SupplierName: string;
    ThumbnailUrl: string;
    IsVariant: boolean;
    
    // ProductImages: ProductImageResponse[] | undefined;


    constructor({
        ProductId,
        ProductName,
        BasePrice,
        CategoryId,
        CategoryName,
        SupplierId,
        SupplierName,
        ThumbnailUrl,
        IsVariant,
        // ProductImages,

    }: {
        ProductId: string;
        ProductName: string;
        BasePrice: number;
        CategoryId: number;
        CategoryName: string;
        SupplierId: string;
        SupplierName: string;
        ThumbnailUrl: string;
        IsVariant: boolean;
        // ProductImages: ProductImageResponse[];

    }) {
        this.ProductId = ProductId;
        this.ProductName = ProductName;
        this.BasePrice = BasePrice;
        this.CategoryId = CategoryId;
        this.CategoryName = CategoryName;
        this.SupplierId = SupplierId;
        this.SupplierName = SupplierName;
        this.ThumbnailUrl = ThumbnailUrl;
        this.IsVariant = IsVariant;
        // this.ProductImages = ProductImages;

    }
    static fromJSON(json: any): ProductResponse {
        return new ProductResponse({
            ProductId: json.productId,
            ProductName: json.productName,
            BasePrice: json.basePrice,
            CategoryId: json.cateId,
            CategoryName: json.cateName,
            SupplierId: json.supplierId,
            SupplierName: json.supplierName,
            ThumbnailUrl: json.thumbnailUrl,
            IsVariant: json.isVariant,
            // ProductImages: json.productImages?.map((imgJson: any) => ProductImageResponse.fromJSON(imgJson)),
        });
    }
}