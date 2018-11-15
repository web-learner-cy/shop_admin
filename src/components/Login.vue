<template>
<div class="login">
  <el-form ref="form" :model="form" :rules="rules" status-icon label-width="80px">
    <img src="../assets/images/avatar.jpg" alt="">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item label="密 码" prop="password">
      <el-input v-model="form.password" placeholder="请输入密码" type="password" @keyup.enter.native="submitForm"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">确定</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 4, max: 9, message: '长度在 4 到 9 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields()
    },
    // 表单提交
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 表单校验成功 发送ajax请求，
          let res = await this.axios({
            method: 'post',
            url: 'login',
            data: this.form
          })
          let { meta: { msg, status }, data: { token } } = res
          if (status === 200) {
            // 登录成功 提示登录成功，存储taken 跳转首页
            this.$message.success(msg)
            localStorage.setItem('token', token)
            this.$router.push('/home')
          } else {
            // 登录失败 提示登录失败
            this.$message.error(msg)
          }
        } else {
          // 表单校验失败
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    margin: 200px auto;
    background-color: #fff;
    padding: 75px 40px 15px;
    border-radius: 15px;
    position: relative;
    .el-button + .el-button {
      margin-left: 50px;
    }
    img {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -70px;
      border-radius: 50%;
      border: 10px solid #fff;
    }
  }
}
</style>
