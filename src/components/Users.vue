<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div class="Search">
      <el-input placeholder="请输入关键字" v-model.trim="query" class="input-with-select" @keyup.enter.native="search">
        <el-button slot="append" icon="el-icon-search" @click="search" ></el-button>
      </el-input>
      <el-button type="success" plain @click="dialogFormVisible = true">用户添加</el-button>
    </div>
    <!-- 表格渲染 -->
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        label="状态"
        width="180">
        <template slot-scope="scope">
        <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          <el-button size="small" plain type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[2, 4, 6, 8]"
      :total="total">
    </el-pagination>

    <!-- 弹出框 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" status-icon ref="userform">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancalSubmit">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // 查询字符串
      query: '',
      // 当前页的数据条数
      pageSize: 2,
      // 当前页页码
      currentPage: 1,
      // 数据总条数
      total: 0,
      // 用户数据
      userList: [],
      // 是否显示 对话框
      dialogFormVisible: false,
      // 添加用户的表单数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单数据的文本宽度
      formLabelWidth: '100px',
      // 表单校验
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取用户列表
    getUserList() {
      axios({
        method: 'get',
        url: 'http://localhost:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        // console.log(res.data)
        if (res.data.meta.status === 200) {
          this.userList = res.data.data.users
          this.total = res.data.data.total
        }
      })
    },
    // 处理页码改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserList()
    },
    // 处理pageSize改变
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getUserList()
    },
    // 处理关键字搜索
    search() {
      this.currentPage = 1
      this.getUserList()
    },
    // 删除单个用户功能
    del(id) {
      // console.log(id)
      axios({
        method: 'delete',
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res.data)
        if (res.data.meta.status === 200) {
          this.currentPage = 1
          this.getUserList()
        }
      })
    },
    // 取消提交
    cancalSubmit() {
      // 表单重置
      this.$refs['userform'].resetFields()
      // 关闭对话框
      this.dialogFormVisible = false
    },
    // 提交表单
    submitForm() {
      this.$refs['userform'].validate(valid => {
        if (valid) {
          // 验证成功 发送请求，添加数据
          axios({
            method: 'post',
            url: 'http://localhost:8888/api/private/v1/users',
            data: this.form,
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => {
            // console.log(res.data)
            if (res.data.meta.status === 201) {
              // 关闭对话框
              this.dialogFormVisible = false
              // 提示成功
              this.$message.success('添加成功')
              // 渲染第一页
              this.currentPage = 1
              this.getUserList()
              // 表单重置
              this.$refs['userform'].resetFields()
            }
          })
        } else {
          // 验证失败
          console.log('error submit!!')
        }
      })
    }
  },
  created() {
    this.getUserList()
  },
  watch: {
    query(res) {
      if (res.length === 0) {
        this.currentPage = 1
        this.getUserList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  height: 30px;
  line-height: 30px;
}
.Search {
  .el-input {
    width: 400px;
    margin-bottom: 10px;
  }
}
</style>
