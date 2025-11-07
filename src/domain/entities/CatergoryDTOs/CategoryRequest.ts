export class CategoryRequest {
    Id: number;
    CategoryName: string;
    ParentCategoryId: number | null; 

    constructor({ Id, CategoryName, ParentCategoryId }: { Id: number; CategoryName: string; ParentCategoryId: number|null }) {
        this.Id = Id;
        this.CategoryName = CategoryName;
        this.ParentCategoryId = ParentCategoryId;
    }

}