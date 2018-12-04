<template>
  <div class="main" @loading="!loading">
    <div class="button_content">
      <button @click="show_add_item" class="button_add">添加商品</button>
      <input type="file" id="file" size=30 @change="submit_file($event)">
      <button class="button_all" @click="SelectFile">批量添加</button>
      <button @click="show_time" class="button_time">爬取周期设置</button>
      <button @click="show_info" class="button_info">通知设置</button> 
    </div>
    <div id="tips">
      Tips:批量添加的商品需要等待下一次爬虫更新才会有对应的商品信息
    </div>
    <div class="item_show">
      <table border="1">
        <thead>
            <th class="ablid">ablid</th>
            <th class="mainname">mainname</th>
            <th class="price">price</th>
            <th class="stock">stock</th>
            <th class="num">num</th>
            <th class="update_time">更新时间</th>
            <th id="history">history</th>
            <th id="delete"></th>
        </thead>
        <tbody>
            <tr v-for="(item, index) in data" :key="index" class="info_detail">
                <th>{{item.Abiid}}</th>
                <th>{{item.MainName}}</th>
                <th>{{item.Price}}</th>
                <th>{{item.Stock}}</th>
                <th>{{item.IntStock}}</th>
                <th>{{new Date(item.LastUpdateTime*1000).toLocaleString()}}</th>
                <th class="item_history" @click=get_history(item.Abiid,item.MainName)>
                  历史库存
                </th>
                <th class="delete" @click="delete_item(index,item.Abiid)">删除</th>
            </tr>
        </tbody>
      </table>
    </div>
    <div class="add_item" v-show="add_item">
      <h2>添加商品</h2>
      <div class="mgt15">
        <span>商品id：</span><input type="number" v-model="item_form.abiid" autofocus>
      </div>
      <div class="item_button">
        <button class="sure_button" @click="submit_item">确定</button> 
        <button class="cancle_button" @click="add_item=false">取消</button>
      </div>
    </div>
    <div class="time" v-show="time">
      <h2 class="mgb5">爬取周期设置</h2>
      <div class="mgt15 mgb5"><span>小时：</span><input type="number" min="0" max="23" v-model="time_form.intervalHour"></div>
      <div class="mgb5"><span>分钟：</span><input type="number" min="2" max="59" v-model="time_form.intervalMinute"></div>
      <div class="mgt15">
        <button class="sure_button" @click="submit_time">确定</button>
        <button class="cancle_button" @click="time=false">取消</button>
      </div>
    </div>
    <div class="info" v-show="info">
      <h2 class="mgb5">通知设置</h2>
      <div class="mgb5"><span>发送通知邮箱：</span> <input type="email" v-model="email_form.sender"></div>
      <div class="mgb5"><span class="mgr60">授权码：</span> <input type="text" v-model="email_form.senderPwd"></div>
      <div class="mgb5"><span>接受通知邮箱：</span> <input type="email" v-model="email_form.receiver"></div>
      <div class="info_button mgt15">
        <button class="sure_button" @click="submit_email">确定</button>
        <button class="cancle_button" @click="info=false">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading:false,
        ip:'http://127.0.0.1:8080',
        add_item: false,
        time: false,
        info: false,
        hour:null,
        minute:null,
        receiver:null,
        sender:null,
        sender_pwd:null,
        data:null,
        delete_form:{
          "abiid":null
        },
        item_form:{
          "abiid":null
        },
        time_form:{
          "intervalHour":0,
          "intervalMinute":0
        },
        email_form:{
          "sender":null,
          "senderPwd":null,
          "receiver":null
        },
        file_form:{
          "file":null
        }
      };
    },
    methods: {
      show_add_item() {
        this.add_item = true;
        this.time = false;
        this.info =false;
      },
      SelectFile () {
        let file = document.getElementById('file');
        file.click();
      },
      show_time(){
        this.add_item = false;
        this.time = true;
        this.info =false;
        this.$http.get(this.ip+'/api/time_interval').then(
          (res)=>{
            console.log(res)
            this.time_form.intervalHour = res.data.data.hour;
            this.time_form.intervalMinute = res.data.data.minute;
        })
        console.log(this.time_form)
      },
      show_info(){
        this.add_item = false;
        this.time = false;
        this.info =true;
        this.$http.get(this.ip+'/api/email').then(
          (res)=>{
            console.log(res)
            this.email_form.receiver = res.data.data.receiver;
            this.email_form.sender = res.data.data.sender;
            this.email_form.senderPwd = res.data.data.sender_pwd;
        })
        console.log(this.email_form)
      },
      get_history(abiid, mainname){
        this.$router.push({
          path:'/historyStock/' + abiid,
          query:{
            "MainName":mainname
          }
        })
      },
      submit_file (e){
        let formData = new FormData();
        formData.append('file',e.target.files[0])
        this.$http.post(this.ip + '/api/good/upload',formData).then(
          (res)=>{
            alert(res.data.message);
            this.$router.go(0)
          }
        )
      },
      submit_item(){
        this.$http.post(this.ip+'/api/good', this.item_form).then(
          (res) => {
            this.add_item = false;
            this.item_form.abiid = null;
            alert(res.data.message);
            this.$router.go(0);
          }
        )
        
      },
      submit_time(){
        this.$http.post(this.ip+'/api/time_interval',{"intervalHour":Number(this.time_form.intervalHour),"intervalMinute":Number(this.time_form.intervalMinute)}).then(
        (res)=>{
          this.time = false;
          alert(res.data.message)
        })
      },
      submit_email(){
        this.$http.post(this.ip+'/api/email',this.email_form).then((res)=>{
          this.info = false;
          alert(res.data.message)
        })
      },
      delete_item(index,abiid){
        this.delete_form.abiid = abiid;
        this.$http({
          method: 'delete',
          url: this.ip + '/api/good',
          data:this.delete_form
        }).then(
          (res) => {
            alert(res.data.message);
            if(res.data.code==0){
              this.data.splice(index,1)
            }
          }
        )
      }
    },
    created () {
      this.$http.get(this.ip+'/api/good').then((res)=>{
        this.data  = res.data.data;
      })
    }
  };
</script>

<style scoped>
  .main{
    position: absolute;
    width: 100%;
    top: 35px;
    bottom:0; 
  }

  .button_content {
    width: 100%;
    height: 50px;
    text-align: center;
    margin: 32px 0 22px 0;
  }
  .button_content button {
    position: relative;
    height: 43px;
    text-align: center;
    font-size: 18px;
    padding: 0 20px;
    line-height: 30px;
    margin-right: 30px;
    border-radius: 3px;
  }
  .button_content button::before{
    content: '添加商品';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 43px;
    line-height: 43px;
    overflow: hidden;
    z-index: 1;
    opacity: 0;
    background: rgba(224, 226, 91, 0.904);
    transition:all 0.2s ease-out;
  }
  .button_content .button_all::before{
    content: '批量添加';
  }
  .button_content .button_time::before{
    content: '爬取周期设置';
  }
  .button_content .button_info::before{
    content: '通知设置';
  }
  .button_content .button_add{
    background: #f36c7e
  }
  .button_content input{
    display: none;
  }
  .button_content .button_all{
    background: #ff4ec5
  }
  .button_content .button_time{
    background: #0bb8fc
  }
  .button_content .button_info{
    background: #01eabd
  }
  .button_content button:hover::before{
    width: 100%;
    opacity: 1;
    border-radius: 3px;
  }

  #tips{
    color: red;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin-bottom: 15px;
  }

  #history{
    cursor: pointer;
  }
  .item_show{
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
  th{
    font-size: 18px;
    padding: 6px;
    border-bottom: 1px solid black;
  }
  tbody tr:nth-child(odd){
    background: rgba(144,144,144,0.15);
  }
  tbody tr:hover{
    background: #FC9D99;
  }
  .sure_button{
    height: 30px;
    background: #0080ff;
    font-size: 18px;
    padding: 0 10px;
    outline: none;
    margin-right: 15px;
    border: none;
    cursor: pointer;
    border-radius: 2px;
  }
  .cancle_button{
    height: 30px;
    background: red;
    font-size: 18px;
    padding: 0 10px;
    outline: none;
    border: none;
    cursor: pointer;
    border-radius: 2px;
  }
  span{
    font-size: 20px;
  }

  input{
    width: 200px;
    height: 15px;
    font-size: 17px;
    padding: 5px;
  }
  .add_item,.time,.info{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%,-50%,0);
    width: 400px;
    height: 150px;
    padding: 30px;
    text-align: center;
    box-shadow: 10px 10px 30px 15px gray,
                -0.5px -0.5px 1px grey;
    z-index: 1;
    background: floralwhite;
    transition: all 2s ease;
  }
  .item_button{
    margin-top: 25px;
  }
  .mgb5{
    margin-bottom:5px; 
  }
  .mgb15{
    margin-top: 15px;
  }
  .mgt15{
    margin-top: 15px;
  }
  .mgr60{
    margin-right: 60px;
  }
  .info{
    height: 185px;
  }
  .item_history{
    cursor: pointer;
    color: cornflowerblue;
  }
  .delete{
    cursor: pointer;
    color: #f77081;
  }
</style>
