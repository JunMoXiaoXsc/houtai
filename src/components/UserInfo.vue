<template>
  <div id="app">
    <div v-if="seen" id="ZheZhaoCeng"></div>
    <!-- 新增或修改弹出框 -->
    <el-card class="box-card" v-if="seen" id="TanChuCeng">
      <div slot="header" class="clearfix">
        <div style="text-align: center; color: cadetblue;font-size:20px">{{ title }}</div>
      </div>
      <div>
        <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="demo-form">
          <el-form-item label="账号:" prop="username">
            <el-input style="width:300px" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="职位:">
            <template>
              <el-checkbox-group v-model="checkList">
                <el-checkbox v-for="item in this.roleList" :key="item.rid" :label="item.rid">
                  {{ item.rname }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="saveOrUpdate()">保存</el-button>
            <el-button @click="resetForm()">重置</el-button>
            <el-button @click="closeWin()">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 标头 -->
    <div>
      <span style="float: left;">
        <el-button style=" width:100px" type="primary" @click="showEditWin()">新增</el-button>
      </span>
      <span style="float:left;">
        <el-input placeholder="请输入内容" v-model="keyword" class="input-with-select" clearable>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </span>
      <span style="float: right;">
        <el-button style=" width:100px" type="danger" @click="toLogout()">退出登录</el-button>
      </span>
    </div>
    <!-- 数据表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="编号">
      </el-table-column>
      <el-table-column prop="username" label="账号">
      </el-table-column>
      <el-table-column label="职位">
        <span slot-scope="scope">
          <span v-for="item in scope.row.role">
            <el-tag>{{ item.rname }}</el-tag>
          </span>
        </span>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="showEditWin(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="del(scope.row.id)" type="text" size="small" style="color: red;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[3, 5, 10, 15]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: "UserInfo",
  data() {
    return {
      seen: false,
      title: '',
      tableData: [],
      form: {},
      //总条数
      total: 0,
      //默认每页显示的条数
      pageSize: 3,
      //当前页
      currentPage: 1,
      //搜索关键字
      keyword: '',
      //职位数据
      role: [],
      //选中的职位
      checkList: [],
      //role数据
      roleList: [],
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个职位', trigger: 'change' }
        ],
      },
    }
  },

  methods: {
    //封装页面加载事件  表格数据
    loadData: function () {
      this.$http.post('/user/listPage', { keyword: this.keyword, currentPage: this.currentPage, pageSize: this.pageSize }).then((res) => {
        console.log("🚀 ~ file: UserInfo.vue ~ line 108 ~ User ~ 表格数据", res.data)
        this.tableData = res.data.data
        this.total = parseInt(res.data.total)
      })
    },
    listRole: function () {
      this.$http.post("role/listData").then(res => {
        console.log("🚀 ~ file: UserInfo.vue ~ line 121 ~Role res", res.data)
        this.roleList = res.data
      });
    }
    ,
    //显示新增或修改页面
    showEditWin: function (row) {
      console.log("🚀 ~ file: UserInfo.vue ~ line 117 ~ Row", row)
      if (row) {
        this.title = '编辑页面'
        console.log("🚀 ~ file: UserInfo.vue ~ line 129 ~ row.role", row.role)
        for (let i = 0; i < row.role.length; i++) {
          this.checkList.push(row.role[i].rid)
        }
        console.log("🚀 ~ file: UserInfo.vue ~ line 129 ~ checkList", this.checkList)
        //js 思路1：对象复制的语法  问题:双向绑定 修开页面内容变化 没点保存时列表数据也跟着变化
        this.form = Object.assign({}, row);
        //思路2:把row对象先转成json字符串，再从json字符串转回js对象
        // this.form=JSON.parse(JSON.stringify(row));
      } else {
        this.title = '新增页面'
        this.form = {}
        this.checkList = []
      }
      this.seen = true;
    },
    //关闭弹出层
    closeWin: function () {
      this.seen = false;
      this.checkList = []
    },
    //保存或者更新用户信息
    saveOrUpdate: function () {
      console.log("🚀npm ~ file: UserInfo.vue ~ line 147 ~ checkList", this.checkList)
      let result = ''
      for (let i = 0; i < this.checkList.length; i++) {
        result += this.checkList[i]
        result += ','
      }
      this.form.checkList = result
      console.log("🚀 1111", this.form)
      //把from里的role设置为undefined  不然会报400错误 数据格式不对
      // this.form.role = undefined
      this.$refs['form'].validate((valid) => {
        if (valid) {
          //往后台发送ajax请求 保存用户数据
          this.$http.post("/user/saveOrUpdate", this.form).then((res) => {
            console.info("接收到后台传递过来的数据", res.data);
            //如果保存成功
            if (res.data.success) {
              this.closeWin();
              //刷新数据
              this.loadData(1);
              this.checkList = []
            } else {
              alert(res.data.error)
            }
          });
        }
      });
    },
    del: function (id) {
      //往后台发送ajax请求 删除用户数据
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/user/delete', { id: id }).then((res) => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.closeWin();
            //刷新数据
            this.loadData(1);
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //退出
    toLogout: function () {
      this.$http.post('/logout').then((res) => {
        window.location.href = "/"
      });
    },
    //重置表单
    resetForm: function () {
      this.$refs['form'].resetFields();
    },
    //每页的条数改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.currentPage = 1
      this.loadData()
    },
    //当前页改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.loadData(val)
    },
    //搜索按钮
    search() {
      console.log('搜索的内容', this.keyword)
      this.loadData()
    }
  },
  //页面加载事件
  mounted() {
    this.loadData()
    this.listRole()
  },
};
</script>

<style  scoped>
#ZheZhaoCeng {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0%;
  left: 0%;
  background: black;
  z-index: 800;
  opacity: 0.4;
  border: 0px solid red;
}

#TanChuCeng {
  border: 1px solid darkgreen;
  width: 500px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
  z-index: 1999;
  overflow: hidden;
}

table {
  margin: auto;
  border-collapse: collapse;
}

table th,
td {
  padding: 5px;
  border: 1px solid #409EFF;
}

/* 卡片样式 */
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
  height: 100%;
}
</style>
