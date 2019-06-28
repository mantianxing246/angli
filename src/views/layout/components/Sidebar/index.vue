<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-openeds="openeds"
      unique-opened
      :show-timeout="200"
      :default-active="$route.url"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in routes" :key="route.url" :item="route" :base-path="route.url"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import state from '@/store'

export default {
  components: { SidebarItem },
  data () {
    return {
      openeds: ['1'],
      uniqueOpened: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes () {
      return state.getters.menus
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>
