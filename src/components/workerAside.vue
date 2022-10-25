<!--suppress CssUnusedSymbol -->
<template>
  <div>
    <el-menu
      active-text-color="#dc143c"
      background-color="#fdf6ec"
      default-active="orderMeal"
      router
      :default-openeds="[1]"
    >
      <el-menu-item index="orderMeal">
        <el-icon><Dish /></el-icon>
        <span>点单</span>
      </el-menu-item>
      <el-menu-item index="ingredientReserves">
        <el-icon><Chicken /></el-icon>
        <span>食材库存</span>
      </el-menu-item>
      <el-menu-item index="cuisineDetails">
        <el-icon><Food /></el-icon>
        <span>菜品管理</span>
      </el-menu-item>
      <el-menu-item index="orderManage">
        <el-icon><Tickets /></el-icon>
        <span>订单管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "workerAside",
};
</script>

<style>
/*尽量避免使用submenu，会把页面撑爆*/
.el-menu {
  height: calc(calc(100vh) - 50px);
}
</style>
