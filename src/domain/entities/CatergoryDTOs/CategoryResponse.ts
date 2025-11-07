export class CategoryResponse {
    Id: number;
    CategoryName: string;
    ParentCategoryId: number;
    ChildCategories?: CategoryResponse[];

    constructor({ Id, CategoryName, ParentCategoryId, ChildCategories }: { Id: number; CategoryName: string; ParentCategoryId: number; ChildCategories?: CategoryResponse[] }) {
        this.Id = Id;
        this.CategoryName = CategoryName;
        this.ParentCategoryId = ParentCategoryId;
        this.ChildCategories = ChildCategories;
    }

    static fromJSON(json:any): CategoryResponse {
        return new CategoryResponse({
            Id: json.id,
            CategoryName: json.categoryName,
            ParentCategoryId: json.parentCategoryId,
            ChildCategories: json.childCates?.map((child: any) => CategoryResponse.fromJSON(child))
        });
    
    }
}