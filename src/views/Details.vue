<template>
  <div>
    <div class="details-title fix-top">{{title}}</div>
    <div class="details-content">
      <FormList :fields-def="formFields" :form-data="formData" label-position="left"></FormList>
    </div>
    <mu-dialog transition="slide-bottom" fullscreen :open="openSubmitInfo" :overlay="false">
      <div class="details-msg">
        <div>
          <mu-icon :color="msgColor" :size="48" :value="msgIcon"></mu-icon>
        </div>
        <div :style="{color: msgColor === 'success' ? '#4caf50': '#f44336'}">{{msg}}</div>
      </div>
    </mu-dialog>
    <!--<mu-dialog width="320" max-width="80%" title="SIM盾认证" :overlay-close="false" :esc-press-close="false" :open.sync="openSimAuth">
      <mu-text-field v-model="password" placeholder="Password" label="请输入SIM卡密码" full-width :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"></mu-text-field>
      <div style="text-align:center;">
        <mu-button class="details-btn" flat color="error" @click="handleCancel()">取消</mu-button>
        <mu-button class="details-btn" flat color="primary" @click="handleOk()">确定</mu-button>
      </div>
    </mu-dialog>-->
    <div class="details-bottom fix-bottom" v-if="mode !== 'view'">
      <mu-text-field class="details-bottom-input" v-if="mode === 'approval'" v-model="comment" placeholder="审批意见"></mu-text-field>
      <mu-button class="details-btn" color="primary" v-if="mode === 'approval'" @click="handleApproval()">审批</mu-button>
      <mu-button class="details-btn" color="primary" v-if="mode === 'create'" @click="handleSubmit()">提交</mu-button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import dataServices from "../services/dataServices";
import clientServices from "../services/clientServices";
import FormList from "../components/FormList";

let reqServices = dataServices;

export default {
  data() {
    return {
      isSDK: false,
      title: "审批流程",
      openSubmitInfo: false,
      msg: "提交成功",
      msgColor: "success",
      msgIcon: "check_circle",
      //openSimAuth: false,
      //visibility: false,
      //password: "",
      mode: "create",
      comment: "",
      formFields: [
        {
          prop: "appliTitle",
          label: "申请标题",
          type: "singleText",
          readonly: false,
          hidden: false
        },
        {
          prop: "applicant",
          label: "申请人",
          type: "singleText",
          readonly: true,
          hidden: false
        },
        {
          prop: "applidate",
          label: "申请日期",
          type: "dateTime",
          readonly: false,
          hidden: false,
          meta: {
            valueFormat: "YYYY-MM-DD HH:mm:ss"
          }
        },
        {
          prop: "department",
          label: "申请人部门",
          type: "singleText",
          readonly: true,
          hidden: false
        },
        {
          prop: "job",
          label: "申请人岗位",
          type: "singleText",
          readonly: false,
          hidden: false
        },
        {
          prop: "applitem",
          label: "申请内容",
          type: "multiText",
          readonly: false,
          hidden: false,
          meta: {
            rows: 3,
            rowsMax: 6
          }
        },
        {
          prop: "approver",
          label: "审批人员",
          type: "user",
          readonly: false,
          hidden: false,
          meta: {
            funcParams: {
              enterpriseId: ""
            },
            keyValue: {
              name: "approver",
              phone: "approverTell"
            }
          }
        }
      ],
      formData: {
        appliTell: "",
        applicant: "",
        applidate: "",
        appliTitle: "",
        department: "",
        job: "",
        applitem: "",
        approverTell: "",
        approver: ""
      }
    };
  },
  methods: {
    getCheckById(id, tel) {
      reqServices.checkbyid(id, tel).then(response => {
        let data = response.data;
        let info;
        if (data.code !== "1") {
          this.mode = "approval";
          this.title = "审批流程";
          this.$toast.error(data.msg);
          return;
        } else {
          info = data.data;
        }
        if (info.status === "waiting") {
          this.mode = "approval";
          this.title = "审批流程";
        } else {
          this.mode = "view";
          this.title = "查看流程";
        }
        this.formData.applicant = info.applicant;
        this.formData.appliTell = info.appliTell;
        this.formData.applidate = info.applidate;
        this.formData.department = info.department;
        this.formData.job = info.job;
        this.formData.applitem = info.applitem;
        this.formData.approver = info.approver;
        this.formData.approverTell = info.approverTell;
        this.formFields.forEach(item => {
          item.readonly = true;
          if (item.prop === "approver") {
            item.hidden = true;
          }
        });
      });
    },
    handleApproval() {
      // TODO: 修改审批流程
      if (this.isSDK) {
        clientServices.doSignature(this.formData, json => {
          if (json.code === "1") {
            this.sendApproval();
          } else {
            this.$toast.error(json.msg);
          }
        });
      } else {
        reqServices.checkforca().then(res => {
          let status = res.data;
          if (typeof status === "object") {
            status = status.data;
          }
          if (status === "success") {
            this.sendApproval();
          } else {
            reqServices.applica().then(applicaRes => {
              let status2 = applicaRes.data;
              if (typeof status2 === "object") {
                status2 = status2.data;
              }
              if (status2 === "success") {
                reqServices.sign().then(() => {
                  this.sendApproval();
                });
              }
            });
          }
        });
      }
    },
    sendApproval() {
      let id = this.$route.params.id,
        comment = this.comment;
      reqServices.approvebyid(id, comment).then(res => {
        let data = res.data;
        this.$toast.success(data.msg);
        if (data.code === "1") {
          this.$router.go(-1);
        }
      });
    },
    handleSubmit() {
      //this.openSimAuth = false;
      //this.visibility = false;
      reqServices.formsub(this.formData).then(response => {
        let data = response.data;
        this.msg = data.msg;
        if (data.code === "1") {
          this.msgColor = "success";
          this.msgIcon = "check_circle";
          this.openSubmitInfo = true;
          setTimeout(() => {
            this.openSubmitInfo = false;
            this.$router.go(-1);
          }, 2000);
        } else {
          this.msgColor = "error";
          this.msgIcon = "error";
          this.openSubmitInfo = true;
          setTimeout(() => {
            this.openSubmitInfo = false;
          }, 2000);
        }
      });
    }/*,
    handleCancel() {
      this.openSimAuth = false;
      this.visibility = false;
      this.password = "";
    },
    handleOk() {
      // TODO: 确定sim卡密码
      this.visibility = false;
    }
    */
  },
  components: {
    FormList
  },
  created() {
    let info = window.$eventBus.loginUserInfo;
    if (this.$route.name.indexOf("sdk-") === 0){
      this.isSDK = true;
      // reqServices = sdkDataServices;
    } else {
      this.isSDK = false;
      reqServices = dataServices;
    }
    if (this.$route.name === "create" || this.$route.name === "sdk-create") {
      this.mode = "create"; // 新建表单
      this.title = "创建流程";
      this.formData.applidate = moment().format("YYYY-MM-DD HH:mm:ss");
      this.formData.applicant = info.name;
      this.formData.appliTell = info.phone;
      this.formData.department = info.department;
      this.formData.job = info.position;
      this.formFields.forEach(item => {
        if (item.prop === "approver") {
          item.readonly = false;
          item.hidden = false;
          item.meta.funcParams.enterpriseId = info.enterpriseId;
        }
      });
    } else if (this.$route.name === "details" ||this.$route.name === "sdk-details") {
      this.getCheckById(this.$route.params.id, info.phone);
    }
  }
};
</script>

<style lang="scss">
.details-title {
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 26px;
  color: #333333;
  background: #fafafa;
}
.details-bottom {
  text-align: center;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #f5f5f5;
  background: #fafafa;
}
.details-content {
  margin-top: 48px;
  margin-bottom: 60px;
  overflow: auto;
}
.details-btn {
  margin-left: 12px;
}
.details-btn:first-child {
  margin-left: 0;
}
.details-bottom-input {
  width: calc(100% - 120px);
}
.details-msg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>
