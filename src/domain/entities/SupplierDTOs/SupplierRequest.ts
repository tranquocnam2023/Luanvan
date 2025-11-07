export class SupplierRequest {
    Id:string;
    SupplierName: string;
    SupplierAddress: string;
    SupplierPhone: string;

    constructor(
        Id: string,
        SupplierName: string,
        SupplierAddress: string,
        SupplierPhone: string
    ) {
        this.Id = Id;
        this.SupplierName = SupplierName;
        this.SupplierAddress = SupplierAddress;
        this.SupplierPhone = SupplierPhone;
    }
    
}