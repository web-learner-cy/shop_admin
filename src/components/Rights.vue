<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/rights' }">权限管理理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" plain>添加角色</el-button>
    <!-- 表格列表 -->
      <el-table
      :data="rightList"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
          <span>{{scope.row.level=== "0"? '一级':scope.row.level === "1" ?'二级': '三级'}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  async created() {
    let res = await this.axios.get(`rights/list`)
    console.log(res)
    let { meta: { status }, data } = res
    if (status === 200) {
      this.rightList = data
    }
  }
}
</script>

<style>
</style>
