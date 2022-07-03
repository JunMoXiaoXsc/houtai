<template>
  <div>
    <div v-if="seen" id="ZheZhaoCeng"></div>
    <!-- 新增或修改弹出框 -->
    <el-card class="box-card" v-if="seen" id="TanChuCeng">
      <div slot="header" class="clearfix">
        <div style="text-align: center;color: cadetblue;font-size:20px">{{ title }}</div>
      </div>
      <div>
        <el-form :model="form" ref="form" label-width="80px" class="demo-form">
          <el-form-item label="商品名称:">
            <el-input style="width:300px" v-model="form.pname"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input style="width:300px" v-model="form.price"></el-input>
          </el-form-item>
          <el-form-item label="商品库存">
            <el-input style="width:300px" v-model="form.stock"></el-input>
          </el-form-item>
          <!-- 下拉框 -->
          <el-form-item label="商品类别">
            <el-select style="width:300px" v-model="form.tid" placeholder="请选择类别">
              <el-option v-for="item in ptype" :key="item.tid" :label="item.tname" :value="item.tid">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 图片上传 -->
          <el-form-item label="商品图片">
            <el-upload class="avatar-uploader" action="http://localhost:8080/pro/upload" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :with-credentials="true">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-input style="width:300px;display: none;" v-model="form.imgPath" :disabled="true"></el-input>
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
      <el-table-column prop="pid" label="商品编号" width="180">
      </el-table-column>
      <el-table-column prop="pname" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="imgPath" label="商品图片">
        <template slot-scope="scope">
          <img :src="imgSrc(scope.row)" style="width: 50px;height: 50px;" />
        </template>
      </el-table-column>
      <el-table-column prop="ptype.tname" label="商品类别">
      </el-table-column>
      <el-table-column prop="price" label="商品价格">
      </el-table-column>
      <el-table-column prop="stock" label="商品库存" width="180">
      </el-table-column>
      <el-table-column prop="state" label="商品状态" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.state == 1">
            <el-tag>已上架</el-tag>
          </span>
          <span v-if="scope.row.state != 1">
            <el-tag type="danger">未上架</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="updateState(scope.row.pid, true)" v-if="scope.row.state == 0" type="text" size="small"
            style="color: yellowgreen;">上架
          </el-button>
          <el-button @click="updateState(scope.row.pid, false)" v-if="scope.row.state == 1" type="text" size="small"
            style="color: blueviolet;">下架
          </el-button>
          <!-- 判断如果 已上架不可以修改 -->
          <span v-if="scope.row.state == 0">
            <el-button @click="showEditWin(scope.row)" type="text" size="small">编辑
            </el-button>
            <el-button @click="del(scope.row.pid)" type="text" size="small" style="color: red;">
              删除</el-button>
          </span>
          <!-- <span v-if="scope.row.state == 1">
            <el-button @click="showEditWin(scope.row)" disabled type="text" size="small" style="color: gray;">
              编辑
            </el-button>
            <el-button @click="del(scope.row.pid)" disabled type="text" size="small" style="color: gray;">
              删除
            </el-button>
          </span> -->
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
  name: 'Product',
  data() {
    return {
      seen: false,
      title: '',
      tableData: [],
      form: {
      },
      imageUrl: '',
      //总条数
      total: 0,
      //默认每页显示的条数
      pageSize: 5,
      //当前页
      currentPage: 1,
      //搜索关键字
      keyword: '',
      //类别数据
      ptype: [],
    }

  },
  methods: {
    imgSrc: function (row) {
      return this.$imgServer + row.imgPath
    },
    loadData: function (page) {
      if (page != null) {
        this.currentPage = page
      }
      this.$http.post('/pro/listData', { keyword: this.keyword, currentPage: this.currentPage, pageSize: this.pageSize }).then((res) => {
        console.info("表格数据", res)
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    //封装下拉框数据
    loadPtypeData: function () {
      this.$http.post('/pro/listPtype').then((res) => {
        console.info("下拉框数据", res)
        this.ptype = res.data
      })
    },
    //显示新增或修改页面
    showEditWin: function (row) {
      console.info('row', row)
      if (row) {
        this.title = '编辑页面'
        //js 思路1：对象复制的语法  问题:双向绑定 修开页面内容变化 没点保存时列表数据也跟着变化
        row.tid = row.ptype.tid
        this.form = Object.assign({}, row);
        this.imageUrl = this.$imgServer + row.imgPath
        //思路2:把row对象先转成json字符串，再从json字符串转回js对象
        // this.form=JSON.parse(JSON.stringify(row));
      } else {
        this.title = '新增页面'
        this.form = {}
      }
      this.seen = true;
    },
    //关闭弹出层
    closeWin: function () {
      this.seen = false;
    },
    //保存或者更新用户信息
    saveOrUpdate: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.info("form", this.form)
          //往后台发送ajax请求 保存用户数据
          this.$http.post("/pro/saveOrUpdate", this.form).then((res) => {
            //如果保存成功
            if (res) {
              this.closeWin();
              //刷新数据
              this.loadData(1);
            } else {
              alert('操作失败')
            }
          });
        }
      });
    },
    del: function (pid) {
      //往后台发送ajax请求 删除用户数据
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/pro/delete', { pid: pid }).then((res) => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.closeWin();
            //刷新数据
            this.loadData();
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
    //修改商品状态
    updateState: function (pid, flag) {
      let sid = 0
      if (flag) {
        sid = 1
      }
      this.$http.post('/pro/updateState', { pid: pid, sid: sid }).then((res) => {
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
    //重置表单
    resetForm: function () {
      this.$refs['form'].resetFields();
    },
    //每页的条数改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.loadData(1)
    },
    //当前页改变事件
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.loadData()
    },
    //搜索按钮
    search() {
      console.log('搜索的内容', this.keyword)
      this.loadData(1)
    },
    //上传成功
    handleAvatarSuccess(res, file) {
      console.log(res)
      this.imageUrl = this.$imgServer + res.target
      this.form.imgPath = res.target
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 40;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 40MB!');
      }
      return isJPG && isLt2M;
    }
  },
  mounted() {
    this.loadData()
    this.loadPtypeData()
  },
}
</script>

<style scoped>
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
  height: 650px;
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

/* 上传图片样式 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
