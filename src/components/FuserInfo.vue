<template>
  <div id="app">
    <!-- 标头 -->
    <div>
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
      <el-table-column prop="fuid" label="编号">
      </el-table-column>
      <el-table-column prop="username" label="账号">
      </el-table-column>
      <el-table-column label="用戶狀態">
        <template slot-scope="scope">
          <span v-if="scope.row.fustate == 1">
            <el-tag>已啓用</el-tag>
          </span>
          <span v-if="scope.row.fustate != 1">
            <el-tag type="danger">已禁用</el-tag>
          </span>
        </template>
      </el-table-column>
      <!-- 操作按钮 -->
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="updateState(scope.row.fuid, true)" v-if="scope.row.fustate == 0" type="text" size="small"
            style="color: yellowgreen;">啓用
          </el-button>
          <el-button @click="updateState(scope.row.fuid, false)" v-if="scope.row.fustate == 1" type="text" size="small"
            style="color: blueviolet;">禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
  name: "FuserInfo",
  data() {
    return {
      tableData: [],
      //总条数
      total: 0,
      //默认每页显示的条数
      pageSize: 3,
      //当前页
      currentPage: 1,
      //搜索关键字
      keyword: '',
    }
  },

  methods: {
    //封装页面加载事件  表格数据
    loadData: function () {
      this.$http.post('/fu/listAll', { keyword: this.keyword, currentPage: this.currentPage, pageSize: this.pageSize }).then((res) => {
        console.log("🚀 ~  表格数据", res.data)
        this.tableData = res.data.list
        this.total = parseInt(res.data.total)
      })
    },
    //修改用戶状态
    updateState: function (fuid, flag) {
      let fuState = 0
      if (flag) {
        fuState = 1
      }
      this.$http.post('/fu/updateState', { fuid: fuid, fuState: fuState }).then((res) => {
        console.log("🚀修改商品状态的返回值", res)
        if (res.data.success) {
          //刷新数据
          this.loadData();
        } else {
          this.$message({
            type: 'error',
            message: res.data.error
          });
        }
      })
    },
    //退出
    toLogout: function () {
      this.$http.post('/logout').then((res) => {
        window.location.href = "/"
      });
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
  },
};
</script>

<style  scoped>
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
