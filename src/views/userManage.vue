<template>
  <!--    搜索头部区域-->
  <div style="padding: 10px; height: 50px; line-height: 50px; display: flex">
    <el-input
      v-model.trim="search"
      placeholder="请输入ID或员工姓名"
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
        >新增员工</el-button
      >
    </div>
    <el-dialog v-model="addDialogVisible" title="新增员工" width="30%">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="员工名">
          <el-input v-model.trim="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="预设密码">
          <el-input v-model.trim="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model.number.trim="addForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="薪水">
          <el-input
            v-model.trim="addForm.salary"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-radio-group v-model="addForm.job">
            <el-radio :label="0">职工</el-radio>
            <el-radio :label="1">经理</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" color="#fab6b6" @click="save"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
  <div style="padding: 10px">
    <el-dialog v-model="dialogVisible" title="员工信息" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="员工ID">
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="员工名">
          <el-input v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model.number.trim="form.telephone"></el-input>
        </el-form-item>
        <el-form-item label="薪水">
          <el-input
            v-model.trim="form.salary"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          ></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-radio-group v-model="form.job">
            <el-radio :label="0">职工</el-radio>
            <el-radio :label="1">经理</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button type="primary" color="#fab6b6" @click="editConfirm"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
    <el-table :data="tableData" border="border">
      <el-table-column prop="id" label="用户ID" width="120px" />
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="sex" label="性别" :formatter="formatSex" />
      <el-table-column prop="telephone" label="电话" />
      <el-table-column prop="salary" label="薪水" />
      <el-table-column prop="job" label="职位" :formatter="formatJob" />
      <el-table-column label="操作" width="200px" align="center">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            @click="deleteConfirm(scope.row)"
            color="#fab6b6"
            >注销</el-button
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
  name: "userManage",

  data() {
    return {
      dialogVisible: false,
      addDialogVisible: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      form: {}, //某行数据
      addForm: {}, //新增员工
      search: "",
    };
  },
  created() {
    this.load();
  },
  methods: {
    find() {
      request
        .get("/user/find", {
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
    formatSex(row) {
      return row.sex === 0 ? "男" : row.sex === 1 ? "女" : "未填写";
    },
    formatJob(row) {
      return row.job === 0 ? "职工" : row.job === 1 ? "经理" : "未填写";
    },
    editConfirm() {
      this.$confirm("若职位被修改,该员工权限可能会被改变, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
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
    deleteConfirm(row) {
      this.$confirm("员工注销不可撤销, 是否继续?", "提示", {
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
            message: "已取消注销",
          });
        });
    },
    save() {
      request.post("/user/register", this.addForm).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "新增成功,请及时将账号密码告知员工",
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
      request.post("/user/update", this.form).then((res) => {
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
    load() {
      request
        .get("/user/view", {
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
    delete(row) {
      this.form = JSON.parse(JSON.stringify(row));
      request.post("/user/delete", this.form).then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.$message({
            showClose: true,
            type: "warning",
            message: "已注销，请及时告知相关用户",
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
