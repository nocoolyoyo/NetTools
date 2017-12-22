<template>
  <el-container id="app">
    <el-header>
      <div class="logo h1">Http Tools</div>
      <div>
        <el-button type="default">设置项目</el-button>
        <el-button type="success">导出项目</el-button>
        <el-button type="primary">导入项目</el-button>
      </div>

    </el-header>
    <el-container>
      <!--<el-aside width="200px">-->
        <!--<el-menu-->
          <!--default-active="2"-->
          <!--class="el-menu-vertical-demo"-->
          <!--@open="handleOpen"-->
          <!--@close="handleClose">-->
          <!--<el-submenu index="1">-->
            <!--<template slot="title">-->
              <!--<i class="el-icon-location"></i>-->
              <!--<span>导航一</span>-->
            <!--</template>-->
            <!--<el-menu-item-group>-->
              <!--<template slot="title">分组一</template>-->
              <!--<el-menu-item index="1-1">选项1</el-menu-item>-->
              <!--<el-menu-item index="1-2">选项2</el-menu-item>-->
            <!--</el-menu-item-group>-->
            <!--<el-menu-item-group title="分组2">-->
              <!--<el-menu-item index="1-3">选项3</el-menu-item>-->
            <!--</el-menu-item-group>-->
            <!--<el-submenu index="1-4">-->
              <!--<template slot="title">选项4</template>-->
              <!--<el-menu-item index="1-4-1">选项1</el-menu-item>-->
            <!--</el-submenu>-->
          <!--</el-submenu>-->
          <!--<el-menu-item index="2">-->
            <!--<i class="el-icon-menu"></i>-->
            <!--<span slot="title">导航二</span>-->
          <!--</el-menu-item>-->
          <!--<el-menu-item index="3">-->
            <!--<i class="el-icon-setting"></i>-->
            <!--<span slot="title">导航三</span>-->
          <!--</el-menu-item>-->
        <!--</el-menu>-->
      <!--</el-aside>-->
      <!--<el-container>-->
      <el-main>
        <dashboard/>
      </el-main>
      <!--</el-container>-->
    </el-container>
  </el-container>
</template>

<script>

import Dashboard from "@/components/Dashboard.vue";

export default {
  components: { Dashboard },
  name: 'app'
}
</script>

<style lang="scss">
  @import "styles/variables";

  html,body {
    overflow: hidden;
    height: 100%;
  }
  .hr {
    background-color: $c-milka;
    height:1px;
    width: 100%;
    display: block;
    margin: 0.5em 0;
  }
  .panel {
    border: 1px solid  $c-milka;
    border-radius:.4em;
    box-sizing: border-box;
    margin: 10px 0;
    .panel-title {
      width: 100%;
      border-radius:.4em .4em 0 0;
      background-color: lighten($c-milka,10%);
      padding:10px;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid  $c-milka;
    }
    .panel-body {
      padding:10px;
    }
  }
  #app {
  overflow: hidden;
  height: 100%;
    .el-header {
      z-index: 1;

      box-shadow: $box-shadow-main;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .logo {
        display: flex;
        align-items: center;
        justify-content:center;
        height:inherit;
        font-size: 30px;
        font-weight: bold;
      }

    }
    .el-aside {
      box-shadow: $box-shadow-main;
      background-color: white;
      .el-menu {
        border-right: none;
      }

    }
  }
</style>
