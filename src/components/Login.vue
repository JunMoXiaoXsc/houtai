
<template>
  <div class="hello">
    <!-- 用户登录卡片 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户登录</span>
      </div>
      <div>
        <!--用户登录表单 -->
        <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="demo-form">
          <el-form-item label="账号:" prop="username">
            <el-input style="width:300px" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input style="width:300px" v-model="form.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">登录</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template >
<script>
export default {
  name: "Login",
  data() {
    return {
      //登录的默认值
      form: { username: "xsc", password: "123", },
      //账号密码校验
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      },
    }
  },
  //页面加载事件
  mounted() {
  },
  methods: {
    //校验账号密码
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http.post("/toLogin", this.form).then((res) => {
            if (res.data.success) {
              console.log("🚀 登陆成功返回的数据", res.data.target)
              this.$message({
                message: '登陆成功!',
                type: 'success',
                duration: '1000'
              });
              let user = JSON.stringify(res.data.target);
              sessionStorage.setItem('user', user)
              this.$router.push("/Main")
            } else {
              this.$message({
                message: '登陆失败,账号或密码错误!',
                type: 'error',
                duration: '1000'
              });
            }
          })
        } else {
          this.$message({
            message: '请按要求输入账号或密码',
            type: 'error',
            duration: '1000'
          });
          return false;
        }
      });

    },
    //清空账号密码
    resetForm: function () {
      this.$refs['form'].resetFields();
    }
  },
};
</script>

<style scoped>
table {
  margin: auto;
  border-collapse: collapse;
}

table th,
td {
  padding: 5px;
  border: 1px solid #409EFF;
}

#login {
  border: 1px solid #409EFF;
  width: 400px;
  height: 400px;
  position: absolute;
  top: 25%;
  left: 35%;
}



/* 卡片样式 */
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
  position: absolute;
  top: 15%;
  left: 35%;
}
</style>
