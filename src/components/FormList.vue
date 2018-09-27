<template>
  <div class="">
    <mu-form :label-width="labelWidth" :label-position="labelPosition" :model="formData">
      <mu-form-item v-for="field in fieldsDef" :key="field.prop" v-if="!field.hidden" :prop="field.prop" :label="field.label" :icon="field.icon" :label-position="field.labelPosition || labelPosition" :help-text="field.helpText" :rules="field.rules">
        <template v-if="field.readonly">
          <div class="mu-text-field">{{formData[field.prop]}}</div>
        </template>
        <template v-else>
          <mu-text-field v-if="field.type === 'singleText'" v-model="formData[field.prop]"></mu-text-field>
          <mu-text-field v-if="field.type === 'multiText'" multi-line :rows="(field.meta && field.meta.rows) || 3" :rows-max="(field.meta && field.meta.rowsMax) || 6" v-model="formData[field.prop]"></mu-text-field>
          <mu-date-input v-if="field.type === 'date'" type="date" container="bottomSheet" v-model="formData[field.prop]" :value-format="(field.meta && field.meta.valueFormat) || 'YYYY-MM-DD'" no-display></mu-date-input>
          <mu-date-input v-if="field.type === 'time'" type="time" container="bottomSheet" v-model="formData[field.prop]" :value-format="(field.meta && field.meta.valueFormat) || 'HH:mm:ss'" no-display></mu-date-input>
          <mu-date-input v-if="field.type === 'dateTime'" type="dateTime" container="bottomSheet" v-model="formData[field.prop]" :value-format="(field.meta && field.meta.valueFormat) || 'YYYY-MM-DD HH:mm:ss'" no-display></mu-date-input>
          <mu-text-field v-if="field.type === 'user'" :ref="`user_${field.prop}`" v-model="formData[field.prop]" readonly @click="selectUser(field)" @keyup.tab="selectUser(field)"></mu-text-field>
        </template>
      </mu-form-item>
    </mu-form>
  </div>
</template>

<script>
import clientServices from "../services/clientServices";

export default {
  data() {
    return {};
  },
  props: {
    fieldsDef: {
      type: Array,
      required: true
    },
    formData: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    },
    labelWidth: {
      type: Number,
      required: false,
      default: 100
    },
    labelPosition: {
      type: String,
      required: false,
      default: "top" // available values: top / left / right
    }
  },
  methods: {
    selectUser(field) {
      let vm0 = this,
        vm1 = this.$refs[`user_${field.prop}`][0],
        keyValue = (field.meta && field.meta.keyValue) || {},
        enterId =
          (field.meta &&
            field.meta.funcParams &&
            field.meta.funcParams.enterpriseId) ||
          "";

      if (field.readonly) {
        vm1.handleBlur();
        return;
      }

      vm1.handleFocus();
      clientServices.selectEnterpriseContactWithEnterId(enterId, info => {
        for (let key in keyValue) {
          if (keyValue.hasOwnProperty(key)) {
            vm0.formData[keyValue[key]] = info[0][key];
          }
        }
        vm1.handleBlur();
      });
    }
  }
};
</script>
