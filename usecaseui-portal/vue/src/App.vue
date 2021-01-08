<template>
  <div id="app">
    <Menu></Menu>
    <router-view />
  </div>
</template>

<script>
import Menu from "./components/common/Menu.vue"

export default {
  name: 'App',
  components: {
    Menu
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
