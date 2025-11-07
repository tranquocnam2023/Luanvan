export class ProductImageRequest{
    Id: number;
    ProductId: string;
    ImageProductElement: string;

    constructor(
        Id: number,
        ProductId: string,
        ImageProductElement: string
    ) {
        this.Id = Id;
        this.ProductId = ProductId;
        this.ImageProductElement = ImageProductElement;
    }
}