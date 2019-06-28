<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb/>
    <div class="avatar-container">
      <div v-if="orderRejectionNumber.showFlag" class="hamburger-container">
        <span>
          <el-badge :value="orderRejectionNumber.number" class="item">
            <el-button size="small" @click="orderReject">订单驳回</el-button>
          </el-badge>
        </span>
      </div>
      <el-dropdown trigger="click">
        <div class="avatar-wrapper">
          <el-popover placement="top-start" title width="200" trigger="hover" class="user-avatar">
            <div>
              姓名:
              <span>{{ name }}</span>
            </div>
            <div>
              一级部门:
              <span>{{ dept[0] }}</span>
            </div>
            <div>
              二级部门:
              <span>{{ dept[1] }}</span>
            </div>
            <div>
              角色:
              <span v-for="role in roles" :key="role">{{ role }}</span>
            </div>
            <b slot="reference" style="align-items: center">{{ name }}</b>
          </el-popover>
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { removeToken } from "@/utils/auth"; // 验权
import { findRejectNumber } from "@/api/common/common.js";
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  created() {
    findRejectNumber().then(res => {
      this.$store.dispatch("orderRejectionNumber", res.data.number);
    });
  },
  mounted() {},
  computed: {
    ...mapGetters([
      "sidebar",
      "avatar",
      "name",
      "orderRejectionNumber",
      "roles",
      "dept"
    ])
  },
  methods: {
    orderReject() {
      this.$router.push({
        path: "/OrderMgt/OrderDetail",
        query: { isReject: 1 }
      });
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        // location.reload() // 为了重新实例化vue-router对象 避免bug

        localStorage.removeItem("states");
        removeToken("Admin-Token"); //移除Admin-Token
        if (!localStorage.getItem("states")) {
          this.$router.replace({
            name: "login"
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-badge__content.is-fixed {
  position: none;
  top: 15px;
  right: 17px;
}
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

