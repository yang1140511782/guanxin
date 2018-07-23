<template>
    <div class="big-box">
        <mt-field label="真实姓名" placeholder="请输入您的真实姓名" v-model="name"></mt-field>
        <mt-field label="身份证号" placeholder="请输入您的身份证号码" v-model="idCard" @blur.native.capture="verifyIdCard"></mt-field>
        <mt-field label="性别" readonly="readonly" placeholder="请选择"  v-model="sex" @focus.native.capture="openSex"></mt-field>
        <mt-button class="btn" type="primary" size="large" @click="register">完成</mt-button>
        <mt-actionsheet
        :actions= "actions"
        v-model="sheetVisible">
        </mt-actionsheet>
    </div>
</template>
<script>
import $http from 'axios'
import { Actionsheet } from 'mint-ui';
import { Toast } from 'mint-ui';
import {newPost1 , newPost2} from '../../static/request.js'

export default {
    data () {
        return {
            url:"",
            // 电话号码
            account:'',
            // 验证码
            code:'',
            // 名字
            name:"",
            // 身份证号码
            idCard:"",
            // 性别
            sex:"",
            actions:[{
                name:"男",
                method : this.setBoy
            },{
                name:"女",
                method : this.setGirl
            }],
            sheetVisible:false,
            // 注册结果
            registerResult:false
        }
    },
    methods:{
        // 验证身份证号码
        verifyIdCard(){
            let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            if (!reg.test(this.idCard)){
                Toast({
                    message: '身份证号码有误',
                    duration: 2000
                });
                this.idCard = ""
                return;
            }
        },
        // 注册
        register(){
            var hospitalId = JSON.parse(sessionStorage.getItem('hospitalId'));
            var hospitalName = JSON.parse(sessionStorage.getItem('hospitalName'));
            var name = this.name;
            var idCard = this.idCard;
            var sex = this.sex;
            var birthday = idCard.slice(6,14);
            birthday = birthday.slice(0,4) + "-" +birthday.slice(4,6) + "-" +birthday.slice(6,8);
            if (name == ""){
                Toast({
                    message: '请输入您的真实姓名',
                    duration: 2000
                });
                return;
            }
            if (idCard == "") {
                Toast({
                    message: '请输入您的身份证号码',
                    duration: 2000
                });
                return;
            }
            if (sex == "") {
                Toast({
                    message: '请选择性别',
                    duration: 2000
                });
                return;
            }
            // 已经注册
            if(this.registerResult == false){
                
                var param = {
                    tel: this.account,
                    code: this.code,
                    password: "123456",
                    sex: this.sex,
                    birthday:birthday,
                    realName: this.name,
                    selectDoc: '',
                    joinType:'type_reservation',
                    joinHospitalId:hospitalId,
                    joinHospitalName:hospitalName
                }
                var url = this.url+"/client/register/get/validate/codeandinfo?server=medcare2";
                $http({
                    method: 'POST',
                    url: url,
                    data: param,
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    },
                    transformRequest: [function (data) {
                        let ret = ''
                        for (let it in data) {
                          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret
                    }]
                }).then(res => {
                    // 注册成功
                    console.log(res)
                    this.registerResult = true;


                    // 登录
                    var url1 = this.url+"/client/login?server=medcare2";
                    $http({
                        method: 'POST',
                        url: url1,
                        data: {
                            'account':this.account,
                            'password':'123456'
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


                        var userId = res.data.message.userId;
                        var token = res.data.message.accessToken;
                        var info1 = {
                            token,
                            userId
                        }
                        localStorage.setItem('userInfo', JSON.stringify(info1));
                        // 验证身份证号码是否与数据库中的重复
                        var data ={
                            'userId':userId,
                            'idCard':this.idCard
                        }
                        var param = {
                            url:this.url+"/system/client/user/info/update",
                            data:data,
                            token:token,
                            userId:userId,
                            server:'info'
                        }
                        newPost1(param).then((res) => {
                            console.log('res')
                            console.log(res)

                            if(res.data.code == '2028'){  // 重复
                                this.idCard =''
                            }else {
                                console.log("可以的")
                                var msg = res.data.message;
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
                                this.$router.replace({ path: '/my'})
                                
                            }
                        })
                            
                        })
                    .catch(err => {
                        console.log(err);
                    })



                   
                })
            }else {   // 已经注册，但是身份证号码不正确
                console.log("666666666666")

                var url1 = this.url+"/client/login?server=medcare2";
                $http({
                    method: 'POST',
                    url: url1,
                    data: {
                        'account':this.account,
                        'password':'123456'
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


                    var userId = res.data.message.userId;
                    var token = res.data.message.accessToken;
                    var info1 = {
                        token,
                        userId
                    }
                    localStorage.setItem('userInfo', JSON.stringify(info1));
                    // 验证身份证号码是否与数据库中的重复
                    var data ={
                        'userId':userId,
                        'idCard':this.idCard
                    }
                    var param = {
                        url:this.url+"/system/client/user/info/update",
                        data:data,
                        token:token,
                        userId:userId,
                        server:'info'
                    }
                    newPost1(param).then((res) => {
                        console.log('res')
                        console.log(res)

                        if(res.data.code == '2028'){  // 重复
                            this.idCard =''
                        }else {
                            console.log("可以的111")
                            var msg = res.data.message;
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
                            this.$router.replace({ path: '/my'})
                        }
                    })
                        
                    })
                .catch(err => {
                    console.log(err);
                })


                // var data = JSON.parse(localStorage.getItem('userInfo'));
                // var token = data.token;
                // var userId = data.userId;
                // var data ={
                //     'userId':userId,
                //     'idCard':this.idCard
                // }
                // var param = {
                //     url:this.url+"/system/client/user/info/update",
                //     data:data,
                //     token:token,
                //     userId:userId,
                //     server:'info'
                // }
                // newPost1(param).then((res) => {
                //     console.log('res')
                //     console.log(res)

                //     if(res.data.code == '2028'){  // 重复
                //         this.idCard = ''
                //     }else {
                //         var msg = res.data.message;
                //         var account = msg.account;
                //         var name = msg.realName
                //         var headImageUrl = msg.headImageUrl;
                //         var info = {
                //             token,
                //             userId,
                //             account,.
                //             name,
                //             headImageUrl
                //         }
                //         localStorage.setItem('userInfo', JSON.stringify(info));


                //         var url1 = this.url+"/client/login?server=medcare2";
                //         $http({
                //             method: 'POST',
                //             url: url1,
                //             data: {
                //                 'account':account,
                //                 'password':'123456'
                //             },
                //             headers:{
                //                 "Content-Type":"application/x-www-form-urlencoded",
                //                 'ip':'0.0.0.0',
                //                 'mac':'mac_web',
                //                 'client-type':'type_doc',
                //                 'shop-type':'type_medcare',
                //                 'system-type':'type_h5',
                //                 'system-version':'system_version_we',
                //                 'phone-model':'phone_model_web',
                //                 'app-version':'app_version_web'
                //             },
                //             transformRequest: [function (data) {
                //                 let ret = ''
                //                 for (let it in data) {
                //                   ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                //                 }
                //                 return ret
                //             }]
                //         }).then(res => {
                //                 this.$router.replace({ path: '/my'})
                //             })
                //         .catch(err => {
                //             console.log(err);
                //         })
                //     }
                // })
            }
        },
        // 选择性别
        openSex(){
            console.log("获得焦点")
            this.sheetVisible = true;
        },
        // 男
        setBoy(){
            this.sex="男"
        },
        // 女
        setGirl(){
            this.sex="女"
        }
    },
    mounted(){
        console.log(this.code)
    },
    mounted(){
        document.title = this.$route.meta.title;
        this.url = $http.defaults.baseURL;
        var account=this.$route.params.account;
        var code=this.$route.params.code;
        sessionStorage.setItem('accountAndCode', JSON.stringify({'account':account,'code':code}));
        var hospitalId = JSON.parse(sessionStorage.getItem('accountAndCode'));
        this.account = hospitalId.account;
        this.code = hospitalId.code;

        console.log(hospitalId)
    },
    components:{

    }
}
</script>

<style>
input {
    border:0px !important;
}
.big-box {
    height: 100%;
    width: 100%;
    background: #F7F7F7 !important;
    overflow: hidden;
}
/*.box .el-form {
    background: #FFFFFF;
    margin-top: 2.66vw;
}
.el-form .el-form-item {
    margin-bottom: 0px !important;
}
.box .el-form ..el-input__inner{
    border:0px !important;
}
.el-form-item__label {
    box-sizing: border-box;
    padding-left: 4vw;
}
.el-form-item:nth-child(4)>.el-form-item__content{
    margin-left: 0px !important;
}
.box .el-form .btn{
    position: absolute;
    width: 92vw !important;
    margin-top: 3.73vw;
    left: 4vw;
}*/
.mint-cell-text {
    display: flex;
    justify-content: flex-start;
}
.btn {
    margin-top: 3.73vw;
}
</style>
