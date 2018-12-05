<template>
  <div class="main" @loading="!loading">
    <div class="button_content">
      <el-button type="primary" @click="add_item=true" plain>添加商品</el-button>
      <el-button type="success" @click="SelectFile" plain>批量添加</el-button>
      <input type="file" id="file" size="30" @change="submit_file($event)" />
      <el-button type="warning" @click="show_time" plain>爬取周期设置</el-button>
      <el-button type="danger" @click="show_info" plain>通知设置</el-button>
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
            <th>{{ item.Abiid }}</th>
            <th>{{ item.MainName }}</th>
            <th>{{ item.Price }}</th>
            <th>{{ item.Stock }}</th>
            <th>{{ item.IntStock }}</th>
            <th>{{new Date(item.LastUpdateTime*1250).toLocaleString()}}</th>
            <th
              class="item_history"
              @click="get_history(item.Abiid,item.MainName)"
            >
              历史库存
            </th>
            <th class="delete" @click="delete_item(index,item.Abiid)">删除</th>
          </tr>
        </tbody>
      </table>
    </div>
    <el-dialog title="添加商品" :visible.sync="add_item" width="32%" center>
      <el-form label-width="120px">
        <el-form-item label="商品ID：">
          <el-input v-model="item_form.abiid"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="add_item = false">取 消</el-button>
        <el-button type="primary" @click="submit_item">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="爬取周期设置" :visible.sync="time" width="30%" center>
      <el-form label-position="center" :model="time_form" label-width="135px">
        <el-form-item label="小时：">
          <el-input-number
            v-model="time_form.intervalHour"
            :min="0"
            :max="23"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="分钟：">
          <el-input-number
            v-model="time_form.intervalMinute"
            :min="2"
            :max="59"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="time=false">取 消</el-button>
        <el-button type="primary" @click="submit_time">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="通知设置" :visible.sync="info" width="40%" center>
      <el-form label-position="left" :model="email_form" label-width="120px">
        <el-form-item label="发送通知邮箱：">
          <el-input v-model="email_form.sender"></el-input>
        </el-form-item>
        <el-form-item label="授权码：">
          <el-input v-model="email_form.senderPwd"></el-input>
        </el-form-item>
        <el-form-item label="接受通知邮箱：">
          <el-input v-model="email_form.receiver"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="info = false">取 消</el-button>
        <el-button type="primary" @click="submit_email">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        ip: "http://127.0.0.1:8080",
        add_item: false,
        time: false,
        info: false,
        hour: null,
        minute: null,
        receiver: null,
        sender: null,
        sender_pwd: null,
        data: null,
        delete_form: {
          abiid: null
        },
        item_form: {
          abiid: null
        },
        time_form: {
          intervalHour: 0,
          intervalMinute: 0
        },
        email_form: {
          sender: null,
          senderPwd: null,
          receiver: null
        },
        file_form: {
          file: null
        }
      };
    },
    methods: {
      SelectFile() {
        let file = document.getElementById("file");
        file.click();
      },
      show_time() {
        this.add_item = false;
        this.time = true;
        this.info = false;
        this.$http.get(this.ip + "/api/time_interval").then(res => {
          this.time_form.intervalHour = res.data.data.hour;
          this.time_form.intervalMinute = res.data.data.minute;
        });
      },
      show_info() {
        this.add_item = false;
        this.time = false;
        this.info = true;
        this.$http.get(this.ip + "/api/email").then(res => {
          this.email_form.receiver = res.data.data.receiver;
          this.email_form.sender = res.data.data.sender;
          this.email_form.senderPwd = res.data.data.sender_pwd;
        });
      },
      get_history(abiid, mainname) {
        this.$router.push({
          path: "/historyStock/" + abiid,
          query: {
            MainName: mainname
          }
        });
      },
      submit_file(e) {
        let formData = new FormData();
        let self = this
        formData.append("file", e.target.files[0]);
        this.$http.post(this.ip + "/api/good/upload", formData).then(res => {
          if (res.data.code == 0) {
              this.$message({
                message: res.data.message,
                type: "success",
                showClose: true,
                duration: 1250,
                onClose(){
                  self.$router.go(0);
                }
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                showClose: true,
                duration: 1250,
              });
            }
        });
      },
      submit_item() {
        this.add_item = false;
        let self = this;
        this.$http.post(this.ip + "/api/good", this.item_form).then(res => {
          if (res.data.code == 0) {
              this.$message({
                message: res.data.message,
                type: "success",
                showClose: true,
                duration: 1250,
                onClose(){
                  self.$router.go(0);
                }
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                showClose: true,
                duration: 1250,
                onClose(){
                  self.item_form.abiid=null;
                }
              });
              
            }
        });
      },
      submit_time() {
        this.time = false;
        this.$http
          .post(this.ip + "/api/time_interval", {
            intervalHour: Number(this.time_form.intervalHour),
            intervalMinute: Number(this.time_form.intervalMinute)
          })
          .then(res => {
            if (res.data.code == 0) {
              this.$message({
                message: res.data.message,
                type: "success",
                showClose: true,
                duration: 1250
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                showClose: true,
                duration: 1250
              });
            }
          });
      },
      submit_email() {
        this.info = false;
        this.$http.post(this.ip + "/api/email", this.email_form).then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: res.data.message,
              type: "success",
              showClose: true,
              duration: 1250
            });
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
              showClose: true,
              duration: 1250
            });
          }
        });
      },
      delete_item(index, abiid) {
        this.delete_form.abiid = abiid;
        this.$http({
          method: "delete",
          url: this.ip + "/api/good",
          data: this.delete_form
        }).then(res => {
          if (res.data.code == 0) {
              this.data.splice(index, 1);
              this.$message({
                message: res.data.message,
                type: "success",
                showClose: true,
                duration: 1250
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error",
                showClose: true,
                duration: 1250
              });
            }
        });
      }
    },
    created() {
      this.$http.get(this.ip + "/api/good").then(res => {
        this.data = res.data.data;
      });
    }
  };
</script>

<style scoped>
  .main {
    position: absolute;
    width: 100%;
    top: 35px;
    bottom: 0;
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
    border-radius: 4px;
    font-weight: 500;
  }
  .button_content input {
    display: none;
  }

  #tips {
    color: red;
    font-weight: bold;
    font-size: 20px;
    text-align: center;
    margin-bottom: 15px;
  }

  #history {
    cursor: pointer;
  }
  .item_show {
    width: 75%;
    max-height: 550px;
    margin: 0 auto;
    overflow-y: scroll;
  }
  table {
    width: 100%;
    margin: 0 auto;
    border-collapse: collapse;
  }
  thead {
    background: #c8e4e4;
  }
  th {
    font-size: 18px;
    padding: 6px;
    border-bottom: 1px solid black;
  }
  tbody tr:nth-child(odd) {
    background: rgba(144, 144, 144, 0.15);
  }
  tbody tr:hover {
    background: #fc9d99;
  }
  .item_history {
    cursor: pointer;
    color: cornflowerblue;
  }
  .delete {
    cursor: pointer;
    color: #f77081;
  }
</style>
