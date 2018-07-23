<template>
    <div class="big-box">
        <div class="img-box">
            <img src="../assets/images/logo.png">
        </div>
        <form ref="form" :model="form" label-width="80px" class="form">
            <div>
                手机号：<input v-model="account" placeholder="请输入手机号码"></input>
                <div :disabled="dis" class="get-code-btn" @click="getCode">{{codeMsg}}</div>
            </div>
            <div>
                验证码：<input v-model="code" placeholder="请输入验证码"></input>
            </div>

        </form>
        <div class="agree">
            <el-checkbox v-model="checked" class="checked" @click="pitchOn"></el-checkbox>
            <p>已阅读并同意 <a href="http://cluster.cardiochina.net/medcare/dest/client/userAgree.html">《关心堂用户使用协议》</a> </p>
        </div>
        <button class="login-btn" @click="login">登录</button>
        <!-- <div>
            测试专用：
            <input v-model="phone">
            <div @click="login1">
                点击这个登录
            </div>
        </div> -->
    </div>
</template>
<script>
import $http from 'axios'
import doSign from '../../static/md5.js'
import { Toast } from 'mint-ui';
import { config } from '../../static/code.js'
import {newPost1 , newPost2} from '../../static/request.js'

export default {
    data () {
        return {
            phone:"",
            url:"",
            account:'',     //用户账号即手机号
            code:'',        //输入的验证码
            validCode:'',     //获取的验证码
            codeTime:60,      //获取验证码时间，小于等于0表示可以获取
            codeMsg:'获取验证码',   //获取验证码提示信息
            dis:false,  // 是否禁止点击获取验证码
            form:"",
            checked:true
        }
    },
    methods:{
        // login1(){
        //     var url1 = this.url+"/client/login?server=medcare2";
        //     $http({
        //         method: 'POST',
        //         url: url1,
        //         data: {
        //             'account':this.phone,
        //             'password':'123456'
        //             // 'password':'111111'

        //         },
        //         headers:{
        //             "Content-Type":"application/x-www-form-urlencoded",
        //             'ip':'0.0.0.0',
        //             'mac':'mac_web',
        //             'client-type':'type_doc',
        //             'shop-type':'type_medcare',
        //             'system-type':'type_h5',
        //             'system-version':'system_version_we',
        //             'phone-model':'phone_model_web',
        //             'app-version':'app_version_web'
        //         },
        //         transformRequest: [function (data) {
        //             let ret = ''
        //             for (let it in data) {
        //               ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        //             }
        //             return ret
        //         }]
        //     }).then(res => {
        //             var msg = res.data.message;
        //             var token = msg.accessToken;
        //             var userId = msg.userId;
        //             var account = msg.account;
        //             var name = msg.realName
        //             var headImageUrl = msg.headImageUrl;
        //             var info = {
        //                 token,
        //                 userId,
        //                 account,
        //                 name,
        //                 headImageUrl
        //             }
        //             localStorage.setItem('userInfo', JSON.stringify(info));
        //             var path = JSON.parse(sessionStorage.getItem('back'));
        //             this.$router.replace({ path: path})
        //             // this.$router.push({ path: '/my'})
        //         })
        //         .catch(err => {
        //             console.log(err);
        //         })
        // },
        // 获取验证码
        getCode(){
            if(!this.account){
                Toast({
                    message: '请输入手机号码',
                    duration: 2000
                });
                return ;
            }
            var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(19[0-9]{1})|(11[0-9]{1})|(12[0-9]{1})|(10[0-9]{1})|(16[0-9]{1}))+\d{8})$/;

            if (!reg.test(this.account)){
               Toast({
                    message: '手机号码格式有误',
                    duration: 2000
                });
                return;
            }



            // var signObjStr= doSign.doSign();
            // var url = this.url+"/validcode/get?"+signObjStr+"&server=core";
            // $http({
            //     method: 'POST',
            //     url: url,
            //     data: {
            //         'parameter':JSON.stringify({tel:this.account})
            //     },
            //     headers:{
            //         "Content-Type":"application/x-www-form-urlencoded",
            //         'ip':'0.0.0.0',
            //         'mac':'mac_web',
            //         'client-type':'type_doc',
            //         'shop-type':'type_medcare',
            //         'system-type':'type_h5',
            //         'system-version':'system_version_we',
            //         'phone-model':'phone_model_web',
            //         'app-version':'app_version_web'
            //     },
            //     transformRequest: [function (data) {
            //         let ret = ''
            //         for (let it in data) {
            //           ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            //         }
            //         return ret
            //     }]
            // }).then(res => {
            //     console.log(res)
            //     var codeNum = res.data.code;
            //     if(codeNum == "1001"){
            //         this.dis=true;
            //         this.codeMsg="重新发送"+this.codeTime+"s"
            //         var _this = this;
            //         var time =_this.codeTime - 0;
            //         var timeItv = setInterval(function(){
            //             time--;
            //             _this.codeMsg="重新发送"+time+"s"
            //             if(time<=0){
            //                 clearInterval(timeItv);
            //                 _this.codeMsg="获取验证码"
            //                 _this.dis=false;
            //             }
            //         },1000)
            //     }
            // })
            // .catch(err => {
            //     console.log(err);
            // })

            var url = this.url+"/validcode/get";
            var data={
                tel:this.account
            }
            var param ={
                url:url,
                data:data,
                server:'core'
            }
            newPost2(param).then((res) => {
                var codeNum = res.data.code;
                if(codeNum == "1001"){
                    this.dis=true;
                    this.codeMsg="重新发送"+this.codeTime+"s"
                    var _this = this;
                    var time =_this.codeTime - 0;
                    var timeItv = setInterval(function(){
                        time--;
                        _this.codeMsg="重新发送"+time+"s"
                        if(time<=0){
                            clearInterval(timeItv);
                            _this.codeMsg="获取验证码"
                            _this.dis=false;
                        }
                    },1000)
                }
            })
        },
        // 选中
        pitchOn(){
            this.checked = !this.checked
        },
        login(){
            var param = {
                account: this.account,
                validCode: this.code
            }
            var account = this.account;
            var code = this.code;
            if (account == ""){
                Toast({
                    message: '请输入手机号码',
                    duration: 2000
                });
                return;
            }
            if (code == "") {
                Toast({
                    message: '请输入验证码',
                    duration: 2000
                });
                return;
            }
            if (!this.checked) {
                Toast({
                    message: '请勾选关心堂用户协议',
                    duration: 2000
                });
                return;
            }
            var signObjStr= doSign.doSign();
            var url = this.url+"/system/validcode/volidLogin?"+signObjStr+"&server=core";
            $http({
                method: 'POST',
                url: url,
                data: {
                    'parameter':JSON.stringify(param)
                },
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded",
                    'ip':'0.0.0.0',
                    'mac':'mac_web',
                    'client-type':'type_doc',
                    'shop-type':'type_medcare',
                    'system-type':'type_h5',
                    'system-version':'system_version_we',
                    'phone-model':'phone_model_web',
                    'app-version':'app_version_web'
                },
                transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
                      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }]
            }).then(res => {
                console.log(res)
                if(res.data.code != '1001'){
                    var message = ""
                    for(var item in config.CODEARRAY){
                        if(config.CODEARRAY[item].code == res.data.code){
                            message = config.CODEARRAY[item].describe;
                            break;
                        }
                    }
                    Toast({
                        message: message,
                        duration: 2000
                    });
                    if(res.data.code == '1023'){
                        this.$router.push({
                            path: '/register',
                            name: 'Register',
                            params: {
                                "account": this.account,
                                "code":this.code
                            }

                        })
                    }
                } else {
                    var msg = res.data.message;
                    var token = msg.accessToken;
                    var userId = msg.userId;
                    var account = msg.account;
                    var name = msg.realName
                    var headImageUrl = msg.headImageUrl;
                    var info = {
                        token,
                        userId,
                        account,
                        name,
                        headImageUrl
                    }
                    localStorage.setItem('userInfo', JSON.stringify(info));
                    var path = JSON.parse(sessionStorage.getItem('back'));
                    this.$router.replace({ path: path})
                }
            })
            .catch(err => {
                console.log(err);
                Toast({
                    message: "接口异常请稍后再试！",
                    duration: 2000
                });
            })
        }
    },
    mounted(){
       document.title = this.$route.meta.title;
       this.url = $http.defaults.baseURL;
    },
    components:{

    }
}
</script>

<style scoped>
a {
    text-decoration: none;
    color: #a9b4ca;
}
.big-box {
    height: 100%;
    width: 100%;
    background: #EFEFF4 !important;
    overflow: hidden;
}
/*LOGO图片*/
.big-box .img-box {
    height: 33.33vw;
    display: flex;
    justify-content: center;
    align-items: center;
}
.big-box .img-box>img {
    height: 16.533vw;
}
/*表单*/
.big-box .form {
    height: 22.93vw;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-left: 4vw;
}
.big-box .form>div {
    position: relative;
    height: 10.93vw;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 4.266vw;
}
.form>div:nth-child(1) {
    box-sizing: content-box;
    height: 10.93vw;
    border-bottom: 1px solid #F6F6F6;
}
.form>div>input{
    position: absolute;
    right: 0px;
    top: 0px;
    bottom: 0px;
    margin:auto;
    width: 69.33vw;
    height: 8.53vw;
    border: none;
    font-size: 4vw;
    outline: none;
}
.form>div:nth-child(1)>.get-code-btn {
    position: absolute;
    right: 4vw;
    height: 8.53vw;
    line-height: 8.53vw;
    /*width: 22.66vw;*/
    z-index: 22;
    font-size: 3.46vw;
    background: #18AEEE;
    color: #FFFFFF;
    border: none;
    border-radius: 5px;
    outline: none;
    top: 0px;
    bottom: 0px;
    margin: auto;
    box-sizing: border-box;
    padding: 0px 2vw;
}
/*同意条款*/
.big-box .agree{
    height: 14.93vw;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 4vw;
}
.big-box .agree>.checked {
    margin-right: 2vw;
    outline: none;
}
.agree>p {
    font-size: 12px;
}
.agree>p>a {
    text-decoration: none;
}
/*登录*/
.big-box .login-btn {
    height: 12.26vw;
    width: 89.06vw;
    margin: auto 0px;
    background: #18AEEE;
    color: #FFFFFF;
    border:none;
    border-radius: 5px;
    outline: none;
    font-size: 4.8vw;
}
</style>
