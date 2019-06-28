/**
@author Andy
@date 2019/1/18
*/
<template>
  <div>
    <p class="font-size-thick">新增订单信息</p>
    <table class="notElement">
      <tr>
        <td>报名表号:</td>
        <td>
          <el-input
            v-model="createOrderInfo.registerFormNum"
            type="text"
            style="width: 200px"
            @change="createOrderInfoChange"
          />
        </td>
        <td>开单人员:</td>
        <td style="text-align: center">{{ username }}</td>

        <td>是否续保:</td>
        <td style="text-align: center">
          <el-radio
            v-model="createOrderInfo.orderMarketing.isContinuous"
            label="1"
            @change="createOrderInfoChange"
          >是</el-radio>
          <el-radio
            v-model="createOrderInfo.orderMarketing.isContinuous"
            label="0"
            @change="createOrderInfoChange"
          >否</el-radio>
        </td>
      </tr>
      <tr>
        <td>销售分成:</td>
        <td>
          <el-radio v-model="hasDivideUser" label="0">无</el-radio>
          <el-radio v-model="hasDivideUser" label="1">指定</el-radio>
          <span v-show="hasDivideUser === '1'">
            <el-select
              v-model="createOrderInfo.roleId"
              style="width: 200px"
              placeholder="请选择角色"
              @change="createOrderInfoChange"
            >
              <el-option v-for="role in roles" :key="role.id" :value="role.id" :label="role.value"/>
            </el-select>
            <el-select
              v-model="createOrderInfo.orderMoney.divideUser"
              style="width: 200px"
              placeholder="请选择账户"
              @change="createOrderInfoChange"
            >
              <el-option v-for="user in users" :key="user.id" :value="user.id" :label="user.value"/>
            </el-select>分成比例：50%
          </span>
        </td>
        <td>省市:</td>
        <td>
          <el-select
            v-model="createOrderInfo.orderMarketing.provinceId"
            @change="createOrderInfoChange"
          >
            <el-option
              v-for="province in headInfo.provinces"
              :key="province.provinceId"
              :value="province.provinceId"
              :label="province.provinceName"
            />
          </el-select>
        </td>
        <td>市场手段:</td>
        <td>
          <el-select
            v-model="createOrderInfo.orderMarketing.marketType"
            @change="createOrderInfoChange"
          >
            <el-option
              v-for="marketType in headInfo.marketTypes"
              :key="marketType.id"
              :value="marketType.id"
              :label="marketType.typeName"
            />
          </el-select>
        </td>
      </tr>
      <tr>
        <td>收入类型:</td>
        <td>
          <el-select
            v-model="createOrderInfo.orderMarketing.sourceType"
            @change="createOrderInfoChange"
          >
            <el-option
              v-for="sourceType in headInfo.sourceTypes"
              :key="sourceType.id"
              :value="sourceType.id"
              :label="sourceType.typeName"
            />
          </el-select>
        </td>

        <td>报告场合:</td>
        <td>
          <el-select
            v-model="createOrderInfo.orderMarketing.registerType"
            @change="createOrderInfoChange"
          >
            <el-option
              v-for="registerType in headInfo.registerTypes"
              :key="registerType.id"
              :value="registerType.id"
              :label="registerType.typeName"
            />
          </el-select>
        </td>
        <td>付费时间:</td>
        <td>
          <el-date-picker
            v-model="createOrderInfo.orderMoney.paymentDate"
            type="date"
            placeholder="选择日期"
            style="width: 200px"
            @change="createOrderInfoChange"
          />
        </td>
      </tr>
      <tr>
        <td>付费方式:</td>
        <td>
          <el-select v-model="createOrderInfo.orderMoney.payTypeId" @change="createOrderInfoChange">
            <el-option
              v-for="payType in headInfo.payTypes"
              :key="payType.payTypeid"
              :value="payType.payTypeid"
              :label="payType.payTypeName"
            />
          </el-select>
        </td>
        <td>应付:</td>
        <td style="text-align: center">
          <span>{{ payable }}</span>
        </td>
        <td>实收:</td>
        <td>
          <el-input
            v-model="createOrderInfo.orderMoney.received"
            type="text"
            style="width: 200px"
            @change="createOrderInfoChange"
          />
        </td>
      </tr>
      <tr>
        <td>备注信息:</td>
        <td>
          <el-input
            :rows="2"
            v-model="createOrderInfo.remark"
            type="textarea"
            @change="createOrderInfoChange"
          />
        </td>
        <td colspan="4"/>
      </tr>
    </table>
  </div>
</template>
<script>
import { getHeadInfo } from '@/api/order/HeadInfoApi'
export default {
  name: 'CreateOrderInfo',
  props: {
    createOrderInfo: {
      type: Object,
      default: function () {
        return {
          registerFormNum: '',
          type: 1,
          palyable: null,
          remark: '',
          roleId: null,
          orderMoney: { type: 1, divideUser: null, payTypeId: null, received: null, paymentDate: null },
          orderMarketing: { isContinuous: 0, sourceType: null, marketType: null, registerType: null, provinceId: null }
        }
      }
    },
    payable: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      headInfo: {
        provinces: [],
        sourceTypes: [],
        marketTypes: [],
        registerTypes: [],
        payTypes: []
      },
      hasDivideUser: '0',
      roles: [
        { id: 1, value: 'aa' },
        { id: 2, value: 'bb' },
        { id: 3, value: 'cc' }
      ],
      users: [
        { id: 1, value: 'aa' },
        { id: 2, value: 'bb' },
        { id: 3, value: 'cc' }
      ]
    }
  },
  computed: {
    username () {
      return this.$store.getters.name
    }
  },
  mounted () {
    this.getHeadInfo()
  },
  methods: {
    getHeadInfo () {
      getHeadInfo().then(response => {
        if (response.status === 200) {
          this.headInfo = response.data
        } else {
          this.$message({
            message: response.message,
            type: 'warning'
          })
        }
      })
    },
    createOrderInfoChange () {
      this.$emit('update:createOrderInfo', this.createOrderInfo)
    }
  }
}
</script>
<style>
table.notElement {
  border-collapse: collapse;
  text-align: left;
  color: #909399;
  width: 100%;
}
.notElement td {
  font-size: small;
}
</style>
