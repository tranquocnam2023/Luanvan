// src/infrastructure/repositories/DashboardRepository.ts
import { http } from "@/infrastructure/api/http";

export class DashboardRepository {
  async getOverview() {
    try {
      // Gọi API
      const [usersRes, categoriesRes, suppliersRes, productsRes] = await Promise.all([
        http.post("/User/GetAllUsers", { pageIndex: 1, pageSize: 1000 }),
        http.post("/Category/GetAllCategories", { pageIndex: 1, pageSize: 1000 }),
        http.post("/Supplier/GetAllSuppliers", { pageIndex: 1, pageSize: 1000 }),
        http.post("/Product/GetAllProduct", { pageIndex: 1, pageSize: 1000 }),
      ]);

      // Hàm đếm đệ quy (đếm cả cha, con, cháu)
      const countCategoriesRecursive = (items: any[]): number => {
        if (!items || items.length === 0) return 0;
        return items.reduce((count, cat) => {
          return count + 1 + countCategoriesRecursive(cat.childCates || []);
        }, 0);
      };

      const totalUsers =
        usersRes?.data?.totalCounts ??
        usersRes?.data?.items?.length ??
        usersRes?.data?.length ??
        0;

      const totalCategories =
        categoriesRes?.data?.totalCounts && categoriesRes?.data?.totalCounts > 0
          ? categoriesRes?.data?.totalCounts
          : countCategoriesRecursive(categoriesRes?.data?.items || []);

      const totalSuppliers =
        suppliersRes?.data?.totalCounts ??
        suppliersRes?.data?.items?.length ??
        suppliersRes?.data?.length ??
        0;

      const totalProducts =
        productsRes?.data?.totalCounts ??
        productsRes?.data?.items?.length ??
        productsRes?.data?.length ??
        0;

      console.log(" Dữ liệu Dashboard:", {
        totalUsers,
        totalCategories,
        totalSuppliers,
        totalProducts,
      });

      return {
        totalUsers,
        totalCategories,
        totalSuppliers,
        totalProducts,
      };
    } catch (error: any) {
      console.error(" Lỗi khi tải dữ liệu Dashboard:", error.message);
      throw new Error(error.message || "Không thể tải dữ liệu tổng quan");
    }
  }
}
