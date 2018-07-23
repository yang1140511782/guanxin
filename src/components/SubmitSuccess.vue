<template>
    <div class="big-box">  
        <div class="img-box">
            <img src="../assets/images/icon_wancheng@3x.png">
        </div>
        <div class="text">
            提交预约成功
        </div>
        <div class="text2">
            您的预约已提交成功，请耐心等待医生的确认
        </div>
        <div class="order-review" @click="toOrder">
            查看订单
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                
            }
        },
        methods:{
            // 跳转订单
            toOrder(){
                this.$router.push({
                    path: '/orderinfo', 
                    name: 'OrderInfo'
                })
            }
        },
        mounted(){
            document.title = this.$route.meta.title;
        },
        components:{
           
        }
    }
</script>

<style scoped>
.big-box {
    height: 100%;
    width: 100%;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.img-box {
    width: 20vw;
    height: 20vw;
    margin-bottom: 5vw;
}
.img-box>img {
    height: 100%;
    width: 100%;
}
.text {
    font-size: 16px;
    margin-bottom: 2vw;
}
.text2 {
    font-size: 12px;
    color: #A7A7A7;
    margin-bottom: 8vw;
}
.order-review {
    color: #18AEEE;
    border:1px solid;
    padding: 2vw 5vw;
    border-radius: 20px;
}
</style>
