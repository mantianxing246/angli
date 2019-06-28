<template>
  <div v-if="!item.hidden&&item.menuTreeList" class="menu-wrapper">
    <template
      v-if="hasOneShowingChild(item.menuTreeList,item) && (!onlyOneChild.menuTreeList||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
    >
      <app-link :to="resolvePath(onlyOneChild.url)" :id="onlyOneChild.url">
        <el-menu-item
          :index="resolvePath(onlyOneChild.url)"
          :class="{'submenu-title-noDropdown':!isNest}"
        >
          <item
            v-if="onlyOneChild.menuName"
            :icon="onlyOneChild.icon||item.icon"
            :title="onlyOneChild.menuName"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else :index="resolvePath(item.url)">
      <template slot="title">
        <item v-if="item.menuName" :icon="item.icon" :title="item.menuName"/>
      </template>

      <template v-for="child in item.menuTreeList" v-if="!child.hidden">
        <sidebar-item
          v-if="child.menuTreeList&&child.menuTreeList.length>0"
          :is-nest="true"
          :item="child"
          :key="child.url"
          :base-path="resolvePath(child.url)"
          class="nest-menu"
        />
        <app-link v-else :to="resolvePath(child.url)" :id="child.url" :key="child.name">
          <el-menu-item :index="resolvePath(child.url)">
            <item v-if="child.menuName" :icon="child.icon" :title="child.menuName"/>
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils'
import Item from './item'
import AppLink from './link'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    hasOneShowingChild (children, parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    //路由的路径
    resolvePath (routePath) {
      if(routePath === 'OrderDetail'){
          this.$store.dispatch("orderRejectionNumberShowFlag",true);
      }
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink (routePath) {
      //正则匹配/^(https?:|mailto:|tel:)/
      return isExternal(routePath)
    }
  }
}
</script>
