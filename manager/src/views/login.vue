<template>
  <div class="login" @click="$refs.verify.show = false">
    <Row @keydown.enter.native="submitLogin" class="flex">
      <Col style="width: 368px">
        <Header />
        <Row style="flex-direction: column">
          <Form
            ref="usernameLoginForm"
            :model="form"
            :rules="rules"
            class="form"
          >
            <FormItem prop="username">
              <Input
                v-model="form.username"
                prefix="ios-contact"
                size="large"
                clearable
                placeholder="请输入用户名"
                autocomplete="off"
              />
            </FormItem>
            <FormItem prop="password">
              <Input
                type="password"
                v-model="form.password"
                prefix="ios-lock"
                size="large"
                password
                placeholder="请输入密码"
                autocomplete="off"
              />
            </FormItem>
            <Checkbox v-model="checked" class="rememberMe">记住密码</Checkbox>
          </Form>

          <Row>
            <Button
              class="login-btn"
              type="primary"
              size="large"
              :loading="loading"
              @click="submitLogin"
              long
            >
              <span v-if="!loading">{{ $t("login") }}</span>
              <span v-else>{{ $t("logining") }}</span>
            </Button>
          </Row>
        </Row>
        <!-- 拼图验证码 -->
        <verify
          ref="verify"
          class="verify-con"
          verifyType="LOGIN"
          @change="verifyChange"
        ></verify>
        <Footer />
      </Col>
      <!-- <LangSwitch /> -->
    </Row>
  </div>
</template>

<script>
import { login, userInfo } from "@/api/index";
import Cookies from "js-cookie";
import Header from "@/views/main-parts/header";
import Footer from "@/views/main-parts/footer";
import LangSwitch from "@/views/main-parts/lang-switch";
import util from "@/libs/util.js";
import verify from "@/components/verify";

export default {
  components: {
    LangSwitch,
    Header,
    Footer,
    verify,
  },
  data() {
    return {
      loading: false, // 加载状态
      checked:false,
      isCookie:false,
      form: {
        // 表单数据
        username: "",
        password: "",
        // mobile: "",
        // code: "",
      },
      rules: {
        // 验证规则
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getCookie()
  },
  methods: {
    afterLogin(res) {
      // 登录成功后处理
      let accessToken = res.result.accessToken;
      let refreshToken = res.result.refreshToken;
      this.setStore("accessToken", accessToken);
      this.setStore("refreshToken", refreshToken);
      // 获取用户信息
      userInfo().then((res) => {
        if (res.success) {
          // 加载菜单
          Cookies.set("userInfoManager", JSON.stringify(res.result));
          this.$store.commit("setAvatarPath", res.result.avatar);
          util.initRouter(this);
          this.$router.push({
            name: "home_index",
          });
        } else {
          this.loading = false;
        }
      });
    },
    submitLogin() {
      // 登录操作
      this.$refs.usernameLoginForm.validate((valid) => {
        if (valid) {
          if(this.checked){
            this.setCookie(this.form.username,this.form.password,7)
          }else{
            this.form.password = this.form.password;
            this.setCookie("","",-1);
          }
          let fd = new FormData();
            fd.append("username", this.form.username);
            fd.append("password", this.form.password);
          login(fd)
            .then((res) => {
              if (res && res.success) {
                this.afterLogin(res);
              } else {
                this.loading = false;
              }
            })
            .catch(() => {
              this.loading = false;
            });
          // this.$refs.verify.show = false;
        }
      });
    },
    //设置cookie
    setCookie(username,password,days){
      let date = new Date()
      date.setTime(date.getTime() + 24*60*60*1000*days) //保存天数
      //字符串拼接cookie
      window.document.cookie = "username"+"="+username+";path=/;expires="+date.toGMTString()
      window.document.cookie = "password"+"="+password+";path=/;expires="+date.toGMTString()
    },
    //读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        let arr = document.cookie.split("; "); //分割成一个个独立的“key=value”的形式
        console.log(arr)
        for (let i = 0; i < arr.length; i++) {
          let arr2 = arr[i].split("="); // 再次切割，arr2[0]为key值，arr2[1]为对应的value
          if (arr2[0] === "username") {
            this.form.username = arr2[1];
          } else if (arr2[0] === "password") {
            this.form.password = arr2[1];
            if(this.form.password !=""){
              this.isCookie = true;
            }
            this.checked = true;
          }
        }
      }
    },
    // verifyChange(con) {
    //   // 拼图验证码回显
    //   if (!con.status) return;
    //
    //   this.loading = true;
    //
    //   let fd = new FormData();
    //   fd.append("username", this.form.username);
    //   fd.append("password", this.md5(this.form.password));
    //   login(fd)
    //     .then((res) => {
    //       if (res && res.success) {
    //         this.afterLogin(res);
    //       } else {
    //         this.loading = false;
    //       }
    //     })
    //     .catch(() => {
    //       this.loading = false;
    //     });
    //   this.$refs.verify.show = false;
    // },
  },
};
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  background: url("../assets/background.png") no-repeat;
  background-color: #f0f2f5;
  display: flex;
  background-size: cover;
  align-items: center;
  justify-content: center;

  .verify-con {
    position: absolute;
    top: 150px;
    z-index: 10;
    left: 20px;
  }
  .form {
    padding-top: 1vh;
  }

  .login-btn {
    background: linear-gradient(135deg, $theme_color 0%, $warning_color 100%);
    height: 40px;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #fff;
    width: 100%;
    text-align: center;
    transition: 0.35s;
  }
  .login-btn:hover {
    opacity: 0.9;
    border-radius: 10px;
  }
  .rememberMe{
    padding-bottom: 10px;
  }
}
.flex {
  justify-content: center;
}
</style>
