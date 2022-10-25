<template>
  <!--    搜索头部区域-->
  <div style="padding: 10px; height: 50px; line-height: 50px">
    <el-row>
      <el-col :span="10">
        <div style="display: flex">
          <el-input
            v-model.trim="search"
            placeholder="请输入ID或菜品名"
            style="width: 45%"
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
      </el-col>
      <el-col :span="2"><div /></el-col>
      <el-col :span="12">
        <div style="display: flex">
          <el-input
            v-model.trim="form.customer"
            placeholder="请输入顾客名"
            style="width: 45%"
            clearable
          />
          <el-select
            v-model="form.type"
            placeholder="请选择订单类型"
            style="padding-left: 10px"
          >
            <el-option
              v-for="item in this.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button
            type="primary"
            color="#fab6b6"
            style="margin-left: 10px"
            @click="confirm"
            >下单</el-button
          >
          <el-button
            type="primary"
            color="#fab6b6"
            style="margin-left: 10px"
            @click="forceConfirm"
            >强制下单</el-button
          >
        </div>
      </el-col>
    </el-row>
  </div>
  <div style="padding: 10px">
    <el-row>
      <el-col :span="10">
        <el-table
          :data="tableData"
          height="530"
          :default-sort="{ prop: 'id', order: 'ascending' }"
        >
          <el-table-column prop="id" label="菜品ID" width="120px" sortable />
          <el-table-column prop="name" label="菜品名" />
          <el-table-column prop="price" label="价格" />
          <el-table-column label="操作" width="200px" align="center">
            <template #default="scope">
              <el-button size="mini" @click="handleAdd(scope.row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 10px 0">
          <el-pagination
            v-model:currentPage="currentPage"
            :page-sizes="[5, 10]"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="2"><div /></el-col>
      <el-col :span="12">
        <el-table
          :data="usingData"
          height="530"
          :default-sort="{ prop: 'id', order: 'ascending' }"
        >
          <el-table-column
            prop="cuisineID"
            label="菜品ID"
            width="120px"
            sortable
          />
          <el-table-column prop="name" label="菜品名" />
          <el-table-column prop="price" label="价格" />
          <el-table-column label="份数" width="200px" align="center">
            <template #default="scope">
              <el-input-number v-model="scope.row.amount" :step="1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px" align="center">
            <template #default="scope">
              <el-button size="mini" @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import request from "../../untils/request";

export default {
  name: "orderMeal",
  data() {
    return {
      form: {},
      tableData: [],
      usingData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      search: "",
      options: [
        { value: 0, label: "堂食" },
        { value: 1, label: "外卖" },
      ],
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
    forceConfirm() {
      this.$confirm("强制下单将忽略并不执行对于储量的影响,是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      })
        .then(() => {
          this.forceSave();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消保存",
          });
        });
    },
    confirm() {
      this.$confirm("请再次确定订单内容，该操作不可撤销", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.save();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消保存",
          });
        });
    },
    save() {
      let str = sessionStorage.getItem("user");
      this.form.userID = JSON.parse(str).id;
      this.form.forcing = 0;
      if (this.usingData.length === 0) {
        this.$message({
          type: "error",
          message: "订单不可为空",
        });
        return;
      }
      request
        .post("/orders/save", {
          orders: this.form,
          ordersContainer: this.usingData,
        })
        .then((res) => {
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "订单新增成功",
            });
            this.usingData = [];
            this.load();
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        });
    },
    forceSave() {
      let str = sessionStorage.getItem("user");
      this.form.userID = JSON.parse(str).id;
      this.form.forcing = 1;
      if (this.usingData.length === 0) {
        this.$message({
          type: "error",
          message: "订单不可为空",
        });
        return;
      }
      request
        .post("/orders/save", {
          orders: this.form,
          ordersContainer: this.usingData,
        })
        .then((res) => {
          if (res.code === 0) {
            this.$message({
              type: "warning",
              message: "订单已被强制下达",
            });
            this.usingData = [];
            this.load();
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
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
    handleAdd(row) {
      //删除左侧
      let index = this.tableData.indexOf(row);
      if (index > -1) this.tableData.splice(index, 1);
      //添加amount属性
      row.amount = 1; //初始化为1份
      //id属性转移到cuisineID属性
      row.cuisineID = row.id;
      delete row.id;
      this.usingData.push(row);
    },
    //Delete执行后原tableData会有冗余属性cuisineID,amount(delete太慢了尽量不用)
    handleDelete(row) {
      let index = this.usingData.indexOf(row);
      if (index > -1) this.usingData.splice(index, 1);
      //id属性处理
      row.id = row.cuisineID;
      this.tableData.push(row);
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
