<template>
  <div id="app">
    <Header></Header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    
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
