<template>
  <!--    搜索头部区域-->
  <div style="padding: 10px; height: 50px; line-height: 50px; display: flex">
    <el-input
      v-model.trim="feeSearch"
      placeholder="请输入ID或费用类型"
      style="width: 20%"
      clearable
    />
    <el-button
      type="primary"
      color="#fab6b6"
      style="margin-left: 10px"
      @click="findByFee"
      >按费用查询</el-button
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
    <div style="flex: 1"></div>
    <div
      style="
        width: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <el-dropdown>
        <el-button type="primary" color="#fab6b6" style="margin-left: 15px">
          费用登记<el-icon><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="addDialogVisible = true"
              >单次登记</el-dropdown-item
            >
            <el-dropdown-item @click="batchConfirm">批量登记</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog v-model="addDialogVisible" title="费用登记" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="费用类型">
          <el-input v-model.trim="form.type"></el-input>
        </el-form-item>
        <el-form-item label="总价">
          <el-input
            v-model.trim="form.price"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item label="注释">
          <el-input v-model="form.note" :rows="2" type="textarea" />
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
    <el-dialog v-model="uploadDialogVisible" title="费用登记" width="30%">
      <el-upload
        action="http://localhost:9090/fee/excelUpload"
        accept=".xls,.xlsx"
        :on-success="handleSuccess"
        :on-error="handleError"
        :data="extraData"
      >
        <el-button>选择EXCEL进行上传</el-button>
      </el-upload>
    </el-dialog>
  </div>
  <div style="padding: 10px">
    <el-table
      :data="tableData"
      border="border"
      :default-sort="{ prop: 'time', order: 'descending' }"
    >
      <el-table-column prop="id" label="费用ID" width="120px" />
      <el-table-column prop="type" label="费用类型" />
      <el-table-column prop="price" label="费用总价" sortable />
      <el-table-column prop="userID" label="处理人ID" />
      <el-table-column prop="userName" label="处理人姓名" />
      <el-table-column prop="time" label="产生时间" sortable />
      <el-table-column prop="note" label="注释" />
      <el-table-column label="操作" width="100px" align="center">
        <template #default="scope">
          <el-button size="mini" @click="deleteConfirm(scope.row)"
            >删除</el-button
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
  name: "feeRecord",

  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      form: {}, //用于新增费用
      addDialogVisible: false,
      uploadDialogVisible: false,
      feeSearch: "",
      userSearch: "",
      extraData: {}, //用于上传附带参数
    };
  },
  created() {
    this.load();
  },
  methods: {
    deleteConfirm(row) {
      this.$confirm("费用删除不可撤销, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.delete(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    addConfirm() {
      this.$confirm("费用一旦产生无法修改, 是否继续?", "提示", {
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
    batchConfirm() {
      this.$confirm(
        "请对批量数据核查完毕再进行上传,非法数据可能导致错误， 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.uploadDialogVisible = true;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消新增",
          });
        });
    },
    delete(row) {
      this.form = JSON.parse(JSON.stringify(row));
      request.post("/fee/delete", this.form).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message({
            showClose: true,
            type: "success",
            message: "已删除",
          });
          this.load();
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    save() {
      //设置处理人ID
      let str = sessionStorage.getItem("user");
      this.form.userID = JSON.parse(str).id;
      request.post("/fee/save", this.form).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "新增成功",
          });
          this.addDialogVisible = false;
          this.form = {}; //置空
          this.load();
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    unionFind() {
      request
        .get("/fee/unionFind", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            feeSearch: this.feeSearch,
            userSearch: this.userSearch,
          },
        })
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
    },
    findByFee() {
      request
        .get("/fee/findByFee", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            search: this.feeSearch,
          },
        })
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
    },
    findByUser() {
      request
        .get("/fee/findByUser", {
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
        .get("/fee/view", {
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
        });
      //设置处理人ID
      let str = sessionStorage.getItem("user");
      this.extraData.userID = JSON.parse(str).id.toString();
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
    handleSuccess(res) {
      if (res.code === 0) {
        this.$message({
          type: "success",
          message: "上传成功",
        });
        this.load();
      } else {
        this.$message({
          type: "error",
          message: res.msg,
        });
      }
    },
    handleError() {
      this.$message({
        type: "error",
        message: "excel数据格式错误",
      });
      this.load();
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-input {
  width: 85%;
}

/deep/ .el-textarea {
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
