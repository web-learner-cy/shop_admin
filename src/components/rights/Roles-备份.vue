<template>
  <div class="roles">
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/roles' }">权限管理理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" plain @click="addDialogVisible = true">添加角色</el-button>
    <!-- 表格列表 -->
    <el-table
      :data="roleList"
      style="width: 100%">
       <el-table-column type="expand">
         <template slot-scope="scope">
           <el-row v-if="scope.row.children.length === 0">没有更多权限</el-row>
           <el-row v-for="level1 in scope.row.children" :key="level1.id">
             <el-col :span="4">
               <el-tag closable @close="deleteRight(scope.row, level1.id)">{{level1.authName}}</el-tag>
             </el-col>
             <el-col :span="20">
               <el-row v-for="level2 in level1.children" :key="level2.id">
                  <el-col :span="4">
                    <el-tag closable @close="deleteRight(scope.row, level2.id)" type="success" class="level2">{{level2.authName}}</el-tag>
                  </el-col>
                  <el-col :span="20">
                    <el-tag closable @close="deleteRight(scope.row, level3.id)" class="level3" type="danger" v-for="level3 in level2.children" :key="level3.id">{{level3.authName}}</el-tag>
                  </el-col>
               </el-row>
             </el-col>
           </el-row>
         </template>
       </el-table-column>
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述">
      </el-table-column>
      <el-table-column
        label="操作">
         <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)"></el-button>
          <el-button size="small" plain type="success" icon="el-icon-check" @click="showAssignDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出框 分配权限 -->
    <el-dialog
    title="分配权限"
    width="40%"
    :visible.sync="assignDialogVisible">
      <el-tree
        ref="tree"
        :data="rightList"
        show-checkbox
        default-expand-all
        node-key="id"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 弹出框 添加角色 -->
    <el-dialog
      title="添加角色"
      width="40%"
      :visible.sync="addDialogVisible">
      <el-form :model="addForm" ref="addForm" status-icon :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 弹出框 编辑角色 -->
    <el-dialog
      title="编辑角色"
      width="40%"
      :visible.sync="editDialogVisible">
      <el-form :model="editForm" ref="editForm" status-icon :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      // 控制 分配权限 对话框显示
      assignDialogVisible: false,
      // 权限列表数据
      rightList: [],
      // 树状结构
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 角色id
      roleId: '',
      // 添加角色数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 控制添加对话框显示
      addDialogVisible: false,
      // 校验规则
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      // 控制 编辑角色 对话框显示
      editDialogVisible: false,
      // 编辑对话框表单数据
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      }
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
    // 删除角色的权限
    async deleteRight(role, rightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      let { meta: { status }, data } = res
      if (status === 200) {
        // 提示消息
        this.$message.success('删除成功')
        // 刷新数据
        role.children = data
      }
    },
    // 获取权限列表
    async getRightList() {
      let res = await this.axios.get('rights/tree')
      // console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.rightList = data
      }
    },
    // 显示分配权限对话框
    async showAssignDialog(role) {
      // 储存角色id，
      this.roleId = role.id
      // 显示对话框
      this.assignDialogVisible = true
      // 显示权限列表
      this.getRightList()
      // 数据回显 默认选中 三级权限的id
      // console.log(role)

      this.$nextTick(() => {
        let temp = []
        role.children.forEach(item => {
          item.children.forEach(item => {
            item.children.forEach(item => {
              temp.push(item.id)
            })
          })
        })
        // console.log(temp)
        this.$refs.tree.setCheckedKeys(temp)
      })
    },
    // 分派权限
    async assignRight() {
      // 获取选中的权限id
      // 全选状态
      let checkedId = this.$refs.tree.getCheckedKeys()
      // 半选中状态
      let halfCheckedId = this.$refs.tree.getHalfCheckedKeys()
      // console.log(checkedId, halfCheckedId)
      let id = [...checkedId, ...halfCheckedId]
      // 发送请求
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: id.join()
      })
      console.log(res)
      if (res.meta.status === 200) {
        // 关闭对话框
        this.assignDialogVisible = false
        // 重新渲染
        this.getRoleList()
        // 提示
        this.$message.success('跟新权限成功')
      }
    },
    // 删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('你确定要删除吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        let res = await this.axios.delete(`roles/${id}`)
        let { meta: { status } } = res
        if (status === 200) {
          this.$message.success('删除成功')
          // 重新页面
          this.getRoleList()
        }
      } catch (err) {
        this.$message('取消删除')
      }
    },
    // 添加角色
    addRole() {
      this.$refs.addForm.validate(async vaild => {
        if (!vaild) return false
        let res = await this.axios.post('roles', this.addForm)
        if (res.meta.status === 201) {
          this.$refs.addForm.resetFields()
          this.addDialogVisible = false
          this.getRoleList()
          this.$message.success('添加成功')
        }
      })
    },
    // 显示编辑对话框
    showEditDialog({ id, roleName, roleDesc }) {
      this.editDialogVisible = true
      // 数据回显
      this.editForm.id = id
      this.editForm.roleName = roleName
      this.editForm.roleDesc = roleDesc
    },
    // 编辑角色
    editRole() {
      this.$refs.editForm.validate(async vaild => {
        if (!vaild) return false
        let res = await this.axios.put(
          `roles/${this.editForm.id}`,
          this.editForm
        )
        if (res.meta.status === 200) {
          this.$refs.editForm.resetFields()
          this.editDialogVisible = false
          this.getRoleList()
          this.$message.success('修改成功')
        }
      })
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.level2 {
  margin-bottom: 10px;
}
.level3 {
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
