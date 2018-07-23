<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
    name: 'App',
    mounted(){
        //对console设置开关
        if (true) {
            window.console.log=function(){
            },
            window.console.table=function(){
            },
            window.console.error=function(){
            },
            window.console.info=function(){
            }
        }
    }
}
</script>

<style>
html,body {
    height: 100%;
    width: 100%;
    margin:0px;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
   /* -webkit-user-select:none;     取消微信长按出现的默认弹框
    -webkit-touch-callout:none;*/
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100%;
    width: 100%;
    /*overflow-y: scroll;*/
}
.img {
    height: 15vw !important;
    width: 15vw !important;
}
/*头部*/
.header {
    display: block;
    height: 12vw;
}
.header>h2 {
    background: #333337;
    color: #FFFFFF;
    height: 12vw;
    line-height: 12vw;
    margin:0px;
    overflow: hidden;
    font-size: 4.533vw;
    font-weight: 100;
    text-align: center;
}
.mint-loadmore {
    overflow: visible;
    min-height: 100%;
}
/*
.mint-loadmore-content {
    min-height: 100%;
}*/

.mint-spinner-snake {
    height: 15px !important;
    width: 15px !important;
    border: 2px solid transparent;
}
.mint-loadmore-top>span:nth-child(2) {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mint-loadmore-bottom>span:nth-child(1) {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.picker-selected {
    color: #26a2ff !important;
}
.slot2 {
    color: #26a2ff !important;
}
.big-box {
    overflow-y: scroll;

}
.el-icon-loading {
    font-size: 40px;
}
.el-loading-spinner {
    font-size: 16px;
    position: fixed;
    top: 50%;
}
.el-carousel__container {
    height: 100vw !important;
}

.picker-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.mint-datetime-action {
    width: 30%;
}
.footer {
    position: fixed;
    bottom: 0px;
    z-index: 999;
}
.blue {
    color: #1881FB !important;
}
.floatImg img{
  height: 50px;
  position: fixed;
  right: 0;
  top: 10px;
  z-index: 999;
}
</style>
