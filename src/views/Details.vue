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
    <mu-dialog width="320" max-width="80%" title="SIM盾认证" :overlay-close="false" :esc-press-close="false" :open.sync="openSimAuth">
      <mu-text-field v-model="formData.password" placeholder="Password" label="请输入SIM卡密码" full-width :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"></mu-text-field>
      <div style="text-align:center;">
        <mu-button class="details-btn" flat color="error" @click="handleCancel()">取消</mu-button>
        <mu-button class="details-btn" flat color="primary" @click="handleSubmit()">确定</mu-button>
      </div>
    </mu-dialog>
    <div class="details-bottom fix-bottom" v-if="mode !== 'view'">
      <mu-button class="details-btn" color="error" v-if="mode === 'approval'" @click="handleApproval(false)">不同意</mu-button>
      <mu-button class="details-btn" color="primary" v-if="mode === 'approval'" @click="handleApproval(true)">同意</mu-button>
      <mu-button class="details-btn" color="primary" v-if="mode === 'create'" @click="handleSubmit()">提交</mu-button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import dataServices from "../services/dataServices";
import FormList from "../components/FormList";

export default {
  data() {
    return {
      title: "审批流程",
      openSubmitInfo: false,
      msg: "提交成功",
      msgColor: "success",
      msgIcon: "check_circle",
      openSimAuth: false,
      visibility: false,
      mode: "create",
      formFields: [
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
          type: "datetime",
          readonly: false,
          hidden: false,
          meta: {
            valueFormat: "YYYY-MM-DD"
          }
        },
        {
          prop: "department",
          label: "申请部门",
          type: "singleText",
          readonly: true,
          hidden: false
        },
        {
          prop: "job",
          label: "岗位",
          type: "singleText",
          readonly: true,
          hidden: false
        },
        {
          prop: "applitem",
          label: "审批事项",
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
              name: "approver"
            }
          }
        }
      ],
      formData: {
        applicant: "",
        applidate: "",
        department: "",
        job: "",
        applitem: "",
        approver: "",
        password: ""
      }
    };
  },
  methods: {
    getCheckById(id) {
      dataServices.checkbyid(id).then(response => {
        let data = response.data;
        let info;
        if (data.applicant) {
          info = data;
        } else {
          info = data.data;
        }
        this.mode = "approval";
        this.title = "审批流程";
        this.formData.applicant = info.applicant;
        this.formData.applidate = info.appliDate;
        this.formData.department = info.department;
        this.formData.job = info.job;
        this.formData.applitem = info.appliItem;
        delete this.formData.approver;
        this.formFields.forEach(item => {
          item.readonly = true;
          if (item.prop === "approver") {
            item.hidden = true;
          }
        });
      });
    },
    handleApproval(isPass) {
      // TODO: 审批
      if (isPass) {
        this.openSimAuth = true;
      } else {
      }
    },
    handleSubmit() {
      // TODO: 提交
      this.openSimAuth = false;
      this.visibility = false;
      dataServices.formsub(this.formData).then(response => {
        if (response.data === "success") {
          this.msg = "提交成功";
          this.msgColor = "success";
          this.msgIcon = "check_circle";
          this.openSubmitInfo = true;
          setTimeout(() => {
            this.openSubmitInfo = false;
            this.$router.go(-1);
          }, 2000);
        } else {
          this.msg = "提交失败";
          this.msgColor = "error";
          this.msgIcon = "error";
          this.openSubmitInfo = true;
          setTimeout(() => {
            this.openSubmitInfo = false;
          }, 2000);
        }
      });
    },
    handleCancel() {
      this.openSimAuth = false;
      this.visibility = false;
      this.formData.password = "";
    }
  },
  components: {
    FormList
  },
  created() {
    let info = window.$eventBus.loginUserInfo;
    if (this.$route.name === "create") {
      this.mode = "create"; // 新建表单
      this.title = "创建流程";
      this.formData.applidate = moment().format("YYYY-MM-DD HH:mm:ss");
      this.formData.applicant = info.name;
      this.formData.department = info.department;
      this.formData.job = info.position;
      this.formFields.forEach(item => {
        if (item.prop === "approver") {
          item.readonly = false;
          item.hidden = false;
          item.meta.funcParams.enterpriseId = info.enterpriseId;
        }
      });
    } else if (this.$route.name === "details") {
      this.getCheckById(this.$route.params.id);
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
.details-msg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>
