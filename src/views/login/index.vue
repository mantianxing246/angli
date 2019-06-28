<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
      size="medium"
    >
      <h3 class="title">NewClasses</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="on"
          placeholder="username"
          id="input"
        />
      </el-form-item>
      <el-form-item prop="password" class="placehold-css">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="password"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <!-- <svg-icon icon-class="eye" :class="{'password-eye':passwordEye}"/> -->
          <svg-icon icon-class="eye" v-show="!passwordEye"/>
          <svg-icon icon-class="eyeOpen" v-show="passwordEye"/>
        </span>
      </el-form-item>
      <!--验证码-->
      <el-row>
        <el-col :span="12">
          <el-form-item size="mini" prop="iden" style="float: left">
            <el-input v-model="loginForm.iden" name="iden" type="text" style="font-size: 20px"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" @click.native="RandomCipher">
          <el-form-item size="mini" style="float: right;border: none;background: none">
            <!-- <img src="@/assets/yz_images/yz.jpg" alt style="width: 100px;height: 50px;float: right"> -->
            <div class="passImg">
              <div>{{this.letter1}}</div>
              <div>{{this.num}}</div>
              <div>{{this.letter2}}</div>
              <div>{{this.letter3}}</div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <!-- <el-button
          id="btn_login"
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click="handleLogin"
        >Sign in</el-button>-->
        <el-button
          id="btn_login"
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click="handleLogin"
        >登录</el-button>
      </el-form-item>
      <!--
      <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span>password: admin</span>
      </div>
      -->
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";

export default {
  name: "Login",
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        iden: null
      },
      passwordEye: false,
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass }
        ],
        iden: [
          { required: true, message: "验证码为必填项", trigger: "blur" },
          { min: 4, max: 4, message: "验证码不正确", trigger: "blur" }
        ]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined,
      num: 0,
      letter1: null,
      letter2: null,
      letter3: null
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd () {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
      this.passwordEye = !this.passwordEye
    },
    handleLogin () {
      if (!isvalidUsername(this.loginForm.username)) {
        this.$message({
          message: "请填写用户名",
          type: "warning"
        });
        return
      }
      if (!isvalidUsername(this.loginForm.password)) {
        this.$message({
          message: "请填写密码",
          type: "warning"
        });
        return
      }
      if (!isvalidUsername(this.loginForm.iden)) {
        this.$message({
          message: "请填写验证码",
          type: "warning"
        });
        return
      }
      if (this.loginForm.iden.toLowerCase() === this.letter1.replace(/[A-Z]/g, this.letter1.toLowerCase()) +
        this.num + this.letter2.replace(/[A-Z]/g, this.letter2.toLowerCase()) + this.letter3) {
        // if (this.loginForm.iden === "x5Tb") {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store
              .dispatch("Login", this.loginForm)
              .then(
                () => {
                  this.loading = false;
                  this.$router.push({ path: this.redirect || "/" });

                  localStorage.setItem('states', JSON.stringify(this.$store.state))

                  this.$message({
                    message: "登录成功",
                    type: "success"
                  });
                },
                message => {
                  this.$message({
                    message: message,
                    type: "error"
                  });
                  this.loading = false;
                }
              )
              .catch(() => {
                this.loading = false;
              });
          } else {
            this.$tipsMessage("验证失败", "error");
            return false;
          }
        });
      } else {
        this.$tipsMessage("验证码不正确", "error")
      }
    },
    RandomCipher () {
      let numberRandomArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      let letterRandomArr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

      this.num = this.mathRandomNum(numberRandomArr, 10),
        this.letter1 = Math.random() > 0.5 ? this.mathRandomNum(letterRandomArr, 25) : this.mathRandomNum(letterRandomArr, 25).toUpperCase(),
        this.letter2 = this.mathRandomNum(letterRandomArr, 25).toUpperCase(),
        this.letter3 = this.mathRandomNum(letterRandomArr, 25)
    },
    mathRandomNum (arr, totle) {
      return arr[Math.floor(Math.random() * totle)]
    }
  },
  created () {
    this.RandomCipher()
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.el-form-item--mini {
  // padding-left: 30px;
  // padding-right: 30px;
  // width: 200px;
  /*overflow: hidden;*/
}
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
      &::-webkit-input-placeholder {
        opacity: 0.5;
        filter: alpha(50%);
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.passImg {
  width: 150px;
  height: 50px;
  float: right;
  display: flex;
  font-size: 30px;
  text-align: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-image: url("../../assets/yz_images/yz.jpg");
}
.passImg {
  div {
    margin-right: 10px;
  }
}
.passImg div:nth-child(1) {
  transform: rotate(30deg);
}
.passImg div:nth-child(2) {
  transform: rotate(20deg) translateY(4px);
}
.passImg div:nth-child(3) {
  transform: rotate(10deg);
}
.passImg div:nth-child(4) {
  transform: rotate(-30deg) translateY(10px);
}
.password-eye {
  transform: rotate(180deg);
}
</style>
