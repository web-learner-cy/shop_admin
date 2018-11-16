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
      <el-button type="success" plain @click="addDialogVisible = true">用户添加</el-button>
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
            inactive-color="#ff4949"
            @change="changeState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          <el-button size="small" plain type="success" icon="el-icon-check" @click="showAssignDialog(scope.row)">分配角色</el-button>
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
    <el-dialog title="添加用户" :visible.sync="addDialogVisible">
      <el-form :model="addFrom" :rules="rules" status-icon ref="addform">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addFrom.username" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addFrom.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addFrom.email" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addFrom.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancalAddUser">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 弹出框 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible">
      <el-form :model="editForm" :rules="rules" status-icon ref="editform">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
         <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancaleditUser">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 弹出框 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="assignDialogVisible">
      <el-form :model="assignForm" :rules="rules" status-icon ref="assignForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
         <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表" :label-width="formLabelWidth" prop="rid">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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
      addDialogVisible: false,
      // 添加用户的表单数据
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单数据的文本宽度
      formLabelWidth: '100px',
      // 控制编辑用户对话框显示
      editDialogVisible: false,
      editForm: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        mobile: [
          { Pattern: /1\d{10}/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        rid: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      // 控制分配对话框显示
      assignDialogVisible: false,
      assignForm: {
        id: '',
        username: '',
        rid: ''
      },
      // 下拉框数据
      roleList: []
    }
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      let res = await this.axios.get('roles')
      // console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.roleList = data
      }
    },
    // 获取用户列表
    async getUserList() {
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { users, total } } = res
      if (status === 200) {
        this.userList = users
        this.total = total
      }
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
    async del(id) {
      try {
        await this.$confirm('你确定要删除吗', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })

        let res = await this.axios({
          method: 'delete',
          url: `users/${id}`
        })

        let { meta: { status } } = res
        if (status === 200) {
          this.currentPage = 1
          this.getUserList()
        }
      } catch (err) {
        this.$message('你取消了删除操作')
      }
    },
    // 修改状态
    async changeState({ id, mg_state: mgState }) {
      let res = await this.axios({
        method: 'put',
        url: `users/${id}/state/${mgState}`
      })
      console.log(res)
      let { meta: { status } } = res
      if (status === 200) {
        this.$message.success('修改成功')
      }
    },
    // 取消提交
    cancalAddUser() {
      // 表单重置
      this.$refs['addform'].resetFields()
      // 关闭对话框
      this.addDialogVisible = false
    },
    // 提交表单
    addUser() {
      this.$refs['addform'].validate(async valid => {
        if (!valid) return false
        // 验证成功 发送请求，添加数据
        let res = await this.axios({
          method: 'post',
          url: 'users',
          data: this.addFrom
        })
        let { meta: { status } } = res
        if (status === 201) {
          // 关闭对话框
          this.addDialogVisible = false
          // 提示成功
          this.$message.success('添加成功')
          // 渲染第一页
          this.currentPage = 1
          this.getUserList()
          // 表单重置
          this.$refs['addform'].resetFields()
        }
      })
    },
    // 显示编辑用户对话框
    showEditDialog(user) {
      // 显示对话框
      this.editDialogVisible = true

      // 数据回填
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
    },
    // 取消提交编辑后的数据
    cancaleditUser() {
      // 表单重置
      this.$refs['editform'].resetFields()
      // 关闭对话框
      this.editDialogVisible = false
    },
    // 提交编辑用户信息
    editUser() {
      this.$refs.editform.validate(async vaild => {
        if (!vaild) return
        // 校验成功
        let res = await this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        })
        // console.log(res)
        if (res.meta.status === 200) {
          this.$refs.editform.resetFields()
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('编辑用户成功')
        }
      })
    },
    // 分配角色
    async showAssignDialog({ id, username }) {
      this.assignDialogVisible = true
      this.getRoleList()

      this.assignForm.username = username
      this.assignForm.id = id

      // 发送请求获取rid
      let res = await this.axios.get(`users/${id}`)
      let { meta: { status }, data: { rid } } = res
      if (status === 200) {
        this.assignForm.rid = rid === -1 ? '' : rid
      }
    },
    assignRole() {
      this.$refs.assignForm.validate(async vaild => {
        if (!vaild) return
        // 校验成功
        let res = await this.axios.put(
          `users/${this.assignForm.id}/role`,
          this.assignForm
        )
        if (res.meta.status === 200) {
          this.$refs.assignForm.resetFields()
          this.assignDialogVisible = false
          this.getUserList()
          this.$message.success('分配角色成功')
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
.Search {
  .el-input {
    width: 400px;
    margin-bottom: 10px;
  }
}
</style>
