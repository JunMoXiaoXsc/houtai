<template>
  <div id="app">
    <!-- 订单详情列表 -->
    <el-card class="box-card" id="TanChuCeng" v-if="seen">
      <el-table :data="orderInfo" border style="width: 100%;" height="330">
        <el-table-column prop="pid" label="商品编号">
        </el-table-column>
        <el-table-column prop="product.pname" label="商品名称">
        </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img :src="Image(scope.row.product.imgPath)" class="image">
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格">
        </el-table-column>
        <el-table-column prop="count" label="购买数量">
        </el-table-column>
      </el-table>
      <div>
        <el-button @click="trueSend()" type="primary">确认发货</el-button>
        <el-button @click="rowInfo('', false)">关闭</el-button>
      </div>
    </el-card>
    <!-- 数据表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="oid" label="订单编号">
      </el-table-column>
      <el-table-column prop="fuser.username" label="下单人姓名">
      </el-table-column>
      <el-table-column prop="createDate" label="下单时间">
      </el-table-column>
      <el-table-column prop="cprice" label="总价钱">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.ostate == 1" style="color:red">
            待发货
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="rowInfo(scope.row, true)" type="text" size="small">发货</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: "Orders",
  data() {
    return {
      seen: false,
      tableData: [],
      //显示商品详情
      //订单详情数据
      orderInfo: [],
    }
  },
  methods: {
    //封装页面加载事件  表格数据
    loadData: function () {
      this.$http.post('/order/listOrders').then((res) => {
        console.info("表格数据", res)
        this.tableData = res.data
      })
    },
    //商品图片
    Image: function (imgpath) {
      return this.$imgServer + imgpath;
    },
    //订单详情页面
    rowInfo(row, flag) {
      console.log(row);
      if (flag) {
        this.orderInfo = row.orderList
        this.seen = true
      } else {
        this.seen = false
      }
    },
    //发货
    trueSend() {
      let sendStr = ''
      this.orderInfo.forEach((res) => {
        sendStr += res.pid + ',' + res.count + "," + res.oid
        sendStr += "/"
      })
      console.log("🚀发货的信息", sendStr)
      this.$http.post("order/send", { str: sendStr }).then((res) => {
        console.log("🚀发货返回的信息", res)
        if (res.data.success) {
          this.seen = false
          this.loadData()
        } else {
          this.$message({
            type: "error",
            message: res.data.error
          })
        }

      });
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

/* 订单详情样式 */
#TanChuCeng {
  border: 1px solid darkgreen;
  width: 600px;
  height: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
  z-index: 1999;
  overflow: hidden;
}

/* 图片样式 */
.image {
  width: 100px;
  height: 50px;
  display: block;
}
</style>
