<template>
  <div class="dashboard-container">
    <!-- <pan-thumb :image="avatar" class="margin-20"/> -->
    <!-- <el-button
      type="primary"
      icon="upload"
      style="position: absolute;bottom: 15px;margin-left: 40px;"
      @click="imagecropperShow=true"
    >更改图片</el-button>-->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card el-card-cus-container">
          <div class="text item">总销售额（本月）</div>
          <div
            class="text item"
          >
          <CountToAmount
            @countToRef="countToRef($event,'AllMonthlySalesVolume')"
            :startVal="0" 
            :endVal="wholeCountryAllMonthlySalesVolume+shanghaiAllMonthlySalesVolume"
            :duration="1000"
            prefix="￥"
            :selfStyle="CountToAmountStyle"
          /></div>
          <el-tooltip content="事业部本月销售业绩合计（上海+全国）。" placement="bottom" effect="light">
            <img class="el-card-cus-img" src="@/images/wenhao.svg" alt style>
          </el-tooltip>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card el-card-cus-container">
          <div class="text item">权责收入(本月)</div>
          <div class="text item">
            <CountToAmount
            @countToRef="countToRef($event,'AccrualIncome')" 
            :startVal="0" 
            :endVal="wholeCountryAccrualIncome+shanghaiAccrualIncome"
            :duration="1000"
            prefix="￥"
            :selfStyle="CountToAmountStyle"
          />
            </div>
          <el-tooltip content="事业部本月权责收入合计（上海+全国）。" placement="bottom" effect="light">
            <img class="el-card-cus-img" src="@/images/wenhao.svg" alt>
          </el-tooltip>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card el-card-cus-container">
          <div class="text item">招生人数(本月)</div>
          <div class="text item">
             <CountToAmount
             @countToRef="countToRef($event,'countStudent')"  
              :startVal="0" 
              :endVal="countStudent"
              :duration="1000"
              :selfStyle="CountToAmountStyle"
              suffix='人'
            />
          </div>
          <el-tooltip content="班教+网课新签人数合计。" placement="bottom" effect="light">
            <img class="el-card-cus-img" src="@/images/wenhao.svg" alt>
          </el-tooltip>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="box-card" shadow="always">
          <div id="myChart" style="height:240px;width:100%;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" shadow="always">
          <div class="text item" style="margin-bottom:10px;font-weight: bold">销售排名(本月)</div>
          <!-- <div>
              <img src="/src/images/huang.svg" alt style="width:20px;height:20px;"> 小明
            </div>
            <div>
              <img src="/src/images/yin.svg" alt style="width:20px;height:20px;"> 小红
            </div>
            <div>
              <img src="/src/images/tong.svg" alt style="width:20px;height:20px;"> 小黑
          </div>-->
          <el-row
            v-for="(item, index) in salesRankList"
            :key="index"
            :gutter="0"
            style="margin-bottom:0px;"
          >
            <el-col :span="3">
              <div class="grid-content bg-purple" style="text-align:center;">
                <img
                  v-if="index === 0"
                  src="@/images/huang.svg"
                  alt
                  style="width:20px;height:20px;"
                >
                <img
                  v-else-if="index === 1"
                  src="@/images/yin.svg"
                  alt
                  style="width:20px;height:20px;"
                >
                <img
                  v-else-if="index === 2"
                  src="@/images/tong.svg"
                  alt
                  style="width:20px;height:20px;"
                >
                <span v-else style="width:20px;height:20px;display:inline-block;">{{item.ranking}}</span>
              </div>
            </el-col>
            <el-col :span="11">
              <div class="grid-content bg-purple">
                <span>{{item.salesman}}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                 <CountToAmount
                    @countToRef="countToRef($event,'salesPerformance'+item.ranking)" 
                    :startVal="0" 
                    :endVal="item.salesPerformance"
                    :duration="1000"
                    :selfStyle="{'color':'#ff0000'}"
                    prefix="￥"
                 />
                </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!-- <card-container style="height:400px;min-width:500px;float:left;margin-left:10px;">
        <template slot="body">
          <div id="myChartPie" style="height:400px;"></div>
        </template>
    </card-container>-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="noticeDialogVisible"
      title="公告"
      width="30%"
      center
    >
      <span>{{ noticeMes }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm()">确 认</el-button>
      </span>
    </el-dialog>
    <!-- <image-cropper
      v-show="imagecropperShow"
      :width="300"
      :height="300"
      :key="imagecropperKey"
      url="https://httpbin.org/post"
      lang-type="en"
      @close="close"
    @crop-upload-success="cropSuccess"/>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import panThumb from "@/components/PanThumb";
import {
  findNoticeList,
  findGrossSales,
  findSalesRank,
  accrualCalculation,
  newStudentsEnrollment
} from "@/api/dashboard/index";
import { setTimeout, clearTimeout } from "timers";

export default {
  name: "Dashboard",
  components: {
    panThumb
  },
  data() {
    return {
      countToRefList:[],
      CountToAmountStyle:{'color':'#ff0000','font-size':'25px'},
      countStudent: 0, // 招生人数
      imagecropperShow: false,
      noticeDialogVisible: false, // 公告弹窗
      noticeMes: "", // 公告信息
      wholeCountryAllMonthlySalesVolume: 0, // 全国总销售额
      shanghaiAllMonthlySalesVolume: 0, // 上海总销售额
      monthlySalesVolume: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], //年度销售分月
      salesRankList: [], // 销售排行榜
      wholeCountryAccrualIncome: 0, // 全国权责收入
      shanghaiAccrualIncome: 0, // 上海权责收入
      option: {
        title: { text: "年度销售统计" },
        grid: {
          left: "13%"
        },
        tooltip: {},
        xAxis: {
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ]
        },
        yAxis: {},
        series: [
          {
            name: "销售额",
            type: "bar",
            data: []
          }
        ]
      }, // 图表 option
      myChart: {} // echarts对象
    };
  },
  created() {
    this.findNoticeList(); // 公告信息
    this.findGrossSales("wholeCountryAllMonthlySalesVolume", 1); // 全国获取销售月度记录，根据每个月的计算出 全年的
    this.findGrossSales("shanghaiAllMonthlySalesVolume", 2); // 上海获取销售月度记录，根据每个月的计算出 全年的
    this.findSalesRank(); // 销售排名
    this.accrualCalculation("wholeCountryAccrualIncome", 1); // 全国权责收入
    this.accrualCalculation("shanghaiAccrualIncome", 2); // 上海权责收入
    this.newStudentsEnrollment(); // 获取招生人数
  },
  updated() {},
  mounted() {
    this.drawLine();
  },
  methods: {
    confirm(){
      this.noticeDialogVisible = false;
      this.countToRefList.forEach(element => {
          element.reset();
          element.start();
      });
    },
    countToRef(ref,k){
      let obj = {};
      this.countToRefList.push(obj[k] = ref.countToRef);
    },
    newStudentsEnrollment() {
      newStudentsEnrollment({
        date: this.$format(new Date()),
        provinceIdList: [1, 2]
      }).then(res => {
        this.countStudent = res.data.countStudent;
      });
    },
    accrualCalculation(key, provinceId) {
      accrualCalculation({
        date: this.$format(new Date()),
        provinceId: provinceId
      }).then(res => {
        this[key] = res.data.accrualIncome;
      });
    },
    findSalesRank() {
      findSalesRank().then(res => {
        this.salesRankList = res.data;
      });
    },
    findGrossSales(key, provinceId) {
      findGrossSales({
        year: new Date().getFullYear(),
        provinceId: provinceId
      }).then(res => {
        res.data.forEach((element, index) => {
          if (element.month === String(new Date().getMonth() + 1)) {
            this[key] = element.monthlySalesVolume;
          }
          this.monthlySalesVolume[index] &&
            (this.monthlySalesVolume[index] += element.monthlySalesVolume);
        });
        this.monthlySalesVolume = JSON.parse(
          JSON.stringify(this.monthlySalesVolume)
        );
      });
    },
    drawLine() {
      this.myChart = this.$echarts.init(document.getElementById("myChart"));
      this.myChart.setOption(this.option);
      this.myChart.showLoading();
    },
    findNoticeList() {
      findNoticeList().then(res => {
        if (res.status === 200) {
          this.noticeMes = res.data[0];
          this.noticeDialogVisible = true;
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    }
  },
  computed: {
    sidebar: function() {
      return this.$store.getters.sidebar;
    }
  },
  watch: {
    "sidebar.opened": function(v) {
      let time = setTimeout(() => {
        this.myChart.resize();
        clearTimeout(time);
      }, 301);
    },
    monthlySalesVolume(v) {
      this.option.series[0].data = this.monthlySalesVolume;
      this.myChart.setOption(this.option);
      this.myChart.hideLoading();
    }
  },
  destroyed() {
    this.myChart.dispose();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 26px;
    line-height: 46px;
  }
}
.el-card-cus-container {
  position: relative;
}
.el-card-cus-img {
  width: 20px;
  height: 20px;
  position: absolute;
  right: 5px;
  top: 5px;
}
</style>
