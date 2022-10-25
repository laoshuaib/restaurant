<template>
  <el-page-header content="新增菜品" @back="goBackConfirm" />
  <!--    搜索头部区域-->
  <div style="padding: 10px; height: 50px; line-height: 50px; margin-top: 20px">
    <el-row>
      <el-col :span="10">
        <div style="display: flex">
          <el-input
            v-model.trim="search"
            placeholder="请输入ID或食材名"
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
      <el-col :span="10">
        <div style="display: flex">
          <el-input
            v-model.trim="form.name"
            placeholder="请输入菜品名"
            style="width: 45%"
            clearable
          />
          <el-input
            v-model.trim="form.price"
            placeholder="请输入菜品价格"
            style="width: 45%; padding-left: 10px"
            clearable
          />
          <el-button
            type="primary"
            color="#fab6b6"
            style="margin-left: 10px"
            @click="confirm"
            >保存</el-button
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
          <el-table-column prop="id" label="食材ID" width="120px" sortable />
          <el-table-column prop="name" label="食材名" />
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
            prop="ingredientID"
            label="食材ID"
            width="120px"
            sortable
          />
          <el-table-column prop="name" label="食材名" />
          <el-table-column label="用量(g)" width="200px" align="center">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.dosage"
                :precision="1"
                :step="0.1"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px" align="center">
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
  name: "addCuisine",
  data() {
    return {
      form: {},
      tableData: [],
      usingData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      search: "",
    };
  },
  created() {
    this.load();
  },
  methods: {
    goBack() {
      this.$router.push("/manager/cuisineManage");
    },
    find() {
      request
        .get("/ingredient/find", {
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
    goBackConfirm() {
      this.$confirm("未保存数据将丢失", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.goBack();
      });
    },
    confirm() {
      this.$confirm("请确定菜品名字, 确定后不建议修改", "提示", {
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
      if (this.usingData.length === 0) {
        this.$message({
          type: "error",
          message: "菜品配方不可为空",
        });
        return;
      }
      request
        .post("/cuisine/save", {
          cuisine: this.form,
          cuisineUsing: this.usingData,
        })
        .then((res) => {
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "菜品新增成功",
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
        .get("/ingredient/view", {
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
      //添加dosage属性
      row.dosage = 100; //初始化为100g
      //id属性转移到ingredientID属性
      row.ingredientID = row.id;
      delete row.id;
      this.usingData.push(row);
    },
    //Delete执行后原tableData会有冗余属性ingredientID,dosage(delete太慢了尽量不用)
    handleDelete(row) {
      let index = this.usingData.indexOf(row);
      if (index > -1) this.usingData.splice(index, 1);
      //id属性处理
      row.id = row.ingredientID;
      this.tableData.push(row);
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
