<template>
  <div id="app">
    <Header></Header>
    <transition name="el-fade-in-linear">
      <router-view></router-view>
    </transition>
    
  </div>
</template>

<script>
  import header from './components/header'
  export default {
    name: "App",
    components: {
      Header:header
    }
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
    text-decoration: none;
    list-style: none;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  html,body,#app{
    width: 100%;
    height: 100%;
  }

  #app{
    min-width: 1400px;
    position: relative;
    overflow: hidden;
  }

  button{
    border: none;
    cursor: pointer;
    outline: none;
  }
</style>
