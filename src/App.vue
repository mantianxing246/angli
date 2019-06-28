<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    try {
      //  在页面加载时读取localStorage里的状态信息
      localStorage.getItem('states') &&
        this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(localStorage.getItem('states'))))

      // 在页面刷新时将vuex里的信息保存到localStorage里
      window.addEventListener('beforeunload', () => {
        localStorage.setItem('states', JSON.stringify(this.$store.state))
      })
    } catch (e) {
      console.error(e.toLocaleString())
    }
  }
}
</script>
