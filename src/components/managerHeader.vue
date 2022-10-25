<!--suppress CssUnusedSymbol, JSUnusedGlobalSymbols -->
<template>
  <div
    style="
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #ccc;
      display: flex;
      background: #fdf6ec;
    "
  >
    <div
      style="
        width: 200px;
        padding-left: 50px;
        font-weight: bold;
        font-size: 18px;
        color: #c95f5f;
      "
    >
      xx餐厅系统
    </div>
    <div style="flex: 1"></div>
    <div
      style="
        width: 150px;
        font-weight: bold;
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <el-dropdown size="large">
        <span>
          {{ form.name }}
          <el-icon><ArrowDownBold /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="personDialogVisible = true"
              >个人信息
            </el-dropdown-item>
            <el-dropdown-item @click="$router.push('/login')" divided
              >退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dialog v-model="personDialogVisible" title="个人信息" width="30%">
        <el-form :model="form" label-width="80px">
          <el-form-item label="工号">
            <el-input v-model="form.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="form.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model.number="form.telephone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-tag type="warning" size="large">经理</el-tag>
            <div style="width: 20px"></div>
            <el-tag type="warning" size="large"
              >{{ sexTranslate(form.sex) }}
            </el-tag>
          </el-form-item>
        </el-form>
        <template #footer>
          <span>
            <el-button @click="passwordDialogVisible = true"
              >修改密码</el-button
            >
            <el-button
              type="primary"
              size="default"
              @click="save"
              color="#fab6b6"
              >保存</el-button
            >
          </span>
        </template>
      </el-dialog>

      <el-dialog v-model="passwordDialogVisible" title="修改密码" width="30%">
        <el-form
          ref="passwordForm"
          :model="passwordForm"
          label-width="80px"
          :rules="rules"
        >
          <el-form-item label="原密码" prop="originalPassword">
            <el-input
              v-model="passwordForm.originalPassword"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="再次输入" prop="newPasswords">
            <el-input
              v-model="passwordForm.newPasswords"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span>
            <el-button
              type="primary"
              size="default"
              color="#fab6b6"
              @click="updatePassword"
              >保存</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from "../../untils/request";

export default {
  name: "managerHeader",
  components: {},
  data() {
    let validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      personDialogVisible: false, //控制个人信息弹窗
      passwordDialogVisible: false, //控制修改密码弹窗
      form: {}, //用于获取user
      passwordForm: {}, //用于传输密码更新
      rules: {
        originalPassword: [
          {
            required: true,
            trigger: "blur",
            message: "请输入原密码",
          },
        ],
        newPassword: [
          {
            pattern:
              /^(?!\d+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)([^\u4e00-\u9fa5\s]){8,16}$/,
            required: true,
            message:
              "只能输入8-16位英文字母、数字或者符号（除空格），且字母、数字和标点符号至少包含两种",
            trigger: "blur",
          },
        ],
        newPasswords: [
          { validator: validatePassword, required: true, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    let str = sessionStorage.getItem("user");
    this.form = JSON.parse(str);
  },
  methods: {
    sexTranslate(sex) {
      if (sex === 0) return "男";
      if (sex === 1) return "女";
    },
    save() {
      request.post("/user/update", this.form).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "保存成功",
          });
          sessionStorage.removeItem("user");
          sessionStorage.setItem("user", JSON.stringify(res.data)); //缓存用户信息
          let str = sessionStorage.getItem("user");
          this.form = JSON.parse(str);
          this.personDialogVisible = false;
        } else {
          this.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    },
    updatePassword() {
      this.$refs["passwordForm"].validate((valid) => {
        if (valid) {
          this.passwordForm.userID = this.form.id;
          request
            .post("/user/updatePassword", this.passwordForm)
            .then((res) => {
              if (res.code === 0) {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
                sessionStorage.removeItem("user");
                sessionStorage.setItem("user", JSON.stringify(res.data)); //缓存用户信息
                let str = sessionStorage.getItem("user");
                this.form = JSON.parse(str);
                this.personDialogVisible = false;
                this.passwordDialogVisible = false;
              } else {
                this.$message({
                  type: "error",
                  message: res.msg,
                });
              }
            });
        }
      });
    },
  },
};
</script>

<style scoped>
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
