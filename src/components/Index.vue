<template>
    <div class="box">  
        
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
          console.log("进来了")
          this.$router.push({
              path: '/mycollect', 
              name: 'MyCollect'
          })
        },
        components:{
            
        }
    }
</script>

<style scoped>
.box {
    height: 100%;
    width: 100%;
    background: #EFEFF4 !important;
}
</style>
