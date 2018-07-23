<template>
    <div class="big-box1">  
        <!-- <div class="top">
            <div @click="pitchOn($event,[1,2])">待服务</div>
            <div @click="pitchOn($event,'')">全部预约</div>
        </div> -->
        <div class="top">
            <router-link @click.native="pitchOn" to="/record/wait" tag="p">    
                待服务
            </router-link>
            <router-link @click.native="pitchOn" to="/record/allservice" tag="p">    
                全部预约
            </router-link>
        </div>
        <div class="main">
            <router-view></router-view>  
        </div>
        <tab class="footer"></tab>
    </div>
</template>
<script>
import tab from './Tab'
export default {
    data () {
        return {

        }
    },
    methods:{
        // 选中
        pitchOn(){
            // console.log("OK")
            // var e = document.getElementsByTagName("p");
            // console.log(e)
            // li.className = "border";
        }
    },
    mounted(){
        document.title = this.$route.meta.title;
        
    },
    components:{
        tab
    }
}
</script>

<style scoped>
.big-box1 {
    height: 100%;
    width: 100%;
    background: #EFEFF4 ;
    display: flex;
    flex-direction: column;
}
.top {

    background: #FFFFFF;
    height: 10vw;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1vw;
}
.top>p{
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.main {
    flex: 1;
    overflow: auto;
    margin-bottom: 17vw;
}
.footer {
    height: 15vw;
    width: 100%;
}
.router-link-active {
    color: #18AEED;
}
.router-link-exact-active {
    border-bottom: 3px solid #18AEED;
}
</style>
