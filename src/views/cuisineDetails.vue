<template>
  <!--    搜索头部区域-->
  <div style="padding: 10px; height: 50px; line-height: 50px; display: flex">
    <el-input
      v-model.trim="search"
      placeholder="请输入ID或菜品名"
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
  </div>
  <div style="padding: 10px">
    <el-drawer
      v-model="drawerVisible"
      title="菜品配方"
      direction="rtl"
      size="35%"
    >
      <el-table :data="usingData">
        <el-table-column property="ingredientID" label="食材ID" width="150" />
        <el-table-column property="ingredientName" label="食材名" width="200" />
        <el-table-column property="dosage" label="用量(g)" />
      </el-table>
    </el-drawer>
    <el-table :data="tableData" border="border">
      <el-table-column prop="id" label="菜品ID" width="120px" />
      <el-table-column prop="name" label="菜品名" />
      <el-table-column prop="price" label="价格(元)" />
      <el-table-column label="操作" width="150px" align="center">
        <template #default="scope">
          <el-button size="mini" @click="openDrawer(scope.row)" color="#fab6b6"
            >配方查看</el-button
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
  name: "cuisineDetails",

  data() {
    return {
      drawerVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      usingData: [], //配方显示
      form: {}, //某行数据
      search: "",
      cuisineID: "",
    };
  },
  created() {
    this.load();
  },
  methods: {
    find() {
      request
        .get("/cuisine/find", {
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
    openDrawer(row) {
      this.drawerVisible = true;
      this.cuisineID = row.id.toString();
      request
        .get("/cuisine/viewUsingList", {
          params: { cuisineID: this.cuisineID },
        })
        .then((res) => {
          this.usingData = res.data;
        });
    },
    load() {
      request
        .get("/cuisine/view", {
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
/deep/ .el-input {
  width: 85%;
}

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
