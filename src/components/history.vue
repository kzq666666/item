<template>
    <div class="history">
        <div @click="back" id="back">
            <img src="../assets/back.png" alt="">
            <span>返回</span>
        </div>
        <div class="table_show">
            <table border="1">
                <thead>
                    <tr class="tab_title">
                        <th>ablid</th>
                        <th>mainname</th>
                        <th>num</th>
                        <th>更新时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in data" :key="index">
                        <th>{{item.Abiid}}</th>
                        <th>{{MainName}}</th>
                        <th>{{item.StockNum}}</th>
                        <th>{{new Date(item.UpdateTime*1000).toLocaleString()}}</th>
                    </tr>
                </tbody>
            </table>
        </div>
      
    </div>
</template>

<script>
    export default{
        data () {
            return {
                data:null,
                MainName:null
            }
        },
        methods:{
            back(){
                this.$router.push('/');
            }
        },
        created() {
            console.log("http://127.0.0.1:8080/api/history/"+this.$route.params.abiid)
            this.$http.get("http://127.0.0.1:8080/api/history/"+this.$route.params.abiid).then(
                (res) =>{
                    this.MainName = this.$route.query.MainName;
                    this.data = res.data.data;
                    // console.log(this.data)
                }
            )
        },
    }
</script>

<style scoped>
    #back{
        margin:25px 0 55px 100px;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
    }
    img{
        width: 30px;
        vertical-align: middle;
        margin: 0 2px 5px;
    }
    span{
        line-height: 30px;
        font-size: 18px;
    }
    .table_show{
        width: 75%;
        max-height: 600px;
        margin: 0 auto;
        overflow-y: scroll;
    }
    table {
        width: 100%;
        margin: 0 auto;
        border-collapse:collapse;
    }
    thead{
        background: #c8e4e4;
    }                   
    tbody tr:nth-child(odd){
        background: rgba(144,144,144,0.15);
    }
    tbody tr:hover{
        background: #FC9D99;
    }
    .tab_title{
        background: #c8e4e4;
    }
    th{
        font-size: 18px;
        padding: 6px;
        border-bottom: 1px solid black;
    }
</style>