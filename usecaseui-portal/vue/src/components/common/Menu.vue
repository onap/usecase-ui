<template>
  <div class="menu">
    <Menu theme="light" active-name="7" @on-select="seletMenu">
      <div v-for="(item, index) in menuList" :key="index">
        <Submenu :name="item.name" v-if="item.children.length!==0">
          <template slot="title">
            {{item.title}}
          </template>
            <MenuItem v-for="(val, index) in item.children" :key="index" :name="val.name">
              {{val.title}}
            </MenuItem>
        </Submenu>
        <MenuItem :name="item.name" v-else>{{item.title}}</MenuItem>
      </div>
    </Menu>
    <br>
  </div>
</template>

<script>
import { menu } from "@/const/index.js"

export default {
  components: {
  },
  data () {
      return {
        menuList: menu.MENU_ITEM
      }
  },
  created () {
    console.log(this.menuList)
  },
  methods: {
    seletMenu (name) {
      let seletedItem = {}
      for (let item of this.menuList) {
        if (item.name === name) {
          seletedItem = item
        } else{
          for (let val of item.children) {
            if (val.name === name) {
              seletedItem = val
            }
          }
        }
      }
      console.log(seletedItem)
      this.$router.push({path: seletedItem.path})
    }
  },
};
</script>

<style lang="sass">

</style>