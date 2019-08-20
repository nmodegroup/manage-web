<template>
  <div class="login-bg">
    <div class="login-frame">
      <div class="login-title">NIGHT MODE</div>
      <div class="login-content">
        <div class="form-bar">
          <input type="text" placeholder="用户名" @keyup.enter="onLogin" v-model="form.account">
        </div>
        <div class="form-bar">
          <input type="password" placeholder="密码" @keyup.enter="onLogin" v-model="form.pwd">
        </div>
        <div class="form-bar">
          <button @click="onLogin">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {login} from "@/api/login";
export default {
  data () {
    return {
      form: {
        account: '',
        pwd: ''
      }
    }
  },
  methods: {
    onLogin () {
      if (!this.form.account) {
        this.$Message.info('请输入账号')
      } else if (!this.form.pwd) {
        this.$Message.info('请输入密码')
      } else {
        login(this.form).then(res => {
          localStorage.setItem("token", res.data)
          this.$goto('UserAccount')
        })
      }
    }
  }
}
</script>
<style scoped>
  .login-bg{
    background:rgba(239,239,239,1);
    width:100%;
    height: 100%;
  }
  .login-frame {
    width:498px;
    height:448px;
    background:rgba(255,255,255,1);
    border-radius:10px;
    position: fixed;
    top:0;
    bottom: 0;
    left:0;
    right:0;
    margin: auto;
  }
  .login-title {
    color:rgba(5, 5, 18, 1);
    font-size: 36px;
    font-weight: bold;
    padding: 88px 0 28px;
    text-align: center;
  }
  .form-bar {
    padding: 0 87px 20px;
  }
  .form-bar input{
    width:324px;
    height:42px;
    background:rgba(248,248,251,1);
    border-radius:5px;
    border:1px solid rgba(231,231,239,1);
    outline: none;
    padding: 0 15px;
  }
  .form-bar button {
    width:324px;
    height:42px;
    background:rgba(59,125,221,1);
    border-radius:5px;
    outline: none;
    border:none;
    font-size:14px;
    color:rgba(255,255,255,1);
  }
</style>

