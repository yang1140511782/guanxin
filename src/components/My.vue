<template>
    <div class="big-box">
        <div class="my-pic-box">
            <img src="../assets/images/user_pic_bg.jpg">
            <div class="user-info-box">
                <div class="user-info-img-box">
                    <img v-if="pic == ''" src="../assets/images/userNoSex.png">
                    <img v-if="pic != ''" v-bind:src="pic">
                </div>
                <div class="user-name">{{userName}}</div>
                <div class="user-phone">{{userPhone}}</div>
            </div>
        </div>
        <div class="my-info" @click="toMyInfo">
            <span>个人资料</span>
            <img src="../assets/images/xiayiye.png">
        </div>
        <div class="my-collect" @click="toMyCollect">
            <span>我的收藏</span>
            <img src="../assets/images/xiayiye.png">
        </div>
        <div @click="logout" class="logout">
            <span>退出登录</span>
            <img src="../assets/images/xiayiye.png">
        </div>
        <tab class="footer"></tab>
    </div>
</template>
<script>
import { Toast } from 'mint-ui';
import tab from './Tab';
import $http from 'axios';
export default {
    data () {
        return {
            pic:"",
            userName:"",
            userPhone:"",
            url:''
        }
    },
    methods:{
        // 跳转个人资料
        toMyInfo(){
            this.$router.push({ path: '/myinfo'})
        },
        // 获取个人信息
        getUserIfo(){
            var _this= this;
            var data = JSON.parse(localStorage .getItem('userInfo'));
            if(!!data.headImageUrl){
                _this.pic = _this.url+data.headImageUrl+"?server=image";
            }else {
                _this.pic=""
            }
            this.userName = data.name;
            this.userPhone = data.account;
        },
        // 跳转我的收藏
        toMyCollect(){
            this.$router.push({ path: '/mycollect'})
        },
        // 退出登录
        logout(){
            localStorage.clear();
            Toast({
                message: "退出登录成功",
                duration: 2000
            });
            var _this=this;
            setTimeout(function(){
                _this.$router.push({
                    path: '/service',
                    name: 'Service'
                })
            },1000);
        }
    },
    mounted(){
        document.title = this.$route.meta.title;
        this.url = $http.defaults.baseURL;
        // var data = JSON.parse(localStorage.getItem('userInfo'));
        console.log($http.defaults.baseURL)
        this.getUserIfo();

    },
    components:{
        tab
    }
}
</script>

<style scoped>
.big-box {
    height: 100%;
    width: 100%;
    background: #F7F7F7 !important;
}
.my-pic-box {
    height: 56vw;
    width: 100%;
    position: relative;
    margin-bottom: 4vw;
}
.my-pic-box>img {
    height: 100%;
    width: 100%;
}
.user-info-box {
    width: 24vw;
    height: 32vw;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin:auto;
}
.user-info-box>.user-info-img-box {
    margin-left: 2vw;
    height: 20vw;
    width: 20vw;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #FFFFFF;
}
.user-info-box>.user-info-img-box>img {
    height: 100%;
    width: 100%;
}
.user-name {
    height: 6vw;
    line-height: 6vw;
    text-align: center;
    color: #FFFFFF;
    font-size: 16px;
}
.user-phone {
    height: 6vw;
    line-height: 6vw;
    text-align: center;
    color: #FFFFFF;
    font-size: 12px;
}
.my-info,.my-collect,.logout {
    height: 10vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FFFFFF;
    margin-bottom: 1px;
    box-sizing: border-box;
    padding-left: 3vw;
    padding-right: 3vw;
}
.my-info>span,.my-collect>span,.logout>span {
    color: #212121;
}
.my-info>img,.my-collect>img,.logout>img {
    height: 4vw;
    width: 4vw;
}
.page-tabbar {
    overflow: hidden;
    height: 100vh;
  }

  .page-wrap {
    overflow: auto;
    height: 100%;
    padding-bottom: 100px;
  }
</style>
