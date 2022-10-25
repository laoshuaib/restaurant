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
      <el-menu-item index="ingredientManage">
        <el-icon><Chicken /></el-icon>
        <span>食材管理</span>
      </el-menu-item>
      <el-menu-item index="cuisineManage">
        <el-icon><Food /></el-icon>
        <span>菜品管理</span>
      </el-menu-item>
      <el-menu-item index="orderManage">
        <el-icon><Tickets /></el-icon>
        <span>订单管理</span>
      </el-menu-item>
      <el-menu-item index="purchaseRecord">
        <el-icon><Box /></el-icon>
        <span>采购记录</span>
      </el-menu-item>
      <el-menu-item index="userManage">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
      <el-menu-item index="feeRecord">
        <el-icon><List /></el-icon>
        <span>费用管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "managerAside",
};
</script>

<style>
/*尽量避免使用submenu，会把页面撑爆*/
.el-menu {
  height: calc(calc(100vh) - 50px);
}
</style>
