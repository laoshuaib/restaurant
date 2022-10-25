<template>
  <!--    搜索头部区域-->
  <div style="padding: 10px; height: 50px; line-height: 50px; display: flex">
    <el-input
      v-model.trim="search"
      placeholder="请输入ID"
      style="width: 20%"
      clearable
    />
    <el-button
      type="primary"
      color="#fab6b6"
      style="margin-left: 10px"
      @click="find"
      >查询</el-button
    >
    <div style="flex: 1"></div>
    <div
      style="
        width: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <el-radio-group
        v-model="type"
        fill="#fab6b6"
        text-color="#000000"
        @change="typeChange"
      >
        <el-radio-button label="综合" />
        <el-radio-button label="堂食" />
        <el-radio-button label="外卖" />
      </el-radio-group>
    </div>
  </div>
  <div style="padding: 10px">
    <el-drawer
      v-model="drawerVisible"
      title="订单内容"
      direction="rtl"
      size="35%"
    >
      <el-table :data="usingData" height="600">
        <el-table-column property="cuisineID" label="菜品ID" width="150" />
        <el-table-column property="cuisineName" label="菜品名" width="200" />
        <el-table-column property="amount" label="份数" />
      </el-table>
    </el-drawer>
    <el-drawer
      v-model="editDrawerVisible"
      title="订单编辑"
      direction="rtl"
      size="45%"
      :before-close="handleClose"
    >
      <el-table :data="usingData" height="580">
        <el-table-column property="cuisineID" label="菜品ID" width="150" />
        <el-table-column property="cuisineName" label="菜品名" width="200" />
        <el-table-column label="份数" width="200px" align="center">
          <template #default="scope">
            <el-input-number v-model="scope.row.amount" :step="1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px" align="center">
          <template #default="scope">
            <el-button size="mini" @click="handleUsingDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; margin: 10px">
        <el-button type="primary" color="#fab6b6" @click="deleteConfirm"
          >退单</el-button
        >
        <el-button
          type="primary"
          color="#fab6b6"
          style="margin-left: 500px"
          @click="update"
          >更新订单</el-button
        >
      </div>
    </el-drawer>
    <el-table :data="tableData" border="border">
      <el-table-column prop="id" label="订单ID" width="120px" />
      <el-table-column prop="customer" label="顾客名" />
      <el-table-column prop="price" label="总价(元)" />
      <el-table-column prop="type" label="类型" :formatter="format" />
      <el-table-column prop="time" label="订单时间" width="200px" />
      <el-table-column prop="userID" label="处理人ID" />
      <el-table-column prop="userName" label="处理人" />
      <el-table-column label="操作" width="300px" align="center">
        <template #default="scope">
          <el-button size="mini" @click="openDrawer(scope.row)"
            >订单内容</el-button
          >
          <el-button size="mini" @click="handleEdit(scope.row)" color="#fab6b6"
            >编辑内容</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 10px 0">
      <el-pagination
        v-model:currentPage="currentPage"
        :page-sizes="[5, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "../../untils/request";

export default {
  name: "orderManage",

  data() {
    return {
      drawerVisible: false,
      editDrawerVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      usingData: [], //订单内容显示
      search: "",
      ordersID: "", //存储已打开抽屉的订单ID
      type: "综合",
    };
  },
  created() {
    this.load();
  },
  methods: {
    typeChange() {
      if (this.type === "综合") {
        this.load();
      }
      if (this.type === "堂食") {
        this.eatInLoad();
      }
      if (this.type === "外卖") {
        this.takeOutLoad();
      }
    },
    format(row) {
      return row.type === 0 ? "堂食" : row.type === 1 ? "外卖" : "未填写";
    },
    find() {
      request
        .get("/orders/find", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            search: this.search,
          },
        })
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
    },
    update() {
      if (this.usingData.length === 0) {
        this.$message({
          type: "error",
          message: "订单不可为空,如需要请直接退单",
        });
        return;
      }
      request
        .post("/orders/update", {
          ordersContainer: this.usingData,
        })
        .then((res) => {
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "订单更新成功",
            });
            this.usingData = [];
            this.editDrawerVisible = false;
            this.load();
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        });
    },
    delete() {
      request
        .get("/orders/delete", {
          params: { ordersID: this.ordersID },
        })
        .then((res) => {
          if (res.code === 0) {
            this.$message({
              showClose: true,
              type: "success",
              message: "已删除",
            });
            this.load();
            this.editDrawerVisible = false;
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        });
    },
    openDrawer(row) {
      this.drawerVisible = true;
      this.ordersID = row.id.toString();
      request
        .get("/orders/viewContainerList", {
          params: { ordersID: this.ordersID },
        })
        .then((res) => {
          this.usingData = res.data;
        });
    },
    deleteConfirm() {
      this.$confirm("退单操作不可撤销, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delete();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    load() {
      request
        .get("/orders/view", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
    },
    eatInLoad() {
      request
        .get("/orders/viewEatIn", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
    },
    takeOutLoad() {
      request
        .get("/orders/viewTakeOut", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
    },
    handleClose() {
      this.$confirm("未保存数据将丢失, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.editDrawerVisible = false;
      });
    },
    handleEdit(row) {
      this.editDrawerVisible = true;
      this.ordersID = row.id.toString();
      request
        .get("/orders/viewContainerList", {
          params: { ordersID: this.ordersID },
        })
        .then((res) => {
          this.usingData = res.data;
        });
    },
    handleUsingDelete(row) {
      let index = this.usingData.indexOf(row);
      if (index > -1) this.usingData.splice(index, 1);
    },
    handleSizeChange(pageSize) {
      //改变当前每页的个数触发
      this.pageSize = pageSize;
      this.load();
    },
    handleCurrentChange(pageNum) {
      //改变当前页码触发
      this.currentPage = pageNum;
      this.load();
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-dialog {
  background: #fcf9f4;
}

/deep/.el-form-item {
  margin-bottom: 30px;
}
</style>
<style lang="less">
.el-message-box {
  background: #fcf9f4;
}
</style>
