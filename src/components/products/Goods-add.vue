<template>
  <div class="goods_add">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-tabs tab-position="left" @tab-click="handleClick" :value="currentName">
      <el-tab-pane name="basic" label="基本信息">
        <el-form :model="addForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="options"
              v-model="addForm.goods_cat"
              :props="props">
            </el-cascader>
          </el-form-item>
           <el-form-item label="商品促销">
            <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="pic" label="商品图片">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          :on-success="handleSuccess"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2,'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name="content" label="商品内容">
        <quill-editor
          v-model="addForm.goods_introduce">
        </quill-editor>
        <el-button type="primary" @click="addGood">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: [],
        is_promote: true,
        pics: [],
        goods_introduce: ''
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      currentName: 'basic',
      fileList: [],
      // 设置token
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      this.active = +tab.index
    },
    next(active, currentName) {
      this.active = active
      this.currentName = currentName
    },
    // 图片上传成功后的函数
    handleSuccess(res, file, fileLis) {
      console.log(res, file, fileLis)
      let { meta: { status }, data: { tmp_path: tmpPath } } = res
      if (status === 200) {
        this.addForm.pics.push({
          pic: tmpPath
        })
      }
    },
    async addGood() {
      let res = await this.axios.post('goods', {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join()
      })
      console.log(res)
      let { meta: { status } } = res
      if (status === 201) {
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      }
    }
  },
  async created() {
    let res = await this.axios.get('categories?type=3')
    // console.log(res)
    let { meta: { status }, data } = res
    if (status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang="less" scoped>
.quill-editor {
  background-color: #fff;
  /deep/ .ql-editor {
    height: 300px;
  }
}
</style>
