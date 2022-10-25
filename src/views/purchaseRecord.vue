<template>
  <!--    搜索头部区域-->
  <div style="padding: 10px; height: 50px; line-height: 50px; display: flex">
    <el-input
      v-model.trim="ingredientSearch"
      placeholder="请输入ID或食材名"
      style="width: 20%"
      clearable
    />
    <el-button
      type="primary"
      color="#fab6b6"
      style="margin-left: 10px"
      @click="findByIngredient"
      >按食材查询</el-button
    >
    <el-input
      v-model.trim="userSearch"
      placeholder="请输入ID或处理人姓名"
      style="padding-left: 20px; width: 20%"
      clearable
    />
    <el-button
      type="primary"
      color="#fab6b6"
      style="margin-left: 10px"
      @click="findByUser"
      >按处理人查询</el-button
    >
    <el-button
      type="primary"
      color="#fab6b6"
      style="margin-left: 10px"
      @click="unionFind"
      >联合查询</el-button
    >
  </div>
  <div style="padding: 10px">
    <el-table
      :data="tableData"
      border="border"
      :default-sort="{ prop: 'time', order: 'descending' }"
    >
      <el-table-column prop="ingredientID" label="食材ID" width="120px" />
      <el-table-column prop="ingredientName" label="食材名" />
      <el-table-column prop="amount" label="采购量（单位kg）" sortable />
      <el-table-column prop="price" label="采购总价" sortable />
      <el-table-column prop="userID" label="处理人ID" />
      <el-table-column prop="userName" label="处理人姓名" />
      <el-table-column prop="time" label="采购时间" sortable />
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
  name: "purchaseRecord",

  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      ingredientSearch: "",
      userSearch: "",
    };
  },
  created() {
    this.load();
  },
  methods: {
    unionFind() {
      request
        .get("/buy/unionFind", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            ingredientSearch: this.ingredientSearch,
            userSearch: this.userSearch,
          },
        })
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
    },
    findByIngredient() {
      request
        .get("/buy/findBuyByIngredient", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            search: this.ingredientSearch,
          },
        })
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
    },
    findByUser() {
      request
        .get("/buy/findBuyByUser", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            search: this.userSearch,
          },
        })
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
    },
    load() {
      request
        .get("/buy/viewBuy", {
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
</style>
