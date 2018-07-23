import $http from 'axios'
import doSign from './md5.js'
import { Toast } from 'mint-ui';
import { config } from './code.js'

// 需要token
export function newPost1(option){
    var { url,data,token,userId,server } = option;
    var signObjStr= doSign.doSign();
    // url = axios.defaults.baseURL+url+"?"+signObjStr+"&server="+option.server;
    url = url+"?"+signObjStr+"&server="+option.server;
    return new Promise((resolve,reject) => {
        $http({
            method: 'POST',
            data:{
                'parameter':JSON.stringify(data)
            },
            url:url,
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
                'ip':'0.0.0.0',
                'mac':'mac_web',
                'client-type':'type_user',
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
                if(res.data.code == '1011'){
                    localStorage.clear();
                    // sessionStorage.clear();
                }
                resolve(res);
            } else {
                resolve(res);
            }
        }).catch(err => {
            console.log(err)
            Toast({
                    message: "接口异常请稍后再试！",
                    duration: 2000
                });
            // reject(err);
        })
    })
    
}

// 不需要token
export function newPost2(option){
    var { url,data,server } = option;
    var signObjStr= doSign.doSign();
    // url = axios.defaults.baseURL+url+"?"+signObjStr+"&server="+option.server;
    url = url+"?"+signObjStr+"&server="+option.server;
    return new Promise((resolve,reject) => {
        $http({
            method: 'POST',
            data:{
                'parameter':JSON.stringify(data)
            },
            url:url,
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
                'ip':'0.0.0.0',
                'mac':'mac_web',
                'client-type':'type_user',
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
                if(res.data.code != '1001' && !res.data.success){
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
                    if(res.data.code == '1011'){
                        localStorage.clear();
                        // sessionStorage.clear();
                    }
                    resolve(res);
                } else {
                    resolve(res);
                }
            
        }).catch(err => {
            console.log(err)
            Toast({
                message: "接口异常请稍后再试！",
                duration: 2000
            });
            // reject(err);
        })
    })
}