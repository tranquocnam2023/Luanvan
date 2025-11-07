<!-- src/views/RoleView.vue (Tabbed interface with always-visible detail panels for consistent layout; placeholder for unselected items) -->
<template>
  <div class="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Tabs Header -->
    <div class="bg-white border-b border-gray-200 shadow-sm flex">
      <button @click="activeTab = 'roles'" :class="[
        'flex-1 py-3 px-4 text-center font-semibold transition-all duration-200 border-b-2',
        activeTab === 'roles'
          ? 'text-blue-600 border-blue-500 bg-blue-50'
          : 'text-gray-600 border-transparent hover:border-gray-300'
      ]">
        <i class="fa-solid fa-user-crown mr-1"></i>
        Quyền
      </button>
      <button @click="activeTab = 'functions'" :class="[
        'flex-1 py-3 px-4 text-center font-semibold transition-all duration-200 border-b-2',
        activeTab === 'functions'
          ? 'text-green-600 border-green-500 bg-green-50'
          : 'text-gray-600 border-transparent hover:border-gray-300'
      ]">
        <i class="fa-solid fa-cogs mr-1"></i>
        Chức năng
      </button>
    </div>
    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <div v-if="activeTab === 'roles'" class="flex flex-1">
        <!-- Left Panel: Roles List -->
        <div class="flex-1 bg-white border-r border-gray-200 shadow-lg flex flex-col">
          <!-- Header -->
          <div
            class="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <i class="fa-solid fa-user-crown text-xl text-blue-600"></i>
              <h2 class="text-xl font-bold text-gray-900">Danh sách quyền</h2>
            </div>
            <button @click.stop="openAddRole"
              class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center space-x-1 text-sm shadow-sm">
              <i class="fa-solid fa-plus"></i>
              <span>Thêm quyền</span>
            </button>
          </div>
          <!-- List Content -->
          <div class="flex-1 overflow-y-auto" @click="deselect">
            <!-- Loading -->
            <div v-if="loading" class="flex justify-center items-center h-48">
              <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600 shadow-lg">
              </div>
            </div>
            <!-- Error -->
            <div v-else-if="error" class="p-4">
              <div
                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative shadow-sm animate-pulse">
                {{ error }}
                <button @click.stop="clearRoleError"
                  class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold transition-colors duration-200">&times;</button>
              </div>
            </div>
            <!-- Empty State -->
            <div v-else-if="!roles?.data?.length" class="text-center py-16 px-4">
              <div
                class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i class="fa-solid fa-user-crown text-3xl text-gray-400"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Chưa có quyền nào</h3>
              <p class="text-gray-600 mb-4 text-base">Bắt đầu bằng cách thêm quyền đầu tiên.</p>
              <button @click.stop="openAddRole"
                class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-md transform hover:scale-105 transition-all duration-300 shadow-sm">
                <i class="fa-solid fa-plus mr-1"></i>
                Thêm quyền
              </button>
            </div>
            <!-- Roles Table -->
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mã quyền
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tên quyền
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Số chức
                      năng</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hành động
                    </th>
                  </tr>
                </thead>
                <transition-group name="list" tag="tbody" class="bg-white divide-y divide-gray-200">
                  <tr v-for="role in roles.data" :key="role.RoleId"
                    class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer"
                    @click.stop="selectRole(role)">
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 bg-gray-50 rounded-l-lg">
                      {{ role.RoleId }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{{ role.RoleName }}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {{ (role.RoleFunctions || []).filter(f => f.IsActive).length }} / {{ (role.RoleFunctions || []).length }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2 rounded-r-lg">
                      <button @click.stop="startEditRole(role)"
                        class="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 px-2 py-1 rounded-md transition-all duration-200 transform hover:scale-105 text-xs">
                        <i class="fa-solid fa-edit mr-1"></i> Sửa
                      </button>
                      <button @click.stop="confirmDelete(role)"
                        class="text-red-600 hover:text-red-900 hover:bg-red-50 px-2 py-1 rounded-md transition-all duration-200 transform hover:scale-105 text-xs">
                        <i class="fa-solid fa-trash mr-1"></i> Xóa
                      </button>
                    </td>
                  </tr>
                </transition-group>
              </table>
            </div>
            <!-- Pagination -->
            <div
              class="px-4 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
              <div class="text-xs text-gray-600">
                Hiển thị <span class="font-bold text-gray-900">{{ ((roles?.pageIndex || 1) - 1) * (roles?.pageSize ||
                  10) + 1 }}</span> đến
                <span class="font-bold text-gray-900">{{ Math.min((roles?.pageIndex || 1) * (roles?.pageSize || 10),
                  roles?.totalCounts || 0) }}</span> của
                <span class="font-bold text-gray-900">{{ roles?.totalCounts || 0 }}</span> kết quả
              </div>
              <div class="flex space-x-1">
                <button @click.stop="changePage((roles?.pageIndex || 1) - 1)" :disabled="(roles?.pageIndex || 1) === 1"
                  class="px-3 py-1 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105">
                  <i class="fa-solid fa-chevron-left mr-1"></i> Trước
                </button>
                <button @click.stop="changePage(i)" v-for="i in Math.min(5, totalPages)" :key="i" :class="[
                  'px-3 py-1 border border-gray-300 rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-105',
                  i === (roles?.pageIndex || 1) ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-gray-700 bg-white hover:bg-gray-50'
                ]">
                  {{ i }}
                </button>
                <span v-if="totalPages > 5" class="px-3 py-1 text-xs text-gray-500">...</span>
                <button v-if="totalPages > 5" @click.stop="changePage(totalPages)"
                  class="px-3 py-1 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105">
                  {{ totalPages }}
                </button>
                <button @click.stop="changePage((roles?.pageIndex || 1) + 1)"
                  :disabled="(roles?.pageIndex || 1) >= totalPages"
                  class="px-3 py-1 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105">
                  Sau <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Right Panel: Roles Detail -->
        <div v-if="editModeRole || selectedRole" class="flex-1 flex flex-col overflow-hidden bg-white shadow-lg">
          <transition name="slide">
            <div key="detail" class="h-full flex flex-col animate-fade-in">
              <!-- Detail Header -->
              <div class="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
                <div class="flex items-center justify-between">
                  <button @click.stop="editModeRole ? cancelEditRole() : deselect()"
                    class="text-gray-600 hover:text-gray-900 flex items-center space-x-2 text-xs font-medium transition-colors duration-200 transform hover:scale-105">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>{{ editModeRole ? 'Hủy' : 'Quay lại' }}</span>
                  </button>
                  <h3 class="text-lg font-bold text-gray-900 flex-1 text-center">
                    {{ editModeRole ? (selectedRole ? `Sửa: ${selectedRole.RoleName}` : 'Thêm quyền mới') : (selectedRole?.RoleName || '') }}
                  </h3>
                </div>
              </div>
              <!-- Detail Content -->
              <div class="flex-1 overflow-y-auto">
                <div class="p-4 space-y-6">
                  <!-- Edit/Add Mode -->
                  <div v-if="editModeRole" class="space-y-6">
                    <form @submit.prevent="handleSubmitRole" class="space-y-4">
                      <div v-if="!isAddMode" class="space-y-2">
                        <label class="block text-xs font-semibold text-gray-700">Mã quyền</label>
                        <input v-model="formData.RoleId" type="text"
                          class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-200 text-sm"
                          :disabled="!isAddMode" />
                      </div>
                      <div class="space-y-2">
                        <label class="block text-xs font-semibold text-gray-700">Tên quyền</label>
                        <input v-model="formData.RoleName" type="text" required
                          class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-blue-500 transition-all duration-200 text-sm" />
                      </div>
                      <!-- Functions section -->
                      <div class="space-y-2">
                        <label class="block text-xs font-semibold text-gray-700">Quyền chức năng</label>
                        <div v-if="allFunctions.length === 0 && loadingAssignment"
                          class="flex justify-center items-center h-24">
                          <i class="fa-solid fa-spinner fa-spin text-blue-600"></i>
                        </div>
                        <div v-else-if="allFunctions.length === 0" class="text-gray-500 text-xs italic">Không có chức năng nào để gán.</div>
                        <div v-else
                          class="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
                          <label v-for="func in allFunctions" :key="func.FunctionId"
                            class="flex items-center space-x-3 p-2 rounded hover:bg-white cursor-pointer transition-colors text-xs">
                            <input type="checkbox" :id="`func-${func.FunctionId}`"
                              :checked="isActiveMap.get(func.FunctionId) || false"
                              @change="toggleFunction(func.FunctionId, ($event.target as HTMLInputElement).checked)"
                              class="rounded border-gray-300 focus:ring-blue-500 h-3 w-3 text-blue-600" />
                            <label :for="`func-${func.FunctionId}`"
                              class="text-xs text-gray-700 cursor-pointer select-none">
                              {{ func.FunctionName }}
                            </label>
                          </label>
                        </div>
                      </div>
                      <div class="flex justify-end space-x-2 pt-4">
                        <button type="button" @click.stop="cancelEditRole"
                          class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 text-sm">
                          Hủy
                        </button>
                        <button type="submit" :disabled="submitting"
                          class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-md disabled:opacity-50 transition-all duration-200 transform hover:scale-105 flex items-center space-x-1 shadow-sm text-sm">
                          <i v-if="submitting" class="fa-solid fa-spinner fa-spin"></i>
                          <span>{{ isAddMode ? 'Thêm' : 'Cập nhật' }}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                  <!-- View Mode -->
                  <div v-else class="space-y-6">
                    <div class="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-gray-700">Mã quyền</label>
                          <p class="text-lg font-bold text-gray-900">{{ selectedRole?.RoleId }}</p>
                        </div>
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-gray-700">Tên quyền</label>
                          <p class="text-lg font-bold text-gray-900">{{ selectedRole?.RoleName }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                      <h4 class="text-base font-bold text-gray-900 mb-3 flex items-center justify-between">
                        <span>Chức năng được gán</span>
                        <span
                          class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {{ activeFunctions.length }} / {{ allFunctions.length }}
                        </span>
                      </h4>
                      <div v-if="activeFunctions.length > 0" class="space-y-2 max-h-32 overflow-y-auto">
                        <div v-for="func in activeFunctions" :key="func.FunctionId"
                          class="flex items-center p-2 bg-gray-50 rounded text-xs">
                          <i class="fa-solid fa-check-circle text-green-500 mr-2"></i>
                          <span class="font-medium text-gray-900">{{ func.FunctionName }}</span>
                        </div>
                      </div>
                      <div v-else class="text-center py-6 bg-gray-50 rounded">
                        <i class="fa-solid fa-info-circle text-2xl text-gray-400 mb-2"></i>
                        <p class="text-gray-500 text-xs">Không có chức năng nào được gán.</p>
                      </div>
                    </div>
                    <div
                      class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-b-xl">
                      <button @click.stop="startEditRole(selectedRole!)"
                        class="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-1 shadow-sm text-sm">
                        <i class="fa-solid fa-edit"></i>
                        <span>Sửa</span>
                      </button>
                      <button @click.stop="confirmDelete(selectedRole!)"
                        class="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-1 shadow-sm text-sm">
                        <i class="fa-solid fa-trash"></i>
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Functions Tab -->
      <div v-if="activeTab === 'functions'" class="flex flex-1">
        <!-- Left Panel: Functions List -->
        <div class="flex-1 bg-white border-r border-gray-200 shadow-lg flex flex-col">
          <!-- Header -->
          <div
            class="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <i class="fa-solid fa-cogs text-xl text-green-600"></i>
              <h2 class="text-xl font-bold text-gray-900">Danh sách chức năng</h2>
            </div>
            <button @click.stop="openAddFunction"
              class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center space-x-1 text-sm shadow-sm">
              <i class="fa-solid fa-plus"></i>
              <span>Thêm chức năng</span>
            </button>
          </div>
          <!-- List Content -->
          <div class="flex-1 overflow-y-auto" @click="deselectFunction">
            <!-- Loading -->
            <div v-if="functionStore.isLoading" class="flex justify-center items-center h-48">
              <div class="animate-spin rounded-full h-10 w-10 border-4 border-green-200 border-t-green-600 shadow-lg">
              </div>
            </div>
            <!-- Error -->
            <div v-else-if="functionStore.hasError" class="p-4">
              <div
                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative shadow-sm animate-pulse">
                {{ functionStore.error }}
                <button @click.stop="clearFunctionError"
                  class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold transition-colors duration-200">&times;</button>
              </div>
            </div>
            <!-- Empty State -->
            <div v-else-if="functionStore.isEmpty" class="text-center py-16 px-4">
              <div
                class="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i class="fa-solid fa-cogs text-3xl text-gray-400"></i>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Chưa có chức năng nào</h3>
              <p class="text-gray-600 mb-4 text-base">Bắt đầu bằng cách thêm chức năng đầu tiên.</p>
              <button @click.stop="openAddFunction"
                class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:shadow-md transform hover:scale-105 transition-all duration-300 shadow-sm">
                <i class="fa-solid fa-plus mr-1"></i>
                Thêm chức năng
              </button>
            </div>
            <!-- Functions Table -->
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mã chức
                      năng</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tên chức
                      năng</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hành động
                    </th>
                  </tr>
                </thead>
                <transition-group name="list" tag="tbody" class="bg-white divide-y divide-gray-200">
                  <tr v-for="func in functionStore.getFunctions" :key="func.FunctionId"
                    class="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 cursor-pointer"
                    @click.stop="selectFunction(func)">
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 bg-gray-50 rounded-l-lg">
                      {{ func.FunctionId }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{{ func.FunctionName }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2 rounded-r-lg">
                      <button @click.stop="startEditFunction(func)"
                        class="text-green-600 hover:text-green-900 hover:bg-green-50 px-2 py-1 rounded-md transition-all duration-200 transform hover:scale-105 text-xs">
                        <i class="fa-solid fa-edit mr-1"></i> Sửa
                      </button>
                      <button @click.stop="confirmDeleteFunction(func)"
                        class="text-red-600 hover:text-red-900 hover:bg-red-50 px-2 py-1 rounded-md transition-all duration-200 transform hover:scale-105 text-xs">
                        <i class="fa-solid fa-trash mr-1"></i> Xóa
                      </button>
                    </td>
                  </tr>
                </transition-group>
              </table>
            </div>
            <!-- Functions Pagination -->
            <div v-if="functionTotalPages > 1"
              class="px-4 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
              <div class="text-xs text-gray-600">
                Hiển thị <span class="font-bold text-gray-900">{{ ((functionStore.getPaginationData?.pageIndex || 1) -
                  1) * (functionStore.getPaginationData?.pageSize || 10) + 1 }}</span> đến
                <span class="font-bold text-gray-900">{{ Math.min((functionStore.getPaginationData?.pageIndex || 1) *
                  (functionStore.getPaginationData?.pageSize || 10), functionStore.getPaginationData?.totalCounts || 0)
                  }}</span> của
                <span class="font-bold text-gray-900">{{ functionStore.getPaginationData?.totalCounts || 0 }}</span> kết quả
              </div>
              <div class="flex space-x-1">
                <button @click.stop="changeFunctionPage((functionStore.getPaginationData?.pageIndex || 1) - 1)"
                  :disabled="(functionStore.getPaginationData?.pageIndex || 1) === 1"
                  class="px-3 py-1 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105">
                  <i class="fa-solid fa-chevron-left mr-1"></i> Trước
                </button>
                <button @click.stop="changeFunctionPage(i)" v-for="i in Math.min(5, functionTotalPages)" :key="i"
                  :class="[
                    'px-3 py-1 border border-gray-300 rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-105',
                    i === (functionStore.getPaginationData?.pageIndex || 1) ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md' : 'text-gray-700 bg-white hover:bg-gray-50'
                  ]">
                  {{ i }}
                </button>
                <span v-if="functionTotalPages > 5" class="px-3 py-1 text-xs text-gray-500">...</span>
                <button v-if="functionTotalPages > 5" @click.stop="changeFunctionPage(functionTotalPages)"
                  class="px-3 py-1 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105">
                  {{ functionTotalPages }}
                </button>
                <button @click.stop="changeFunctionPage((functionStore.getPaginationData?.pageIndex || 1) + 1)"
                  :disabled="(functionStore.getPaginationData?.pageIndex || 1) >= functionTotalPages"
                  class="px-3 py-1 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105">
                  Sau <i class="fa-solid fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Right Panel: Functions Detail -->
        <div v-if="editModeFunction || selectedFunction" class="flex-1 flex flex-col overflow-hidden bg-white shadow-lg">
          <transition name="slide">
            <div key="detail"
              class="h-full flex flex-col animate-fade-in">
              <!-- Detail Header -->
              <div class="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 flex-shrink-0">
                <div class="flex items-center justify-between">
                  <button @click.stop="editModeFunction ? cancelEditFunction() : deselectFunction()"
                    class="text-gray-600 hover:text-gray-900 flex items-center space-x-2 text-xs font-medium transition-colors duration-200 transform hover:scale-105">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>{{ editModeFunction ? 'Hủy' : 'Quay lại' }}</span>
                  </button>
                  <h3 class="text-lg font-bold text-gray-900 flex-1 text-center">
                    {{ editModeFunction ? (selectedFunction ? `Sửa: ${selectedFunction.FunctionName}` : 'Thêm chức năng mới') : (selectedFunction?.FunctionName || '') }}
                  </h3>
                </div>
              </div>
              <!-- Detail Content -->
              <div class="flex-1 overflow-y-auto">
                <div class="p-4 space-y-6">
                  <!-- Edit/Add Mode -->
                  <div v-if="editModeFunction" class="space-y-6">
                    <form @submit.prevent="handleSubmitFunction" class="space-y-4">
                      <div v-if="!isAddFunctionMode" class="space-y-2">
                        <label class="block text-xs font-semibold text-gray-700">Mã chức năng</label>
                        <input v-model="functionFormData.FunctionId" type="text"
                          class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-green-500 transition-all duration-200 text-sm"
                          :disabled="!isAddFunctionMode" />
                      </div>
                      <div class="space-y-2">
                        <label class="block text-xs font-semibold text-gray-700">Tên chức năng</label>
                        <input v-model="functionFormData.FunctionName" type="text" required
                          class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-green-500 transition-all duration-200 text-sm" />
                      </div>
                      <div class="flex justify-end space-x-2 pt-4">
                        <button type="button" @click.stop="cancelEditFunction"
                          class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 transform hover:scale-105 text-sm">
                          Hủy
                        </button>
                        <button type="submit" :disabled="functionSubmitting"
                          class="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-md disabled:opacity-50 transition-all duration-200 transform hover:scale-105 flex items-center space-x-1 shadow-sm text-sm">
                          <i v-if="functionSubmitting" class="fa-solid fa-spinner fa-spin"></i>
                          <span>{{ isAddFunctionMode ? 'Thêm' : 'Cập nhật' }}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                  <!-- View Mode -->
                  <div v-else class="space-y-6">
                    <div class="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-gray-700">Mã chức năng</label>
                          <p class="text-lg font-bold text-gray-900">{{ selectedFunction?.FunctionId }}</p>
                        </div>
                        <div class="space-y-2">
                          <label class="block text-xs font-bold text-gray-700">Tên chức năng</label>
                          <p class="text-lg font-bold text-gray-900">{{ selectedFunction?.FunctionName }}</p>
                        </div>
                      </div>
                    </div>
                    <div
                      class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-b-xl">
                      <button @click.stop="startEditFunction(selectedFunction!)"
                        class="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-1 shadow-sm text-sm">
                        <i class="fa-solid fa-edit"></i>
                        <span>Sửa</span>
                      </button>
                      <button @click.stop="confirmDeleteFunction(selectedFunction!)"
                        class="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-1 shadow-sm text-sm">
                        <i class="fa-solid fa-trash"></i>
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal (Shared) -->
    <div v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        class="bg-white rounded-xl shadow-xl max-w-sm w-full max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100">
        <div class="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-t-xl">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shadow-md">
              <i class="fa-solid fa-exclamation-triangle text-red-600 text-lg"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900">Xác nhận xóa</h3>
          </div>
          <p v-html="deleteMessage" class="text-gray-600 mb-6 leading-relaxed text-sm"></p>
        </div>
        <div class="p-6 border-t border-gray-200">
          <div class="flex justify-end space-x-3">
            <button @click.stop="showDeleteModal = false"
              class="px-6 py-3 text-gray-700 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 shadow-sm text-sm">
              <i class="fa-solid fa-times"></i>
              <span>Hủy</span>
            </button>
            <button @click.stop="handleDelete"
              class="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 shadow-sm text-sm">
              <i class="fa-solid fa-trash"></i>
              <span>Xóa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoleStore } from "@/application/stores/RoleStore";
import { useFunctionStore } from "@/application/stores/FunctionStore";
import type { RoleResponse } from "@/domain/entities/RoleDTOs/RoleResponse";
import { RoleRequest } from "@/domain/entities/RoleDTOs/RoleRequest";
import type { RoleFunctionResponse } from "@/domain/entities/RoleFunctionDTOs/RoleFunctionResponse";
import type { FunctionResponse } from "@/domain/entities/FunctionDTOs/FunctionResponse";
import type { FunctionRequest } from "@/domain/entities/FunctionDTOs/FunctionRequest";
import type { PaginationParams } from "@/domain/values-objects/PaginationParams";
import { RoleFunctionRequest } from "@/domain/entities/RoleFunctionDTOs/RoleFunctionRequest";
import type { ApiResponse } from "@/domain/values-objects/ApiResponse";

const roleStore = useRoleStore();
const functionStore = useFunctionStore();

const { getAllFunctions, clearError: clearFunctionError, addFunction, updateFunction, deleteFunction } = functionStore;

const activeTab = ref<'roles' | 'functions'>('roles');

const { roles: rolePagination, loading, error } = storeToRefs(roleStore);
const roles = computed(() => rolePagination.value);
const { getAllRoles, clearError: clearRoleError, addRoles, updateRoles, deleteRoles } = roleStore;

const showDeleteModal = ref(false);
const deleteMessage = ref("");
const deleteRoleId = ref("");
const deleteFunctionId = ref("");
const submitting = ref(false);
const selectedRole = ref<RoleResponse | null>(null);
const editModeRole = ref(false);
const formData = ref({
  RoleId: "",
  RoleName: "",
});
const isAddMode = computed(() => editModeRole.value && !selectedRole.value);
const isActiveMap = ref<Map<string, boolean>>(new Map());
const assignmentFunctions = ref<FunctionResponse[]>([]);
const loadingAssignment = ref(false);
const allFunctions = computed(() => assignmentFunctions.value);

//const allFunctions = computed(() => 
//  assignmentFunctions.value.filter(
//    f => f.FunctionName !== "Quản lý hàng hóa"
//  )
//);


const functionSubmitting = ref(false);
const selectedFunction = ref<FunctionResponse | null>(null);
const editModeFunction = ref(false);
const functionFormData = ref<FunctionRequest>({
  FunctionId: "",
  FunctionName: "",
});
const isAddFunctionMode = computed(() => editModeFunction.value && !selectedFunction.value);

// Computed: Total pages for roles
const totalPages = computed(() => {
  const r = roles.value;
  if (!r?.totalCounts) return 1;
  return Math.ceil(r.totalCounts / (r.pageSize || 10)) || 1;
});

// Computed: Total pages for functions
const functionTotalPages = computed(() => {
  const f = functionStore.getPaginationData;
  if (!f?.totalCounts) return 1;
  return Math.ceil(f.totalCounts / (f.pageSize || 10)) || 1;
});

// Computed: Active functions for view mode
const activeFunctions = computed(() => {
  if (!selectedRole.value || !allFunctions.value.length) return [];
  const roleFunctions = selectedRole.value.RoleFunctions || [];
  const activeIds = new Set(roleFunctions.filter(rf => rf.IsActive).map(rf => rf.FunctionId));
  return allFunctions.value.filter(f => activeIds.has(f.FunctionId));
});

// Load all functions for assignment
const loadAllFunctionsForAssignment = async () => {
  if (assignmentFunctions.value.length > 0) return;
  loadingAssignment.value = true;
  try {
    const currentPage = functionStore.getPaginationData?.pageIndex || 1;
    // Fetch with large page size for all functions
    await getAllFunctions({ pageIndex: 1, pageSize: 1000 });
    // Copy to assignment
    assignmentFunctions.value = [...functionStore.getFunctions];
    // Refetch current page with small page size for list
    await getAllFunctions({ pageIndex: currentPage, pageSize: 10 });
  } catch (err) {
    console.error('Error loading all functions for assignment:', err);
  } finally {
    loadingAssignment.value = false;
  }
};

// Load initial data
onMounted(async () => {
  await getAllRoles({ pageIndex: 1, pageSize: 10 });
  await loadAllFunctionsForAssignment();
  await getAllFunctions({ pageIndex: 1, pageSize: 10 });
});

// Watch tab changes to deselect selections
watch(activeTab, () => {
  deselect();
  deselectFunction();
  editModeRole.value = false;
  editModeFunction.value = false;
});

// Roles Pagination
const changePage = async (page: number) => {
  const r = roles.value;
  if (page >= 1 && page <= (r?.totalPages || 1)) {
    await getAllRoles({ pageIndex: page, pageSize: r?.pageSize || 10 });
  }
};

// Functions Pagination
const changeFunctionPage = async (page: number) => {
  const f = functionStore.getPaginationData;
  if (page >= 1 && page <= functionTotalPages.value) {
    await getAllFunctions({ pageIndex: page, pageSize: 10 });
  }
};

// Roles Panel handlers
const deselect = () => {
  selectedRole.value = null;
  editModeRole.value = false;
};

const selectRole = (role: RoleResponse) => {
  selectedRole.value = role;
  editModeRole.value = false;
};

const openAddRole = async () => {
  formData.value = { RoleId: "", RoleName: "" };
  isActiveMap.value.clear();
  editModeRole.value = true;
  selectedRole.value = null;
  if (assignmentFunctions.value.length === 0) {
    await loadAllFunctionsForAssignment();
  }
};

const startEditRole = async (role: RoleResponse) => {
  selectedRole.value = role;
  formData.value = {
    RoleId: role.RoleId,
    RoleName: role.RoleName
  };
  const roleFunctions = role.RoleFunctions || [];
  isActiveMap.value = new Map(roleFunctions.map(rf => [rf.FunctionId, rf.IsActive]));
  editModeRole.value = true;
  if (assignmentFunctions.value.length === 0) {
    await loadAllFunctionsForAssignment();
  }
};

const cancelEditRole = () => {
  editModeRole.value = false;
  if (isAddMode.value) {
    selectedRole.value = null;
  }
  // If editing existing, keep selectedRole for view mode
};

const toggleFunction = (functionId: string, checked: boolean) => {
  isActiveMap.value.set(functionId, checked);
};

const handleSubmitRole = async () => {
  if (!formData.value.RoleName.trim()) {
    alert("Vui lòng nhập tên quyền!");
    return;
  }

  submitting.value = true;
  const wasAdd = isAddMode.value;
  const roleId = formData.value.RoleId.trim();
  const currentPage = roles.value?.pageIndex || 1;
  const currentSize = roles.value?.pageSize || 10;

  try {
    const roleFunctionRequests = allFunctions.value.map((func: FunctionResponse) =>
      new RoleFunctionRequest({
        RoleId: roleId,
        FunctionId: func.FunctionId,
        IsActive: isActiveMap.value.get(func.FunctionId) || false
      })
    );
    const request = new RoleRequest({
      RoleId: roleId,
      RoleName: formData.value.RoleName.trim(),
      roleFunctionRequests
    });

    let updatedRole: RoleResponse | null = null;
    let response: ApiResponse<RoleResponse>;
    if (wasAdd == true) {
      response = await addRoles(request);
      updatedRole = response.data;
    } else {
      response = await updateRoles(request);
      updatedRole = response.data;
    }

    editModeRole.value = false;
    if (updatedRole) {
      selectedRole.value = updatedRole;
    }

    await getAllRoles({ pageIndex: currentPage, pageSize: currentSize });
  } catch (err: any) {
    console.error(err);
  } finally {
    submitting.value = false;
  }
};

// Functions Panel handlers
const deselectFunction = () => {
  selectedFunction.value = null;
  editModeFunction.value = false;
};

const selectFunction = (func: FunctionResponse) => {
  selectedFunction.value = func;
  editModeFunction.value = false;
};

const openAddFunction = async () => {
  functionFormData.value = { FunctionId: "", FunctionName: "" };
  editModeFunction.value = true;
  selectedFunction.value = null;
};

const startEditFunction = async (func: FunctionResponse) => {
  selectedFunction.value = func;
  functionFormData.value = {
    FunctionId: func.FunctionId,
    FunctionName: func.FunctionName
  };
  editModeFunction.value = true;
};

const cancelEditFunction = () => {
  editModeFunction.value = false;
  if (isAddFunctionMode.value) {
    selectedFunction.value = null;
  }
  // If editing existing, keep selectedFunction for view mode
};

const handleSubmitFunction = async () => {
  if (!functionFormData.value.FunctionName.trim()) {
    alert("Vui lòng nhập tên chức năng!");
    return;
  }

  functionSubmitting.value = true;
  const wasAdd = isAddFunctionMode.value;
  const funcId = functionFormData.value.FunctionId.trim();
  const currentPage = functionStore.getPaginationData?.pageIndex || 1;
  const currentSize = functionStore.getPaginationData?.pageSize || 10;

  try {
    const request: FunctionRequest = {
      FunctionId: funcId,
      FunctionName: functionFormData.value.FunctionName.trim(),
    };

    let updatedFunction: FunctionResponse | null = null;
    let response: ApiResponse<FunctionResponse>;
    if (wasAdd) {
      response = await addFunction(request);
      updatedFunction = response.data;
    } else {
      response = await updateFunction(request);
      updatedFunction = response.data;
    }

    editModeFunction.value = false;
    if (updatedFunction) {
      selectedFunction.value = updatedFunction;
    }

    // Reload all for assignment after add/update
    assignmentFunctions.value = [];
    await loadAllFunctionsForAssignment();
    await getAllFunctions({ pageIndex: currentPage, pageSize: currentSize });
  } catch (err: any) {
    console.error(err);
  } finally {
    functionSubmitting.value = false;
  }
};

// Shared Delete handlers
const confirmDelete = (role: RoleResponse) => {
  deleteMessage.value = `Bạn có chắc chắn muốn xóa quyền <strong class="text-red-600">${role.RoleName}</strong>?`;
  deleteRoleId.value = role.RoleId;
  deleteFunctionId.value = "";
  showDeleteModal.value = true;
};

const confirmDeleteFunction = (func: FunctionResponse) => {
  deleteMessage.value = `Bạn có chắc chắn muốn xóa chức năng <strong class="text-red-600">${func.FunctionName}</strong>?`;
  deleteFunctionId.value = func.FunctionId;
  deleteRoleId.value = "";
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  try {
    if (deleteRoleId.value) {
      await deleteRoles(deleteRoleId.value);
      // Refetch roles
      const r = roles.value;
      let currentPage = r?.pageIndex || 1;
      const currentSize = r?.pageSize || 10;
      await getAllRoles({ pageIndex: currentPage, pageSize: currentSize });
      if (roles.value && roles.value.data.length === 0 && currentPage > 1) {
        currentPage -= 1;
        await getAllRoles({ pageIndex: currentPage, pageSize: currentSize });
      }
      selectedRole.value = null;
      editModeRole.value = false;
    } else if (deleteFunctionId.value) {
      await deleteFunction(deleteFunctionId.value);
      // Refetch functions and reload assignment
      assignmentFunctions.value = [];
      await loadAllFunctionsForAssignment();
      const f = functionStore.getPaginationData;
      let currentPage = f?.pageIndex || 1;
      const currentSize = f?.pageSize || 10;
      await getAllFunctions({ pageIndex: currentPage, pageSize: currentSize });
      if (functionStore.getPaginationData && functionStore.getPaginationData.data.length === 0 && currentPage > 1) {
        currentPage -= 1;
        await getAllFunctions({ pageIndex: currentPage, pageSize: currentSize });
      }
      selectedFunction.value = null;
      editModeFunction.value = false;
    }
    showDeleteModal.value = false;
  } catch (err: any) {
    console.error(err);
  }
};
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css");

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>