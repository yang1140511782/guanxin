<template>
    <div class="big-box" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <div class="selected">
            <span>已选择</span>
            <span>{{number}}</span>
        </div>
        <div class="illness" v-show="show">
            <span v-for="item in illnessList">
                {{item.illnessName}}
            </span>
        </div>
        <div class="search">
            <img src="../assets/images/search.png">
            <input v-model="value" placeholder="搜索疾病" @change="searchIllness(value)"></input>
            <div v-if="search == true" class="position" @click="cancel">取消</div>
        </div>
        <div class="illness-list" v-if="search == true">
            <div class="main-box" v-for="(item,index) in searchIllnessList" @click="selectedIllness1(index)">
                <span class="main">{{item.name}}</span>
                <!-- <img class="groupcell"  src="../assets/images/dagou.png"> -->
                <img v-if="item.daGou" src="../assets/images/dagou.png">

            </div>
        </div>
        <div class="illness-list" v-if="search == false">
            <div class="list-box" v-for="(item,index) in illnessListAll">
                <div class="top">{{item.name}}</div>
                <div class="main-box" v-for="(iten,idx) in item.data" @click="selectedIllness(index,idx,iten.id)">
                    <span class="main">{{iten.name}}</span>
                    <!-- <img class="groupcell"  src="../assets/images/dagou.png"> -->
                    <img v-if="iten.daGou"  src="../assets/images/dagou.png">

                </div>
            </div>
        </div>
        <div class="btn-box">
            <mt-button @click="submit" type="primary" size="normal">保存</mt-button>
        </div>
    </div>
</template>
<script>
import $http from 'axios'
import { Toast } from 'mint-ui';
import doSign from '../../static/md5.js'
import {newPost1 , newPost2} from '../../static/request.js'

export default {
    data () {
        return {
            loading:true,
            url:'',
            // 已患疾病列表
            illnessList:[],
            illnessList1:[],
            // 已患疾病的个数
            number:0,
            number1:0,
            // 搜索内容
            value:"",
            // 所有疾病列表
            illnessListAll:[],
            // 搜索疾病列表
            searchIllnessList:[],
            // 即将要保存的疾病
            saveIllness:[],
            show:false,
            ids:[],
            search:false
        }
    },
    methods:{
        // 获取个人资料，获取已患疾病
        getUserInfo(list){
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
                var msg = res.data.message;
                if(!msg.haveIllness){
                    var haveIllness = ""
                }else {
                    var haveIllness = JSON.parse(msg.haveIllness);
                }
                var l = haveIllness.length;
                this.number = l;
                var length = list.length;

                if(l>0){
                    for(let i=0;i<l;i++){
                        this.saveIllness.push({
                            illnessId:haveIllness[i].illnessId,
                            illnessName:haveIllness[i].illnessName,
                            illnessTypeId:haveIllness[i].illnessTypeId,
                            illnessTypeName:haveIllness[i].illnessTypeName
                        })
                        for(let j=0;j<length;j++){
                            var length1 = list[j].data.length;
                            for(let k=0;k<length1;k++){
                                if(haveIllness[i].illnessName == list[j].data[k].name){
                                    this.illnessList.push({
                                        illnessId:haveIllness[i].illnessId,
                                        illnessName:haveIllness[i].illnessName,
                                        illnessTypeId:haveIllness[i].illnessTypeId,
                                        illnessTypeName:haveIllness[i].illnessTypeName,
                                        index:j,
                                        idx:k
                                    })
                                    this.illnessListAll[j].data[k].daGou = true;

                                }
                            }
                        }
                    }
                    this.show = true;
                    
                    console.log(this.illnessList)

                }
                this.loading = false;
            })
        },
        // 获取所有疾病
        getIllnessAll(){
            var url = this.url+"/base/chronic/illness/getAll?server=medcare2"
            $http({
                method: 'GET',
                url: url,
            }).then(res => {
                var message = res.data.message;

                var array = message.list;
                var l = array.length;
                var arr = [];
                for(let i=0;i<l;i++){
                   arr = array[i].data;
                   var l1 = arr.length;
                   for(let j = 0; j<l1;j++){
                        array[i].data[j] = {
                            'id': array[i].data[j].id,
                            'illnessNum': array[i].data[j].illnessNum,
                            'name': array[i].data[j].name,
                            'sort': array[i].data[j].sort,
                            'status': array[i].data[j].status,
                            'type': array[i].data[j].type,
                            'daGou':false
                        }
                   }
                }
                this.illnessListAll = array;
                this.getUserInfo(array);
                console.log('array')
                console.log(array)


            })
            .catch(err => {
                console.log(err);
            })
        },
        // 选中疾病
        selectedIllness(index,idx,id){
            if(!this.illnessListAll[index].data[idx].daGou){  // 选中

                if(this.number<6){
                    this.illnessListAll[index].data[idx].daGou = !this.illnessListAll[index].data[idx].daGou;
                    this.number += 1;
                    this.illnessList.push({
                        illnessId:this.illnessListAll[index].data[idx].id,
                        illnessName:this.illnessListAll[index].data[idx].name,
                        illnessTypeId:this.illnessListAll[index].typeId,
                        illnessTypeName:this.illnessListAll[index].name,
                        index:index,
                        idx:idx
                    })
                    this.show = true;
                    this.ids.push({id});
                    this.saveIllness.push({
                        illnessId:this.illnessListAll[index].data[idx].id,
                        illnessName:this.illnessListAll[index].data[idx].name,
                        illnessTypeId:this.illnessListAll[index].typeId,
                        illnessTypeName:this.illnessListAll[index].name
                    })
                    console.log(this.illnessList)
                }else {
                    Toast('最多只能选6个');
                }
            }else {
                this.illnessListAll[index].data[idx].daGou = !this.illnessListAll[index].data[idx].daGou;
                var length = this.illnessList.length;
                for(let i=0;i<length;i++){
                    if(this.illnessList[i].illnessId == this.illnessListAll[index].data[idx].id){
                        this.illnessList.splice(i,1);
                        this.number -= 1;
                        if(this.number<=0){
                            this.show = false;
                        }
                    }
                    if(this.saveIllness[i].illnessId == this.illnessListAll[index].data[idx].id){
                        this.saveIllness.splice(i,1)
                    }
                }
                // console.log(this.illnessList)
            }
        },
        // 搜索疾病
        searchIllness(value){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var roleType = data.roleType;
            var value = value;
            if(value ==""){
                return Toast('请输入关键字');
            }
            var signObjStr= doSign.doSign();
            var url = this.url+"/system/chronic/illness/search?"+signObjStr+"&server=cause";
            $http({
                method: 'POST',
                url: url,
                data: {
                    'parameter':JSON.stringify({'name':value})
                },
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded",
                    'ip':'0.0.0.0',
                    'mac':'mac_web',
                    'client-type':' type_user',
                    'shop-type':'type_medcare',
                    'system-type':'type_h5',
                    'system-version':'system_version_we',
                    'phone-model':'phone_model_web',
                    'app-version':'app_version_web',
                    'role-type':2001,
                    'user-id':userId,
                    'access-token':token
                },
                transformRequest: [function (data) {
                    let ret = ''
                    for (let it in data) {
                      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                }]
            }).then(res => {
                console.log(res);
                var code = res.data.code;
                if(code == "1001"){
                    var msg = res.data.message;
                    var length = msg.length;
                    var l = this.illnessList.length;
                    if(length>0){
                        for(let i=0;i<length;i++){
                            msg[i] = {
                                id:msg[i].id,
                                illnessNum:msg[i].illnessNum,
                                name:msg[i].name,
                                sort:msg[i].sort,
                                status:msg[i].status,
                                type:msg[i].type,
                                daGou:false

                            }
                            for(let j =0;j<l;j++){
                                if(msg[i].id == this.illnessList[j].illnessId){
                                    msg[i].daGou = true;
                                }
                            }
                        }
                        this.search = true;
                        this.searchIllnessList = msg;
                        console.log(this.searchIllnessList)

                    }else {
                        Toast('请换个关键字再试');
                    }
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        // 搜索列表选中疾病
        selectedIllness1(index){
            if(!this.searchIllnessList[index].daGou){  // 选中

                if(this.number<6){
                    this.searchIllnessList[index].daGou = !this.searchIllnessList[index].daGou;
                    this.number += 1;
                    this.illnessList.push({
                        illnessId:this.searchIllnessList[index].id,
                        illnessName:this.searchIllnessList[index].name,
                        illnessTypeId:this.searchIllnessList[index].type,
                        illnessTypeName:""
                    })
                    this.show = true;
                    this.saveIllness.push({
                        illnessId:this.searchIllnessList[index].id,
                        illnessName:this.searchIllnessList[index].name,
                        illnessTypeId:this.searchIllnessList[index].type,
                        illnessTypeName:""
                    })
                    console.log(this.illnessList)
                }else {
                    Toast('最多只能选6个');
                }
            }else {
                this.searchIllnessList[index].daGou = !this.searchIllnessList[index].daGou;
                var length = this.illnessList.length;
                for(let i=0;i<length;i++){
                    if(this.illnessList[i].illnessId == this.searchIllnessList[index].id){
                        this.illnessList.splice(i,1);
                        this.number -= 1;
                        if(this.number<=0){
                            this.show = false;
                        }
                    }
                    if(this.saveIllness[i].illnessId == this.searchIllnessList[index].id){
                        this.saveIllness.splice(i,1)
                    }
                }
                // console.log(this.illnessList)
            }


            // var e = event.target;
            // var span = e.getElementsByTagName("span")[0] || e.parentNode.getElementsByTagName("span")[0];
            // var img = e.getElementsByTagName("img")[0] || e.parentNode.getElementsByTagName("img")[0];

            // if(img.className == "groupcell") {
            //     if(this.number<6){
            //         this.number += 1;
            //         img.className = "selectcell";
            //         this.illnessList.push({
            //             'name':span.innerText,
            //             'index':index
            //         })
            //         this.show = true;
            //         this.saveIllness.push({
            //             illnessId:this.searchIllnessList[index].id,
            //             illnessName:this.searchIllnessList[index].name,
            //             illnessTypeId:this.searchIllnessList[index].type,
            //             illnessTypeName:""
            //         })
            //     }else {
            //         Toast('最多只能选6个');
            //     }

            // } else if(img.className == "selectcell") {
            //     var length = this.illnessList.length;
            //     console.log(length)
            //     for(let i=0;i<length;i++){
            //         if(this.illnessList[i].name == span.innerText){
            //             this.illnessList.splice(i,1);
            //             img.className = "groupcell";
            //             this.number -= 1;
            //             if(this.number<=0){
            //                 this.show = false;
            //             }
            //         }
            //         if(this.saveIllness[i].illnessName == span.innerText){
            //             this.saveIllness.splice(i,1)
            //             console.log(this.saveIllness)
            //         }
            //     }
            // }
        },
        // 取消搜索
        cancel(){
            this.search = false;
            this.value = "";
        },
        // 删除已选疾病
        deleteIllness(event,id){
            console.log(event.target)
            console.log(id)
        },
        // 保存疾病
        submit(){
            var data = JSON.parse(localStorage.getItem('userInfo'));
            var token = data.token;
            var userId = data.userId;
            var data1 ={
                'userId':userId,
                'haveIllness':this.saveIllness
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
                var _this = this;
                setTimeout(function(){
                    _this.$router.replace({ path: '/myInfo'})
                },2000);
            })
        }
    },
    mounted(){
        document.title = this.$route.meta.title;
        this.getIllnessAll();
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
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
.selected {
    box-sizing: border-box;
    padding: 0px 4vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 10vw;
    background: #FFFFFF;
    margin-bottom: 1px;
}
.illness {
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 2vw;
    padding-bottom: 0px;
    overflow: hidden;
}
.illness>span {
    display: inline-block;
    margin-right: 2vw;
    margin-bottom: 2vw;
    padding: 1vw;
    position: relative;
    background: #A9E3FD;
    float: left;
}
.illness>span>img {
    position: absolute;
    bottom: 0px;
    right: 0px;
    height: 3vw;
    width: 6vw;
}
.search {
    height: 10vw;
    width: 100%;
    position: relative;
    background: #FFFFFF;
    margin: 5px 0px;
    position: relative;
}
.search>img {
    height: 4vw;
    width: 4vw;
    position: absolute;
    left: 2vw;
    top:3vw;
}
.search > input {
    height: 10vw;
    width: 100%;
    box-sizing: border-box;
    padding-left: 8vw;
    outline: none;
    border: none;
}
.search>.position {
    position: absolute;
    right: 0px;
    bottom: 0px;
    height: 10vw;
    line-height: 10vw;
    font-size: 12px;
    box-sizing: border-box;
    padding-right: 2vw;
}
.illness-list {
    flex: 1;
    overflow: hidden;
    overflow-y: scroll;
}
.illness-list .list-box {

}
.illness-list .top {
    height: 12vw;
    background: #EFEFF4;
    text-align: left;
    box-sizing: border-box;
    padding: 0px 2vw;
    display: flex;
    align-items: center;
}
.illness-list .main-box {
    height: 15vw;
    background: #FFFFFF;
    margin-bottom: 1px;
    text-align: left;
    box-sizing: border-box;
    padding: 0px 2vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.illness-list .main-box img {
    height: 4vw;
    width: 4vw;
    margin-right: 5vw;
}
.btn-box {
    height: 15vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
}
.btn-box > button {
    width: 85%;
}


.groupcell {
    display: none;
}
.selectcell {
    display: block;
}
</style>
