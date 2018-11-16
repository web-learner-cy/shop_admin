<template>
  <div class="categories">
    <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(225, 225, 225, 0.8)"
      :data="categoryList"
      style="width: 100%">
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        tree-key="cat_id"
        level-key="cat_level"
        parent-key="cat_pid"
        :indentSize="20">
      </el-table-tree-column>
      <el-table-column
        prop="cat_deleted"
        label="是否删除">
        <template slot-scope="scope">
          {{scope.row.cat_deleted?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          <el-button size="small" plain type="danger" icon="el-icon-delete" @click="delCategory(scope.row.cat_id)"></el-button>
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
      :page-sizes="[10, 20, 30, 40]"
      :total="total">
    </el-pagination>
    <!-- 弹出框 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="addForm" :rules="rules" status-icon ref="addForm" label-width="80px" >
        <el-form-item label="分类名称"  prop="cat_name">
          <el-input v-model="addForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            clearable
            :options="options"
            change-on-select
            :props="props"
            v-model="addForm.cat_pid">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出框 编辑分类 -->
    <el-dialog title="编辑分类"
      :visible.sync="editDialogVisible"
      width="40%">
      <el-form
        :model="editForm"
        :rules="rules"
        status-icon
        ref="editForm"
        label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      categoryList: [],
      total: 0,
      // 控制加载
      loading: false,
      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      options: [],
      props: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      },
      editDialogVisible: false,
      editForm: {
        id: '',
        cat_name: ''
      }
    }
  },
  methods: {
    async getCategoryList() {
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      this.loading = false
      // console.log(res)
      let { meta: { status }, data: { result, total } } = res
      if (status === 200) {
        this.categoryList = result
        this.total = total
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoryList()
    },
    async showAddDialog() {
      this.addDialogVisible = true
      let res = await this.axios.get(`categories?type=2`)
      // console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.options = data
      }
    },
    addCategory() {
      this.$refs.addForm.validate(async vaild => {
        if (!vaild) return false
        let { cat_name: catName, cat_pid: catPid } = this.addForm
        let res = await this.axios.post('categories', {
          cat_name: catName,
          cat_level: catPid.length,
          cat_pid: catPid[catPid.length - 1] || 0
        })
        if (res.meta.status === 201) {
          this.addDialogVisible = false
          this.$refs.addForm.resetFields()
          this.getCategoryList()
          this.$message.success('添加分类成功')
        }
      })
    },
    async delCategory(id) {
      try {
        await this.$confirm('你确定要删除吗', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        let res = await this.axios.delete(`categories/${id}`)
        if (res.meta.status === 200) {
          this.getCategoryList()
          this.$message.success('删除成功')
        }
      } catch (err) {
        this.$message('取消删除')
      }
    },
    showEditDialog({ cat_id: id, cat_name: catName }) {
      this.editDialogVisible = true
      this.editForm.id = id
      this.editForm.cat_name = catName
    },
    editCategory() {
      this.$refs.editForm.validate(async vaild => {
        if (!vaild) return false
        let res = await this.axios.put(
          `categories/${this.editForm.id}`,
          this.editForm
        )
        if (res.meta.status === 200) {
          this.editDialogVisible = false
          this.$refs.editForm.resetFields()
          this.getCategoryList()
          this.$message.success('修改分类成功')
        }
      })
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style>
</style>
