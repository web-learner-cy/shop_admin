<template>
  <el-container  class="home">
    <el-header>
      <div class="logo"></div>
      <div class="logout">
        欢迎光临
        <a href="javascript:;" @click="logout">退出</a>
      </div>
      <h3 class="title">电商后台管理系统</h3>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          router
          unique-opened
          :default-active="$route.path.slice(1).split('-')[0]"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu
            v-for="right in rightList"
            :key="right.id"
            :index="right.path" >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{right.authName}}</span>
            </template>
            <el-menu-item
              v-for="item in right.children"
              :key="item.id"
              :index="item.path">
              <i class="el-icon-menu"></i>
              <span>{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  methods: {
    async logout() {
      try {
        await this.$confirm('你确定要退出？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$message({
          type: 'success',
          message: '退出成功'
        })
        // 删除token 跳到登录页
        localStorage.removeItem('token')
        this.$router.push('/login')
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      }
    }
  },
  async created() {
    let res = await this.axios({
      method: 'get',
      url: 'http://localhost:8888/api/private/v1/menus'
    })
    // console.log(res)
    let { meta: { status }, data } = res
    if (status === 200) {
      this.rightList = data
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;

    .logo {
      width: 180px;
      height: 60px;
      float: left;
      background: url('../assets/images/logo.png') center center no-repeat;
      background-size: contain;
    }
    .logout {
      float: right;
      height: 60px;
      line-height: 60px;
      font-weight: 700;
      a {
        color: darkorange;
      }
    }
    .title {
      overflow: hidden;
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 28px;
      color: #fff;
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-menu {
      width: 100%;
    }
  }
  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
