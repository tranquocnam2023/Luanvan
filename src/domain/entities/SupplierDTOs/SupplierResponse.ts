export class SupplierResponse {
  Id: string
  SupplierName: string
  SupplierAddress: string
  SupplierPhone: string

  constructor({
    Id,
    SupplierName,
    SupplierAddress,
    SupplierPhone,
  }: {
    Id: string
    SupplierName: string
    SupplierAddress: string
    SupplierPhone: string
  }) {
    this.Id = Id
    this.SupplierName = SupplierName
    this.SupplierAddress = SupplierAddress
    this.SupplierPhone = SupplierPhone
  }

  static fromJSON(json: any): SupplierResponse {
    return new SupplierResponse({
      Id: json.id,
      SupplierName: json.supplierName,
      SupplierAddress: json.supplierAddress,
      SupplierPhone: json.supplierPhone,
    })
  }
}
