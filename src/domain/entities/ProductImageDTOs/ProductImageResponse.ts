export class ProductImageResponse {
  Id: number
  ProductId: string
  ImageProductElement: string

  constructor({
    Id,
    ProductId,
    ImageProductElement,
  }: {
    Id: number
    ProductId: string
    ImageProductElement: string
  }) {
    this.Id = Id
    this.ProductId = ProductId
    this.ImageProductElement = ImageProductElement
  }

  static fromJSON(json: any): ProductImageResponse {
    return new ProductImageResponse({
      Id: json.id,
      ProductId: json.productId,
      ImageProductElement: json.imageProductElement,
    })
  }
}
