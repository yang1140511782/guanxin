<template>
    <div class="big-box">
        <div class="appraise-box">
            <div class="block" @click="a($event)">
                <span class="demonstration">态度</span>
                <el-rate v-model="attitude" :texts="texts" show-text text-color="#EDA165"></el-rate>
            </div>
                <div class="block">
                <span class="demonstration">质量</span>
                <el-rate v-model="quality" :texts="texts" show-text text-color="#EDA165"></el-rate>
            </div>
            <div class="block">
                <span class="demonstration">响应时间</span>
                <el-rate v-model="qualityTime" :texts="texts" show-text text-color="#EDA165"></el-rate>
            </div>
                <div class="block">
                <span class="demonstration">评分</span>
                <el-rate v-model="appraise" :texts="texts" show-text text-color="#EDA165"></el-rate>
            </div>
        </div>
        <div class="text">
            <textarea placeholder="评价一下吧..." maxlength="200" v-model="content" @input="keyup">

            </textarea>
            <span>{{textNum}}</span>
        </div>
        <div class="bottom">
            <div class="btn" @click="comment">提交</div>
        </div>
    </div>
</template>
<script>
    import { Toast } from 'mint-ui';
    import $http from 'axios'
    import {newPost1} from '../../static/request.js'

    export default {
        data () {
            return {
                url:"",
                texts:['差','不满意','一般','满意','非常满意'],
                // 态度
                attitude:0,
                // 质量
                quality:0,
                // 响应时间
                qualityTime:0,
                // 评分
                appraise:0,
                // 评论内容
                content:"",
                // 输入剩余个数
                textNum:200


            }
        },
        methods:{
            // 清空星星
            // e.target.lastElementChild ||
            a(e){
                var element = e.target.parentNode.parentNode;
                console.log(element)
                // console.log(e.target.lastElementChild.getAttribute("aria-valuenow"))
            },
            // 发表评论
            comment(){
                if(!this.attitude&&!this.quality&&!this.qualityTime&&!this.appraise){
                    Toast({
                        message: "请对该服务打分",
                        duration: 2000
                    });
                    return
                }
                if(!this.attitude){
                    Toast({
                        message: "请对服务态度打分",
                        duration: 2000
                    });
                    return
                }
                if(!this.quality){
                    Toast({
                        message: "请对服务质量打分",
                        duration: 2000
                    });
                    return
                }
                if(!this.qualityTime){
                    Toast({
                        message: "请对响应时间打分",
                        duration: 2000
                    });
                    return
                }
                 if(!this.appraise){
                    Toast({
                        message: "请对评分打分",
                        duration: 2000
                    });
                    return
                }
                if(!this.content){
                    Toast({
                        message: "评论内容不可为空",
                        duration: 2000
                    });
                    return
                }
                var data1 = JSON.parse(localStorage.getItem('userInfo'));
                var token = data1.token;
                var userId = data1.userId;
                var name = data1.name;
                var account = data1.account;
                var serviceId = JSON.parse(sessionStorage.getItem('serviceId'));
                var orderNo = JSON.parse(sessionStorage.getItem('orderNo'));

                var data ={
                    "serviceId":serviceId,
                    "orderNo":orderNo,
                    "userId":userId,
                    "userType":'type_user',
                    "userName":name,
                    "userAccount":account,
                    "attitudeScore":this.attitude,
                    "responseScore":this.qualityTime,
                    "qualityScore":this.quality,
                    "serviceScore":this.appraise,
                    "content":this.content
                }
                var param ={
                    url:this.url+"/system/user/reservation/service/comment/submit",
                    data:data,
                    token:token,
                    userId:userId,
                    server:'reservation'
                }
                newPost1(param).then((res) => {
                    console.log(res)
                    this.$router.push({
                        path: '/evaluateSuccess',
                        name: 'EvaluateSuccess'
                    })

                })
            },
            keyup(){
                var num = 0;  //总个数累加判断
                for (var i = 0; i < this.content.length; i++) {
                    //根据charCodeAt来判断输入的是中文还是字母，符号
                    var charCode = this.content.charCodeAt(i);
                    if (charCode >= 0 && charCode <= 128){
                        //字符就+1
                        num += 1;
                    }
                    else{
                        //汉子就+2
                        // num += 2;
                        num += 1;
                    }
                };
                this.textNum = 200-num <=0 ? 0 : 200-num;
            }
        },
        mounted(){
            document.title = this.$route.meta.title;
            var data1 = JSON.parse(localStorage.getItem('userInfo'));
            this.url = $http.defaults.baseURL;
        },
        components:{

        }
    }
</script>

<style scoped>
.big-box {
    height: 100%;
    width: 100%;
    background: #EFEFF4 !important;
}
.appraise-box {
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 3vw;
    margin-bottom: 2vw;
}
.block {
    display: flex;
    align-items: center;
    margin-bottom: 2vw;
}
.block>span {
    text-align: left;
    width: 30vw;
}
.text {
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 3vw;
    position: relative;
}
.text textarea {
    width: 100%;
    height: 20vw;
    border: none;
    outline: none;
}
.text>span {
    position: absolute;
    bottom: 0vw;
    right: 3vw;
    font-size: 14px;
    color: #a6a6a6;

}
.bottom {
    width: 100%;
    box-sizing: border-box;
    padding: 4vw;
    position: fixed;
    bottom: 0px;
    left: 0px;
}
.bottom>.btn {
    background: #18AEED ;
    color: #FFFFFF;
    height: 15vw;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
