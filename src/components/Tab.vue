<template>
    <div class="footer">  
        <ul>
            <router-link to="/service" tag="li">
                <img class="display" src="../assets/images/navbar_1_choosed@3x.png" >
                <img src="../assets/images/navbar_1_normal@3x.png" >
                <span>服务</span>
            </router-link>
            <router-link to="/record" tag="li">
                <img class="display" src="../assets/images/navbar_3_choosed@3x.png" >
                <img src="../assets/images/navbar_3_normal@3x.png" >
                <span>记录</span>
            </router-link>
            <router-link to="/my" tag="li" >
                <img class="display" src="../assets/images/navbar_2_choosed@3x.png" >
                <img src="../assets/images/navbar_2_normal@3x.png" >
                <span>我的</span>
            </router-link>
        </ul>
    </div>
</template>
<script>
export default {
    data () {
        return {
           
        }
    },
    methods:{

    },
    mounted(){
        var e = document.getElementsByClassName("router-link-active");
        if(e.length>1){
            var img = e[1].children[0];
            var img1 = e[1].children[1];
            img.className = "show";
            img1.className = "display";
        }else {
            var img = e[0].children[0];
            var img1 = e[0].children[1];
            img.className = "show";
            img1.className = "display";
        }
        
    } 
}
</script>

<style scoped>
    .footer {
        height: 15vw;
        width: 100%;
        background: #FFFFFF;
    } 
    ul {
        color: #989898 ;
        margin-left: 0px;
        padding-left: 0px;
        padding-top:0px; 
        margin-top: 0px;
        width: 100%;
        height: 100% !important;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 5vw;
        line-height: 5vw;
        font-size: 16px;
    }
    ul>li {
        margin: 0px;
        height: 100%;
        list-style: none;
        flex: 1 ;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    ul>li>img {
        width: 8vw;
        height: 8vw;
    }
    .router-link-active{
        color: #18AEED;
    }
    /*.router-link-exact-active {
        color: #18AEED;
    }*/
    .display {
        display: none;
    }
    .show {
        display: block;
    }
</style>
