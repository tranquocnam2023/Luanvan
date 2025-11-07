// src/infrastructure/repositories/DashboardRepository.ts
import { http } from "@/infrastructure/api/http";

export class DashboardRepository {
  async getOverview() {
    try {
      const [usersRes, categoriesRes, suppliersRes, productsRes] = await Promise.all([
        http.post("/User/GetAllUsers", { pageIndex: 1, pageSize: 1000 }),
        http.post("/Category/GetAllCategories", { pageIndex: 1, pageSize: 1000 }),
        http.post("/Supplier/GetAllSuppliers", { pageIndex: 1, pageSize: 1000 }),
        http.post("/Product/GetAllProduct", { pageIndex: 1, pageSize: 1000 }),
      ]);

      return {
        totalUsers: usersRes?.data?.totalCounts || 0,
        totalCategories: categoriesRes?.data?.totalCounts || 0,
        totalSuppliers: suppliersRes?.data?.totalCounts || 0,
        totalProducts: productsRes?.data?.totalCounts || 0,
      };
    } catch (error: any) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", error.message);
      throw new Error(error.message || "Không thể tải dữ liệu tổng quan");
    }
  }
}
