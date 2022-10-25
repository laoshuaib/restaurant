<template>
  <!--    搜索头部区域-->
  <div style="padding: 10px; height: 50px; line-height: 50px; display: flex">
    <el-input
      v-model.trim="search"
      placeholder="请输入ID或食材名"
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
    <el-input
      v-model.trim="reservesSearch"
      placeholder="请输入储量"
      style="padding-left: 20px; width: 25%"
      clearable
    >
      <template #prepend>储量低于</template>
    </el-input>
    <el-button
      type="primary"
      color="#fab6b6"
      style="margin-left: 10px"
      @click="findByReserves"
      >低储量查询</el-button
    >
    <div style="flex: 1"></div>
    <div
      style="
        width: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <el-button
        type="primary"
        color="#fab6b6"
        style="margin-left: 15px"
        @click="addDialogVisible = true"
        >新增食材</el-button
      >
    </div>
    <el-dialog v-model="addDialogVisible" title="新增食材" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="食材名">
          <el-input v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item label="储量(kg)">
          <el-input
            v-model.trim="form.reserves"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" color="#fab6b6" @click="addConfirm"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
  <div style="padding: 10px">
    <el-dialog v-model="dialogVisible" title="食材信息" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="食材ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="食材名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="储量(kg)">
          <el-input
            v-model="form.reserves"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" color="#fab6b6" @click="confirm"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="buyDialogVisible" title="采购" width="30%">
      <el-form :model="buyForm" label-width="100px">
        <el-form-item label="食材ID">
          <el-input v-model="buyForm.ingredientID" disabled></el-input>
        </el-form-item>
        <el-form-item label="食材名">
          <el-input v-model="buyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="采购量(kg)">
          <el-input
            v-model="buyForm.amount"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item label="采购总价">
          <el-input
            v-model="buyForm.price"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" color="#fab6b6" @click="buyConfirm"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-table :data="tableData" border="border">
      <el-table-column prop="id" label="食材ID" width="120px" />
      <el-table-column prop="name" label="食材名" />
      <el-table-column prop="reserves" label="储量（单位kg）" sortable />
      <el-table-column label="操作" width="200px" align="center">
        <template #default="scope">
          <el-button size="mini" @click="handleBuy(scope.row)">采购</el-button>
          <el-button size="mini" @click="handleEdit(scope.row)" color="#fab6b6"
            >编辑</el-button
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
  name: "ingredientManage",

  data() {
    return {
      dialogVisible: false,
      addDialogVisible: false,
      buyDialogVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      form: {}, //某行数据
      buyForm: {}, //采购数据
      feeForm: {}, //费用数据
      search: "",
      reservesSearch: "",
    };
  },
  created() {
    this.load();
  },
  methods: {
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
    findByReserves() {
      request
        .get("/ingredient/findByReserves", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            reservesSearch: this.reservesSearch,
          },
        })
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
    },
    confirm() {
      this.$confirm(
        "若食材名被修改,相关配方等内容可能发生变动, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.update();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    },
    addConfirm() {
      this.$confirm("食材一旦新增无法删除, 是否继续?", "提示", {
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
            message: "已取消新增",
          });
        });
    },
    buyConfirm() {
      this.$confirm("采购记录一旦产生无法删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.saveBuy();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消采购",
          });
        });
    },
    save() {
      request.post("/ingredient/save", this.form).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "新增成功",
          });
          this.addDialogVisible = false;
          this.load();
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    update() {
      request.post("/ingredient/update", this.form).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "更新成功",
          });
          this.dialogVisible = false;
          this.load();
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    saveBuy() {
      request.post("/ingredient/saveBuy", this.buyForm).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "采购成功",
          });
          this.buyDialogVisible = false;
          this.load();
          //产生费用
          this.saveFee();
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    saveFee() {
      this.feeForm.price = this.buyForm.price;
      request.post("/fee/save", this.feeForm).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "相关费用已自动登记",
          });
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
    handleBuy(row) {
      let str = sessionStorage.getItem("user");
      //清空采购表单
      this.buyForm.amount = "";
      this.buyForm.price = "";
      //采购表单默认数据
      this.buyForm.userID = JSON.parse(str).id;
      this.buyForm.ingredientID = JSON.parse(JSON.stringify(row)).id;
      this.buyForm.name = JSON.parse(JSON.stringify(row)).name;
      //费用表单默认数据(不对用户展示)
      this.feeForm.type = "采购";
      this.feeForm.userID = JSON.parse(str).id;
      this.feeForm.note = "采购" + JSON.parse(JSON.stringify(row)).name;
      //弹框控制
      this.buyDialogVisible = true;
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
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
