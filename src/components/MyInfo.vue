<template>
    <div class="big-box" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <div class="percentage">资料完整度{{percentage}}</div>
        <div class="user-pic">
            <span>头像</span>
            <div>
                <input type="file" id="file" @change="getImgUrl($event)" ref="inputer">
                <label for="file">
                    <img class="img" v-if="headImageUrl == ''" src="../assets/images/userNoSex.png">
                    <img class="img" v-if="headImageUrl != ''" :src="pic">
                </label>

            </div>
        </div>
        <div class="user-info-box">
            <div>
                <span>真实姓名*</span>
                <input v-model="name" placeholder="去填写" @blur="saveInfo(name)">
                <img src="../assets/images/xiayiye.png">
            </div>
            <div>
                <span>身份证号</span>
                <input v-model="idCard" placeholder="去填写" @blur="saveInfo(idCard)">
                <img src="../assets/images/xiayiye.png">
            </div>
            <div>
                <span>性别</span>
                <input v-model="sex" placeholder="去填写" readonly="readonly" @focus="openSex">
                <img src="../assets/images/xiayiye.png">
            </div>
            <div >
                <span>出生日期</span>
                <input placeholder="去填写" v-model="date" readonly="readonly" @focus="openPicker" >
                <img src="../assets/images/xiayiye.png">
            </div>
            <div class="address">
                <span>家庭住址</span>
                <input v-model="address" @blur="saveInfo(address)">
                <img src="../assets/images/xiayiye.png">
            </div>
            <div>
                <span>紧急联系人</span>
                <input placeholder="去填写" v-model="contact" readonly="readonly" @focus="saveContactInfo">
                <img src="../assets/images/xiayiye.png">
            </div>
            <div>
                <span>推荐医生</span>
                <input placeholder="" v-model="doctor" disabled >
                <img src="../assets/images/xiayiye.png">
            </div>
        </div>
        <div class="user-info-box2">
            <div>
                <span>身高</span>
                <input placeholder="去选择" v-model="height1" readonly="readonly" @focus="openHeight">
                <img src="../assets/images/xiayiye.png">
            </div>
            <div>
                <span>体重</span>
                <input v-model="weight1" placeholder="去选择" readonly="readonly" @focus="openWeight" >
                <img src="../assets/images/xiayiye.png">
            </div>
            <div >
                <span>腰围</span>
                <input placeholder="去填写" v-model="waistline1" readonly="readonly" @focus="openWaistline" >
                <img src="../assets/images/xiayiye.png">
            </div>
            <div class="address">
                <span>已患疾病</span>
                <input @focus="toIllness">
                <p class="left" >
                    <span v-for="item in haveIllness">{{item.illnessName}}</span>
                </p>
                <img src="../assets/images/xiayiye.png">
            </div>
        </div>
        <div class="user-info-box3">
            <div>
                <span>吸烟史</span>
                <input v-model="smokeHistory" placeholder="去填写" readonly="readonly" @focus="openSmoke" >
                <img src="../assets/images/xiayiye.png">
            </div>
            <div>
                <span>饮酒史</span>
                <input v-model="drinkHistory" placeholder="去填写" readonly="readonly" @focus="openSmokeHistory">
                <img src="../assets/images/xiayiye.png">
            </div>
            <div>
                <span>过敏史</span>
                <input v-model="allergicHistory" placeholder="去填写" @blur="saveInfo(allergicHistory)">
                <img src="../assets/images/xiayiye.png">
            </div>
            <div>
                <span>手术史</span>
                <input v-model="operationHistory" placeholder="去填写" @blur="saveInfo(operationHistory)">
                <img src="../assets/images/xiayiye.png">
            </div>
        </div>
        <!-- 身高 -->
        <mt-popup v-model="popupVisible1" position="bottom" class="mint-popup-4">
            <span class="mint-datetime-action mint-datetime-cancel" @click="cancleaddress1">取消</span>
            <span class="mint-datetime-action mint-datetime-confirm" @click="selectaddress1">确定</span>
            <mt-picker name="h" :slots="slots" @change="onValuesChange1"></mt-picker>
        </mt-popup>
        <!-- 体重 -->
        <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
            <span class="mint-datetime-action mint-datetime-cancel" @click="cancleaddress">取消</span>
            <span class="mint-datetime-action mint-datetime-confirm" @click="selectaddress">确定</span>
            <mt-picker name="w" :slots="slots" @change="onValuesChange"></mt-picker>
        </mt-popup>
        <!-- 腰围 -->
        <mt-popup v-model="popupVisible2" position="bottom" class="mint-popup-4">
            <span class="mint-datetime-action mint-datetime-cancel" @click="cancleaddress2">取消</span>
            <span class="mint-datetime-action mint-datetime-confirm" @click="selectaddress2">确定</span>
            <mt-picker name="w1" :slots="slots"  @change="onValuesChange2"></mt-picker>
        </mt-popup>


        <!-- 生日 -->
        <mt-datetime-picker
            ref="picker"
            type="date"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            v-model="pickerValue"
            :startDate="startDate"
            :endDate="endDate"
            @confirm="handleConfirm">
        </mt-datetime-picker>
        <!-- 性别 -->
        <mt-actionsheet
        :actions= "actions"
        v-model="sheetVisible">
        </mt-actionsheet>
        <!-- 吸烟史 -->
        <mt-actionsheet
        :actions= "smoke"
        v-model="sheetVisible1">
        </mt-actionsheet>
        <!-- 饮酒史 -->
        <mt-actionsheet
        :actions= "drink"
        v-model="sheetVisible2">
        </mt-actionsheet>

    </div>
</template>
<script>
import $http from 'axios'
import { MessageBox } from 'mint-ui';
import { DatetimePicker} from 'mint-ui';
import { Actionsheet } from 'mint-ui';
import { Picker } from 'mint-ui';
import { Popup } from 'mint-ui';
import doSign from '../../static/md5.js'
import {newPost1 , newPost2} from '../../static/request.js'
import { Toast } from 'mint-ui';
export default {
    data () {
        return {
            url:"",
            headImageUrl:"",
            loading:true,
            // 头像
            pic:"",
            // 姓名
            name:"",
            // 身份证号
            idCard:"",
            // 性别
            sex:"",
            // 时间（出生年月日）
            date:"",
             // 家庭详细地址
            address:"",
            // 推荐医生
            doctor:"",
            // 紧急联系人
            contact:"",
            // 已患疾病
            haveIllness:"",
            // 身高弹出
            popupVisible1:false,
            height:" ",
            height1:" ",
            // 体重弹出
            popupVisible:false,
            weight:" ",
            weight1:" ",
            // 腰围弹出
            popupVisible2:false,
            waistline:" ",
            waistline1:" ",
            goto:"去填写",
            // 设置开始时间
            startDate:new Date('1920/1/1'),
            // 设置结束时间
            endDate:new Date(),
            //
            pickerValue:"",
            // 百分比（资料完整度）
            percentage:"0%",
            // 性别
            actions:[{
                name:"男",
                method : this.setBoy
            },{
                name:"女",
                method : this.setGirl
            }],
            sheetVisible:false,
            // 吸烟史
            smoke:[{
                name:"不吸烟",
                method : this.noSmoke
            },{
                name:"已戒烟",
                method : this.cigarettes
            },{
                name:"一天10支以下",
                method : this.few
            },{
                name:"一天10-19支",
                method : this.ordinary
            },{
                name:"一天20支以上",
                method : this.many
            }],
            sheetVisible1:false,
            smokeHistory:"",
            // 饮酒史
            drink:[{
                name:"不喝酒",
                method : this.nonDrinker
            },{
                name:"偶尔喝",
                method : this.occasionallyDrink
            },{
                name:"经常喝",
                method : this.oftenDrink
            }],
            sheetVisible2:false,
            drinkHistory:"",
            // 身高
            slots:
                [{
                  flex: 1,
                  values: ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240"],
                  className: 'height1',
                  textAlign: 'center'
                }, {
                  divider: true,
                  content: '-',
                  className: 'height2'
                }, {
                  flex: 1,
                  values: ['.0', '.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9'],
                  className: 'height3',
                  textAlign: 'center'
            }],
            // 体重
            slots:
                [{
                  flex: 2,
                  values: ["30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256", "257", "258", "259", "260", "261", "262", "263", "264", "265", "266", "267", "268", "269", "270"],
                  className: 'weight1',
                  textAlign: 'center'
                }, {
                  divider: true,
                  content: '-',
                  className: 'weight2'
                }, {
                  flex: 2,
                  values: ['.0', '.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9'],
                  className: 'weight3',
                  textAlign: 'center'
            }],
            // 腰围
            slots:
                [{
                  flex: 3,
                  values: ["30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180"],
                  className: 'waistline1',
                  textAlign: 'center'
                }, {
                  divider: true,
                  content: '-',
                  className: 'waistline2'
                }, {
                  flex: 3,
                  values: ['.0', '.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9'],
                  className: 'waistline3',
                  textAlign: 'center'
            }],
            // 已患疾病
            illness:"",
            // 过敏史
            allergicHistory:"",
            // 手术史
            operationHistory:"",
            // popupVisible:false,
            // popupVisible1:false,
            // popupVisible2:false
        }
    },
    methods:{
        // 图片上传
        getImgUrl(e){
            var imgUpload = e.target.files[0];
            console.log(imgUpload)


            var fd = new FormData();
            fd.append('files',imgUpload);
            console.log(fd)


            var url = this.url+"/file/upload-files"+"?server=resource";
            $http({
                method: 'POST',
                url: url,
                data: fd,
                headers:{
                    "Content-Type":undefined
                }
            }).then(res => {
                console.log(res)
                this.upload(res.data.message[0].imgUrl)
            })
            .catch(err => {
                console.log(err);

            })
        },
        // 将图片上传到用户中心
        upload(imgUrl){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'headImageUrl':imgUrl
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                this.getUserInfo();
            })
        },
        // 获取用户基本信息
        getUserInfo(){
            
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var phone = data.account;
            var data = {
                userId,
                phone
            }
            var param ={
                url:this.url+"/system/client/user/info/get",
                data:data,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log("个人资料")
                console.log(res)
                var code = res.data.code;
                if(code == "1001"){
                    var msg = res.data.message;
                    // 头像
                    var headImageUrl = msg.headImageUrl;

                    // 名字
                    var name = msg.realName;
                    // 身份证号
                    var idCard = msg.idCard;
                    // 性别
                    var sex = msg.gender;
                    // 生日
                    var birthday = msg.birthday;
                    // 家庭住址
                    var address = msg.address;
                    // 紧急联系人
                    var guardian = msg.guardian;
                    // 紧急联系人电话
                    var guardianLinkphone = msg.guardianLinkphone;
                    // 推荐医生Id
                    var recommendDocId = msg.recommendDocId;
                    // 体重
                    var weight = msg.weight;
                    // 身高
                    var height = msg.height;
                    // 腰围
                    var waistline = msg.waistline;
                    // 已患疾病
                    if(!msg.haveIllness){
                        var haveIllness = ""
                    }else {
                        var haveIllness = JSON.parse(msg.haveIllness);
                    }

                    // 饮酒史
                    var drinking = msg.drinking;
                    // 吸烟史
                    var smoking = msg.smoking;
                    // 过敏史
                    var allergyHistory = msg.allergyHistory;
                    // 手术史
                    var surgeryHistory = msg.surgeryHistory;
                    
                    this.pic = this.url+headImageUrl+"?server=image";
                    this.name = name;
                    this.idCard = idCard;
                    this.sex = sex;
                    this.date = birthday;
                    this.address = address;
                    this.contact = guardian +" "+guardianLinkphone;

                    this.headImageUrl = headImageUrl;
                    if(weight == 0){
                        this.weight1=""
                    }else {
                        this.weight1 = weight +"kg";
                    }
                    if(height == 0){
                        this.height1=""
                    }else {
                        this.height1 = height + "cm";
                    }
                    if(waistline == 0){
                        this.waistline1=""
                    }else {
                        this.waistline1 = waistline + "cm";
                    }
                    if(haveIllness.length>0){
                        var str = [];
                        haveIllness.forEach(function(data){
                            // str+=" "+data.illnessName
                            str.push({illnessName:data.illnessName})
                        })
                        this.haveIllness = str;
                        console.log(str)
                    }
                    if(drinking == 0){
                        this.drinkHistory=""
                    }else {
                        this.drinkHistory = this.drink[drinking-1].name;
                    }
                    if(smoking == 0){
                        this.smokeHistory=""
                    }else {
                        this.smokeHistory = this.smoke[smoking-1].name;
                    }
                    this.allergicHistory = allergyHistory;
                    this.operationHistory = surgeryHistory;
                    this.loading= false;


                    // 用作计算占比的数据
                    this.userHeadImage = headImageUrl;
                    this.userName = name;
                    this.userIdCard = idCard;
                    this.userSex = sex;
                    this.userBirthday = birthday;
                    this.userAddress = address;
                    this.userGuardian = guardian;
                    this.userWeight = weight;
                    this.userHeight = height;
                    this.userWaistline = waistline;
                    this.userHaveIllness = msg.haveIllness;
                    this.userAllergyHistory = allergyHistory;
                    this.userSurgeryHistory = surgeryHistory;

                    


                    if(!!recommendDocId){
                        // 获取推荐医生的名字
                        var data1 ={
                            userId:recommendDocId
                        }
                        var param ={
                            url:this.url+"/system/hospital/user/detail",
                            data:data1,
                            token:token,
                            userId:userId,
                            server:'info'
                        }
                        newPost1(param).then((res) => {
                            console.log('res')
                            console.log(res)

                            var msg = res.data.message;
                            if(!msg){
                                this.doctor = '';
                            }else {
                                var register = msg.name;
                                this.doctor = register;
                            }
                            


                            // 计算资料完整度
                            this.proportion();

                        })
                    }else {
                        // this.doctor = "";
                        // 计算资料完整度
                        this.proportion();

                        
                        console.log(recommendDocId)
                        var register = "";
                        this.doctor = register;
                        // 计算资料完整度
                        this.proportion();
                        
                    }

                    var info = {
                        token,
                        userId,
                        account:phone,
                        name,
                        headImageUrl
                    }
                    localStorage.setItem('userInfo', JSON.stringify(info));

                }
                if(code == '1011'){
                    this.loading= false;
                }
            });
        },
        // 计算资料完整度
        proportion(){
            

            var percentage = 0;
            if(!!this.userHeadImage){
                percentage+=6.66;
            }
            if(!!this.userName){
                percentage+=6.66;
            }
            if(!!this.userIdCard){
                percentage+=6.66;
            }
            if(!!this.userSex){
                percentage+=6.66;
            }
            if(!!this.userBirthday){
                percentage+=6.66;
            }
            if(!!this.userAddress){
                percentage+=6.66;
            }
            if(!!this.userGuardian){
                percentage+=6.66;
            }
            if(!!this.userWeight){
                percentage+=6.66;
            }
            if(!!this.userHeight){
                percentage+=6.66;
            }
            if(!!this.userWaistline){
                percentage+=6.66;
            }
            if(!!this.drinkHistory){
                percentage+=6.66;
            }
            if(!!this.smokeHistory){
                percentage+=6.66;
            }
            if(!!this.userAllergyHistory){
                percentage+=6.66;
            }
            if(!!this.userHaveIllness){
                percentage+=6.66;
            }
            if(!!this.userSurgeryHistory){
                percentage+=6.66;
            }
           

            this.percentage = Math.ceil(percentage)+"%";
        },
        // 选择出生日期
        openPicker() {
            this.$refs.picker.open();
        },
        // 选择性别
        openSex(){
            this.sheetVisible = true;
        },
        // 选择吸烟史
        openSmoke(){
            this.sheetVisible1 = true;
        },
        // 饮酒史
        openSmokeHistory(){
            this.sheetVisible2 = true;
        },
        // 男
        setBoy(){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'gender':"男"
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                 this.sex="男"
                 this.userSex = '男'
                 this.proportion();
            })
        },
        // 女
        setGirl(){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'gender':"女"
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                 this.sex="女"
                 this.userSex = '女'
                 this.proportion();
            })
        },
        // 紧急联系人
        saveContactInfo(){
            MessageBox.prompt('请输入紧急联系人').then(({ value, action }) => {
              if(action == "confirm"){
                var contact = value;
                if(!contact){
                    Toast({
                        message: '紧急联系人不可为空',
                        duration: 2000
                    });
                    return;
                }
                MessageBox.prompt('请输入紧急联系人电话号码').then(({ value, action }) => {
                    if(action == "confirm"){
                        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(19[0-9]{1})|(11[0-9]{1})|(12[0-9]{1})|(10[0-9]{1})|(16[0-9]{1}))+\d{8})$/;
                        var contactPhone = value;
                        if (!reg.test(contactPhone)){
                           Toast({
                                message: '手机号码格式有误',
                                duration: 2000
                            });
                            return;
                        }


                        var data = JSON.parse(localStorage.getItem('userInfo'));
                        var token = data.token;
                        var userId = data.userId;
                        var data1 ={
                            'userId':userId,
                            'guardian':contact,
                            'guardianLinkphone':contactPhone
                        }
                        var param = {
                            url:this.url+"/system/client/user/info/update",
                            data:data1,
                            token:token,
                            userId:userId,
                            server:'info'
                        }
                        newPost1(param).then((res) => {
                            Toast({
                              message: '保存成功',
                              iconClass: 'icon icon-success'
                            });
                            this.userGuardian = contact+" "+contactPhone;
                            this.contact=contact+" "+contactPhone
                            this.proportion();
                        })
                    }
                });
              }
            });
        },
        // 不吸烟
        noSmoke(){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'smoking':1
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                this.smokeHistory="不吸烟"
                this.proportion();
            })

        },
        // 已戒烟
        cigarettes(){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'smoking':2
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                this.smokeHistory="已戒烟"
                this.proportion();
            })

        },
        // 少量
        few(){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'smoking':3
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                this.smokeHistory="一天10支以下"
                this.proportion();
            })

        },
        // 一般
        ordinary(){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'smoking':4
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                this.smokeHistory="一天10-19支"
                this.proportion();
            })

        },
        // 很多
        many(){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'smoking':5
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                this.smokeHistory="一天20支以上"
                this.proportion();
            })
        },
        // 不喝酒
        nonDrinker(){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'drinking':1
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                this.drinkHistory="不喝酒"
                this.proportion();
            })

        },
        // 偶尔喝
        occasionallyDrink(){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'drinking':2
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                this.drinkHistory="偶尔喝"
                this.proportion();
            })

        },
        // 经常喝
        oftenDrink(){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'drinking':3
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                this.drinkHistory="经常喝"
                this.proportion();
            })

        },
        // 生日
        handleConfirm(date){
            const y = date.getFullYear();
            let m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            this.date=y + '-' + m + '-' + d;

            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'birthday':this.date
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                this.userBirthday = this.date;
                this.proportion();
            })
        },
        // 体重
        openWeight(){
            this.popupVisible=true;
        },
        // 身高
        openHeight(){
            this.popupVisible1=true;
        },
        // 腰围
        openWaistline(){
            this.popupVisible2=true;
        },
        onValuesChange(picker, values) {
            this.weight = values[0]+values[1];
        },
        onValuesChange1(picker, values) {
            this.height = values[0]+values[1];
        },
         onValuesChange2(picker, values) {
            this.waistline = values[0]+values[1];
        },
        // 取消
        cancleaddress1(){
            this.popupVisible1=false;
        },
        cancleaddress(){
            this.popupVisible=false;
        },
        cancleaddress2(){
            this.popupVisible2=false;
        },
        // 確定
        selectaddress(){
            var _this = this;
            this.popupVisible=false;
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'weight':this.weight - 0
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                _this.userWeight = _this.weight - 0;
                _this.weight1=this.weight + "kg";
            })
        },
        selectaddress1(){
            var _this = this;
            this.popupVisible1=false;
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'height':this.height - 0
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                _this.height1=this.height +"cm";
                _this.userHeight = _this.height - 0;

                this.proportion();
            })
        },
        selectaddress2(){
            var _this = this;
            this.popupVisible2=false;
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'waistline':this.waistline - 0
            }
            var param = {
                url:this.url+"/system/client/user/info/update",
                data:data1,
                token:token,
                userId:userId,
                server:'info'
            }
            newPost1(param).then((res) => {
                console.log(res)
                Toast({
                  message: '保存成功',
                  iconClass: 'icon icon-success'
                });
                _this.waistline1=this.waistline + "cm";
                _this.userWaistline = _this.waistline - 0;

                this.proportion();
            })
        },
        // 跳转至已疾病
        toIllness(){
            this.$router.push({ path: '/illness' })
        },
        // 保存信息
        saveInfo(e){
            if(!e){
                MessageBox({
                    title: '保存信息失败',
                    message: '数据不可为空'
                });
            }else {
                var data = JSON.parse(localStorage.getItem('userInfo'));
                var token = data.token;
                var userId = data.userId;
                if(e == this.name){ // 真实姓名
                    var data ={
                        'userId':userId,
                        'realName':e
                    }
                }
                if(e == this.idCard){  // 身份证
                    let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
                    if (!reg.test(this.idCard)){
                        Toast({
                            message: '身份证号码有误',
                            duration: 2000
                        });
                        this.idCard = '';
                        return
                    }else {
                        var data ={
                            'userId':userId,
                            'idCard':e
                        }
                    }
                }
                if(e == this.address){  //家庭住址
                    var data ={
                        'userId':userId,
                        'address':e
                    }
                }
                if(e == this.allergicHistory){  //过敏史
                    var data ={
                        'userId':userId,
                        'allergyHistory':e
                    }
                }
                if(e == this.operationHistory){  //手术史
                    var data ={
                        'userId':userId,
                        'surgeryHistory':e
                    }
                }
                var param = {
                    url:this.url+"/system/client/user/info/update",
                    data:data,
                    token:token,
                    userId:userId,
                    server:'info'
                }
                newPost1(param).then((res) => {
                    // 用作计算占比的数据
                    // this.userHeadImage = headImageUrl;
                    // this.userName = name;
                    // this.userIdCard = idCard;
                    // this.userSex = sex;
                    // this.userBirthday = birthday;
                    // this.userAddress = address;
                    // this.userGuardian = guardian;
                    // this.userWeight = weight;
                    // this.userHeight = Height;
                    // this.userWaistline = waistline;
                    // this.userHaveIllness = msg.haveIllness;
                    // this.userDrinking = drinking;
                    // this.userSmoking = smoking;
                    // this.userAllergyHistory = allergyHistory;
                    // this.userSurgeryHistory = surgeryHistory;
                    var msg = res.data.message;
                    var userId = msg.userId;
                    var account = msg.account;
                    var name = msg.realName
                    var headImageUrl = msg.headImageUrl;
                    var idCard = msg.idCard;
                    var address = msg.address;
                    var allergyHistory = msg.allergyHistory;
                    var surgeryHistory = msg.surgeryHistory;



                    this.userName = name;
                    this.userIdCard = idCard;
                    this.userAddress = address;
                    this.userAllergyHistory = allergyHistory;
                    this.userSurgeryHistory = surgeryHistory;



                    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    var token = userInfo.token;
                    
                    
                    var info = {
                        token,
                        userId,
                        account,
                        name,
                        headImageUrl
                    }
                    localStorage.setItem('userInfo', JSON.stringify(info));
                    Toast({
                      message: '保存成功',
                      iconClass: 'icon icon-success'
                    });
                    this.proportion();
                })
            }
        }
    },
    mounted(){
        document.title = this.$route.meta.title;
        this.getUserInfo();
        this.url = $http.defaults.baseURL;
    },
    components:{

    }
}
</script>

<style scoped>
.big-box {
    min-height: 100%;
    width: 100%;
    background: #F7F7F7 !important;
    font-size: 4vw;
    overflow-y: scroll;
}
.percentage {
    height: 7vw;
    background: #EDA165;
    color: #FFFFFF;
}
.user-pic {
    height: 20vw;
    background: #FFFFFF;
    margin-bottom: 4vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0px 2vw;
}
.user-pic>div{
    height: 15vw;
    width: 15vw;
    overflow: hidden;
    border-radius: 50%;
}
.user-pic>.img {
    height: 15vw !important;
    width: 15vw !important;
}
.user-info-box>div {
    min-height: 15vw;
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 0px 2vw;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 1px;
    position: relative;
}
.user-info-box>div>span {
    width: 24vw;
    text-align: left;
}
.user-info-box>div>input {
    flex: 1;
    font-size: 4vw;
    text-align: right;
    box-sizing: border-box;
    padding-right: 6vw;
    height: 15vw;
    border: 0px;
    outline: none;
}
.user-info-box>div>img {
    position: absolute;
    top: 5vw;
    right: 2vw;
    height: 5vw;
    width: 5vw;
}

.user-info-box2 {
    margin: 2vw 0px;
}

.user-info-box2>div {
    min-height: 15vw;
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 0px 2vw;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 1px;
    position: relative;
}
.user-info-box2>div>span {
    width: 24vw;
    text-align: left;
}
.user-info-box2>div>input {
    flex: 1;
    font-size: 4vw;
    text-align: right;
    box-sizing: border-box;
    padding-right: 6vw;
    height: 15vw;
    border: 0px;
    outline: none;
}
.user-info-box2>div>img {
    position: absolute;
    top: 5vw;
    right: 2vw;
    height: 5vw;
    width: 5vw;
}

.user-info-box3>div {
    min-height: 15vw;
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 0px 2vw;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 1px;
    position: relative;
}
.user-info-box3>div>span {
    width: 24vw;
    text-align: left;
}
.user-info-box3>div>input {
    flex: 1;
    font-size: 4vw;
    text-align: right;
    box-sizing: border-box;
    padding-right: 6vw;
    height: 15vw;
    border: 0px;
    outline: none;
}
.user-info-box3>div>img {
    position: absolute;
    top: 5vw;
    right: 2vw;
    height: 5vw;
    width: 5vw;
}
.mint-popup,.mint-popup-4,.mint-popup-bottom {
    width: 100%;
}
.picker {
    width: 100%;
}
.picker-slot,.picker-slot-left,.slot1 {
    text-align: center !important;
}
.ok {
    width: 100%;
}
#file {
    display: none;
}
input {
    background: #FFFFFF;
}
.left {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
.left>span {
    margin-right: 2vw;
}
</style>
