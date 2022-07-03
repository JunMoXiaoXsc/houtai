<template>
  <div>
    <el-container style="height: 730px; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246);margin-top:65px">
        <el-menu :default-openeds="defaultopeneds" router>
          <el-submenu v-for="oneMenu in menuData" :key="oneMenu.id" :index="oneMenu.id + ''">
            <template slot="title"><i class="el-icon-message"></i>{{ oneMenu.name }}</template>
            <el-menu-item v-for="twoMenu in oneMenu.children" :key="twoMenu.id" :index="twoMenu.path">{{ twoMenu.name }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 12px; background-color:#B3C0D1;float: left;">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <a href="#" @click="toLogout()"> 退出登录</a>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ currUser.username }}</span>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      //动态菜单的数据
      menuData: [],
      //默认展开的菜单
      defaultopeneds: [],
      //当前登录的用户的默认值
      currUser: { id: '1', username: 'morenzhi' }
    }
  },
  methods: {
    //退出登录
    toLogout: function () {
      this.$http.post('/logout').then((res) => {
        window.location.href = "/"
      });
    },
    //点菜单跳转
    selectMenu: function (index, indexPath) {
      console.info("index", index);
      console.info("indexPath", indexPath);
      this.$router.push(index);
    }
  },
  //页面加载事件
  mounted() {
    //查询用户能操作的菜单
    this.$http.post("/user/listMyMenus").then(res => {
      console.info("动态菜单:", res.data)
      this.menuData = res.data;
      //获取第一项菜单的数据的id放到defaultopenends中
      for (var index in this.menuData) {
        this.defaultopeneds.push(this.menuData[index].id + "");
      }
    })
    this.currUser = JSON.parse(sessionStorage.getItem("user"));
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
