<template>
  <div class="entry-form">
    <div>
      <!-- <el-col :span="4">是否开通对应名师网课</el-col> -->
      <!-- <el-radio-group v-model="opening" class="margin-bottom">
        <el-radio :label="1" :value="1" @change="getOpengOnlineCourse">是</el-radio>
        <el-radio :label="2" :value="2" @change="getOpengOnlineCourse">否</el-radio>
      </el-radio-group>-->
    </div>
    <div style="margin-left:20px;">
      <div class="margin-bottom">
        <!-- <h2>报名在线个性化课程</h2> -->
        <!-- <el-button type="primary" class="but" @click="findCourseByIndivEntryForm">确认</el-button> -->
        <div>
          <el-form inline v-for="(item,index) in list" :key="index">
            <!-- <div style="height:30px;"> -->
              <!-- <el-col :span="4"> -->
                <!-- <span class="form-item-rigth">初二</span> -->
              <el-form-item class="fontSize" label="初二">
                <el-select
                  :placeholder="item.courseTypePlaceholder"
                  v-model="item.courseTypeId"
                  clearable
                  class="width120"
                  style="margin-right:10px;"
                >
                  <el-option
                    :value="item"
                    :label="item"
                    v-for="(item,index) in item.courseType"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col :span="1" class="fontSize">学科</el-col> -->
              <el-form-item class="fontSize" label="学科">
                <el-checkbox-group v-model="item.second">
                  <el-checkbox :label="1">语</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdyu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item "
                      :label="item"
                      v-for="(item,index) in item.classhour"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="2">数</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdshu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhour"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="3">英</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdying"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhour"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="4">物</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdwu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhour"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item :span="2">
                <span @click="add(item.icon,index)">
                  <svg-icon
                    icon-class="add"
                    v-if="item.icon==='el-icon-circle-plus'"
                    class="font-size"
                  />
                  <svg-icon icon-class="reduce" v-else class="font-size"/>
                </span>
              </el-form-item>
            <!-- </div> -->
          </el-form>
          <el-form inline v-for="(item,index) in listOne" :key="index+list.length">
            <!-- <div style="height:30px;"> -->
              <!-- <el-col :span="4"> -->
                <!-- <span class="form-item-rigth">初三</span> -->
              <el-form-item class="fontSize" label="初三">
                <el-select
                  :placeholder="item.courseTypeonePlaceholder"
                  v-model="item.courseTypeoneId"
                  clearable
                  class="width120"
                  style="margin-right:10px;"
                >
                  <el-option
                    :value="item"
                    :label="item"
                    v-for="(item,index) in item.courseTypeone"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col :span="1" class="fontSize">学科</el-col> -->
              <el-form-item class="fontSize" label="学科">
                <el-checkbox-group v-model="item.third">
                  <el-checkbox :label="1">语</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdyu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourone"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="2">数</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdshu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourone"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="3">英</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdying"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourone"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="4">物</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdwu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourone"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <br>
                  <el-checkbox :label="5">化</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdhua"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourone"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item :span="2">
                <span @click="addOne(item.icon,index)">
                  <svg-icon
                    icon-class="add"
                    v-if="item.icon==='el-icon-circle-plus'"
                    class="font-size"
                  />
                  <svg-icon icon-class="reduce" v-else class="font-size"/>
                </span>
              </el-form-item>
            <!-- </div> -->
          </el-form>
          <el-form inline v-for="(item,index) in listTwo" :key="index+list.length+listOne.length">
            <!-- <div style="height:30px;"> -->
              <!-- <el-col :span="4"> -->
                <!-- <span class="form-item-rigth">高一</span> -->
                <el-form-item class="fontSize" label="高一">
                <el-select
                  :placeholder="item.courseTypetwoPlaceholder"
                  v-model="item.courseTypetwoId"
                  clearable
                  class="width120"
                  style="margin-right:10px;"
                >
                  <el-option
                    :value="item"
                    :label="item"
                    v-for="(item,index) in item.courseTypetwo"
                    :key="index"
                  ></el-option>
                </el-select>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col :span="1" class="fontSize">学科</el-col> -->
              <el-form-item label="学科" class="fontSize">
                <el-checkbox-group v-model="item.seniorOne">
                  <el-checkbox :label="1">语</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdyu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourtwo"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="2">数</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdshu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourtwo"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="3">英</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdying"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourtwo"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="4">物</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdwu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourtwo"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <br>
                  <el-checkbox :label="5">化</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdhua"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourtwo"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="6">生</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdsheng"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourtwo"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="7">地</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIddi"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourtwo"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item :span="2">
                <span @click="addTwo(item.icon,index)">
                  <svg-icon
                    icon-class="add"
                    v-if="item.icon==='el-icon-circle-plus'"
                    class="font-size"
                  />
                  <svg-icon icon-class="reduce" v-else class="font-size"/>
                </span>
              </el-form-item>
            <!-- </div> -->
          </el-form>
          <el-form inline
            v-for="(item,index) in listThree"
            :key="index+list.length+listOne.length+listTwo.length"
          >
            <!-- <div style="height:30px;">
              <el-col :span="4"> -->
                <!-- <span class="form-item-rigth">高二</span> -->
                <el-form-item class="fontSize" label="高二">
                <el-select
                  :placeholder="item.courseTypethreePlaceholder"
                  v-model="item.courseTypethreeId"
                  clearable
                  class="width120"
                  style="margin-right:10px;"
                >
                  <el-option
                    :value="item"
                    :label="item"
                    v-for="(item,index) in item.courseTypethree"
                    :key="index"
                  ></el-option>
                </el-select>
                </el-form-item>
              <!-- </el-col> -->
              <!-- <el-col :span="1" class="fontSize">学科</el-col> -->
              <el-form-item label="学科" class="fontSize">
                <el-checkbox-group v-model="item.seniorTwo">
                  <el-checkbox :label="1">语</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdyu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourthree"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="2">数</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdshu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourthree"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="3">英</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdying"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourthree"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="4">物</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdwu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourthree"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <br>
                  <el-checkbox :label="5">化</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdhua"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourthree"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="6">生</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdsheng"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourthree"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="7">政</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdzheng"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourthree"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="8">历</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdli"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourthree"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <br>
                  <el-checkbox :label="9">地</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIddi"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourthree"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item>
                <span @click="addThree(item.icon,index)">
                  <svg-icon
                    icon-class="add"
                    v-if="item.icon==='el-icon-circle-plus'"
                    class="font-size"
                  />
                  <svg-icon icon-class="reduce" v-else class="font-size"/>
                </span>
              </el-form-item>
            <!-- </div> -->
          </el-form>
          <el-form inline
            v-for="(item,index) in listFour"
            :key="index+list.length+listOne.length+listTwo.length+listThree.length"
          >
            <!-- <div style="height:30px;"> -->
              <!-- <el-col :span="4"> -->
                <!-- <span class="form-item-rigth">高三</span> -->
                <el-form-item class="fontSize" label="高三">
                <el-select
                  :placeholder="item.courseTypefourPlaceholder"
                  v-model="item.courseTypefourId"
                  clearable
                  class="width120"
                  style="margin-right:10px;"
                >
                  <el-option
                    :value="item"
                    :label="item"
                    v-for="(item,index) in item.courseTypefour"
                    :key="index"
                  ></el-option>
                </el-select>
                </el-form-item>
              <!-- </el-col>
              <el-col :span="1" class="fontSize">学科</el-col> -->
              <el-form-item label="学科" class="fontSize">
                <el-checkbox-group v-model="item.seniorThird">
                  <el-checkbox :label="1">语</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdyu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourfour"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="2">数</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdshu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourfour"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="3">英</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdying"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourfour"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="4">物</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdwu"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourfour"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <br>
                  <el-checkbox :label="5">化</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdhua"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourfour"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="6">政</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdzheng"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourfour"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-checkbox :label="7">历</el-checkbox>
                  <el-select
                    :placeholder="item.classhourPlaceholder"
                    v-model="item.classhourIdli"
                    clearable
                    class="width90"
                  >
                    <el-option
                      :value="item"
                      :label="item"
                      v-for="(item,index) in item.classhourfour"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item>
                <span @click="addFour(item.icon,index)">
                  <svg-icon
                    icon-class="add"
                    v-if="item.icon==='el-icon-circle-plus'"
                    class="font-size"
                  />
                  <svg-icon icon-class="reduce" v-else class="font-size"/>
                </span>
              </el-form-item>
            <!-- </div> -->
          </el-form>
          <el-row type="flex" justify="center">
            <el-col :span="2">
              <el-button
                type="primary"
                @click="findCourseByIndivEntryForm"
                icon="el-icon-shopping-cart-full"
              >加入课程列表</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getHeadInfo } from "@/api/components/HeadInfoApi";
import courseType from "@/CourseType/CourseType.js";
import { findCourseByIndivEntryForm } from "@/api/order/FullOrder";
export default {
  name: "EntryForm",
  data () {
    return {
      opening: 1,
      courseQuery: {
        gradeId: null,
        version: null,
        subjectIds: null,
        courseType: "",
        classhour: "",
        periodIds: null,
        campusIds: null,
        propertyIds: [2, 3]
      },
      headInfo: {
        courseType: [],
        campusIds: null
      },
      list: [
        {
          courseTypePlaceholder: "课程类型",
          courseType: [],
          classhour: [],
          courseTypeId: null,
          classhourPlaceholder: "课时",
          grade: "初二",
          courseTypeId: null,
          classhour: [],
          classhourIdyu: null,
          classhourIdshu: null,
          classhourIdying: null,
          classhourIdwu: null,
          second: [],
          icon: "el-icon-circle-plus"
        }
      ],
      listOne: [
        {
          courseTypeonePlaceholder: "课程类型",
          courseTypeone: [],
          gradeone: "初三",
          courseTypeoneId: null,
          third: [],
          classhourPlaceholder: "课时",
          classhourIdyu: null,
          classhourIdshu: null,
          classhourIdying: null,
          classhourIdwu: null,
          classhourIdhua: null,
          classhourone: [],
          icon: "el-icon-circle-plus"
        }
      ],
      listTwo: [
        {
          courseTypetwoPlaceholder: "课程类型",
          courseTypetwo: [],
          gradetwo: "高一",
          courseTypetwoId: null,
          seniorOne: [],
          classhourPlaceholder: "课时",
          classhourIdyu: null,
          classhourIdshu: null,
          classhourIdying: null,
          classhourIdwu: null,
          classhourIdhua: null,
          classhourIdsheng: null,
          classhourIddi: null,
          classhourtwo: [],
          icon: "el-icon-circle-plus"
        }
      ],
      listThree: [
        {
          courseTypethreePlaceholder: "课程类型",
          courseTypethree: [],
          gradethree: "高二",
          courseTypethreeId: null,
          classhourPlaceholder: "课时",
          classhourIdyu: null,
          classhourIdshu: null,
          classhourIdying: null,
          classhourIdwu: null,
          classhourIdhua: null,
          classhourIdsheng: null,
          classhourIdzheng: null,
          classhourIdli: null,
          classhourIddi: null,
          seniorTwo: [],
          classhourthree: [],
          icon: "el-icon-circle-plus"
        }
      ],
      listFour: [
        {
          courseTypefourPlaceholder: "课程类型",
          courseTypefour: [],
          gradefour: "高三",
          courseTypefourId: null,
          classhourPlaceholder: "课时",
          classhourIdyu: null,
          classhourIdshu: null,
          classhourIdying: null,
          classhourIdwu: null,
          classhourIdhua: null,
          classhourIdzheng: null,
          classhourIdli: null,
          seniorThird: [],
          classhourfour: [],
          icon: "el-icon-circle-plus"
        }
      ]
    };
  },
  methods: {
    findCourseByIndivEntryForm () {
      let indivCourseList = this.getNetCourseList();
      if (indivCourseList.length == 0) {
        this.$tipsMessage("必须选择一门课程", "warning");
        return;
      }
      for (let i = 0;i < indivCourseList.length;i++) {
        if (!indivCourseList[i].courseType || !indivCourseList[i].gradeId || !indivCourseList[i].hours || !indivCourseList[i].subjectId) {
          this.$tipsMessage("课程类型,学科和课时为必填", "warning");
          return;
        }
      }

      findCourseByIndivEntryForm({
        year: this.$route.query.year,
        indivCourseList
      }).then(res => {
        if (res.status == 200) {
          let course = [];
          res.data.forEach(val => {
            val.price = val.price.toLocaleString();
            val.times = val.hours
            val.giveAway = 0
            course.push(val);
          });
          this.$emit("selectCourse", course);
          if (res.data == null || res.data == "" || res.data.length == 0) {
            this.$tipsMessage('没有课程满足您所选择的条件', 'warning')
            return
          }
        } else if (res.status == 500) {
          this.$tipsMessage(res.message, "warning");
        }
      });


      this.$store.dispatch("INDIVIDUALSELECTLISTARR",{
        list:this.list,
        listOne:this.listOne,
        listTwo:this.listTwo,
        listThree:this.listThree,
        listFour:this.listFour
      })
      // this.$emit("individualSelectList",{
      //   list:this.list,
      //   listOne:this.listOne,
      //   listTwo:this.listTwo,
      //   listThree:this.listThree,
      //   listFour:this.listFour,
      // })
    },
    formatCourseStatus (val, index) {
      switch (val) {
        case 1:
          return this.list[index].classhourIdyu;
          break;
        case 2:
          return this.list[index].classhourIdshu;
          break;
        case 3:
          return this.list[index].classhourIdying;
          break;
        case 4:
          return this.list[index].classhourIdwu;
          break;
      }
    },
    formatCourseStatusone (val, index) {
      switch (val) {
        case 1:
          return this.listOne[index].classhourIdyu;
          break;
        case 2:
          return this.listOne[index].classhourIdshu;
          break;
        case 3:
          return this.listOne[index].classhourIdying;
          break;
        case 4:
          return this.listOne[index].classhourIdwu;
          break;
        case 5:
          return this.listOne[index].classhourIdhua;
          break;
      }
    },
    formatCourseStatustwo (val, index) {
      switch (val) {
        case 1:
          return this.listTwo[index].classhourIdyu;
          break;
        case 2:
          return this.listTwo[index].classhourIdshu;
          break;
        case 3:
          return this.listTwo[index].classhourIdying;
          break;
        case 4:
          return this.listTwo[index].classhourIdwu;
          break;
        case 5:
          return this.listTwo[index].classhourIdhua;
          break;
        case 6:
          return this.listTwo[index].classhourIdsheng;
          break;
        case 7:
          return this.listTwo[index].classhourIddi;
          break;
      }
    },
    formatCourseStatusthree (val, index) {
      switch (val) {
        case 1:
          return this.listThree[index].classhourIdyu;
          break;
        case 2:
          return this.listThree[index].classhourIdshu;
          break;
        case 3:
          return this.listThree[index].classhourIdying;
          break;
        case 4:
          return this.listThree[index].classhourIdwu;
          break;
        case 5:
          return this.listThree[index].classhourIdhua;
          break;
        case 6:
          return this.listThree[index].classhourIdsheng;
          break;
        case 7:
          return this.listThree[index].classhourIdzheng;
          break;
        case 8:
          return this.listThree[index].classhourIdli;
          break;
        case 9:
          return this.listThree[index].classhourIddi;
          break;
      }
    },
    formatCourseStatusfour (val, index) {
      switch (val) {
        case 1:
          return this.listFour[index].classhourIdyu;
          break;
        case 2:
          return this.listFour[index].classhourIdshu;
          break;
        case 3:
          return this.listFour[index].classhourIdying;
          break;
        case 4:
          return this.listFour[index].classhourIdwu;
          break;
        case 5:
          return this.listFour[index].classhourIdhua;
          break;
        case 6:
          return this.listFour[index].classhourIdzheng;
          break;
        case 7:
          return this.listFour[index].classhourIdli;
          break;
      }
    },

    getNetCourseList () {
      let indivCourseList = [];
      //初二
      this.list.forEach((val, index) => {
        this.list[index].second.forEach((val, index1) => {
          indivCourseList.push({
            courseType: this.list[index].courseTypeId,
            gradeId: 2,
            hours: this.formatCourseStatus(val, index),
            subjectId: val
          });
        });
      });

      //初三
      this.listOne.forEach((val, index) => {
        this.listOne[index].third.forEach((val, index1) => {
          indivCourseList.push({
            courseType: this.listOne[index].courseTypeoneId,
            gradeId: 3,
            hours: this.formatCourseStatusone(val, index),
            subjectId: val
          });
        })
      });
      //高一
      this.listTwo.forEach((val, index) => {
        this.listTwo[index].seniorOne.forEach((val, index1) => {
          indivCourseList.push({
            courseType: this.listTwo[index].courseTypetwoId,
            gradeId: 4,
            hours: this.formatCourseStatustwo(val, index),
            subjectId: val
          });
        })
      });
      //高二
      this.listThree.forEach((val, index) => {
        this.listThree[index].seniorTwo.forEach((val, index1) => {
          indivCourseList.push({
            courseType: this.listThree[index].courseTypethreeId,
            gradeId: 5,
            hours: this.formatCourseStatusthree(val, index),
            subjectId: val
          });
        })
      });
      //高三
      this.listFour.forEach((val, index) => {
        this.listFour[index].seniorThird.forEach((val, index1) => {
          indivCourseList.push({
            courseType: this.listFour[index].courseTypefourId,
            gradeId: 6,
            hours: this.formatCourseStatusfour(val, index),
            subjectId: val
          });
        })
      });
      return indivCourseList;
    },
    getHeadInfo () {
      getHeadInfo().then(res => {
        this.headInfo = Object.assign({}, res.data);
        this.list[0].courseType = courseType.individualCourseType;
        this.list[0].classhour = courseType.classhour;

        this.listOne[0].courseTypeone = courseType.individualCourseType;
        this.listOne[0].classhourone = courseType.classhour;

        this.listTwo[0].courseTypetwo = courseType.individualCourseType;
        this.listTwo[0].classhourtwo = courseType.classhour;

        this.listThree[0].courseTypethree = courseType.individualCourseType;
        this.listThree[0].classhourthree = courseType.classhour;

        this.listFour[0].courseTypefour = courseType.individualCourseType;
        this.listFour[0].classhourfour = courseType.classhours;
      });
    },
    add (icon, index) {
      if (icon == "el-icon-circle-plus") {
        this.list.push({
          grade: "  ",
          courseTypeName: "课程类型：",
          courseTypePlaceholder: "课程类型",
          courseType: courseType.individualCourseType,
          courseTypeId: null,
          classhourIdyu: null,
          classhourIdshu: null,
          classhourIdying: null,
          classhourIdwu: null,
          classhour: courseType.classhour,
          second: [],
          icon: "el-icon-remove"
        });
      } else {
        this.list.splice(index, 1);
      }
    },
    addOne (icon, index) {
      if (icon == "el-icon-circle-plus") {
        this.listOne.push({
          courseTypeoneName: "课程类型：",
          courseTypeonePlaceholder: "课程类型",
          courseTypeone: courseType.individualCourseType,
          classhourPlaceholder: "课时",
          courseTypeoneId: null,
          classhourIdyu: null,
          classhourIdshu: null,
          classhourIdying: null,
          classhourIdwu: null,
          classhourIdhua: null,
          classhourone: courseType.classhour,
          third: [],
          icon: "el-icon-remove"
        });
      } else {
        this.listOne.splice(index, 1);
      }
    },
    addTwo (icon, index) {
      if (icon == "el-icon-circle-plus") {
        this.listTwo.push({
          courseTypetwoName: "课程类型：",
          courseTypetwoPlaceholder: "课程类型",
          courseTypetwo: courseType.individualCourseType,
          courseTypetwoId: null,
          classhourPlaceholder: "课时",
          classhourIdyu: null,
          classhourIdshu: null,
          classhourIdying: null,
          classhourIdwu: null,
          classhourIdhua: null,
          classhourIdsheng: null,
          classhourIddi: null,
          seniorOne: [],
          classhourtwo: courseType.classhour,
          icon: "el-icon-remove"
        });
      } else {
        this.listTwo.splice(index, 1);
      }
    },
    addThree (icon, index) {
      if (icon == "el-icon-circle-plus") {
        this.listThree.push({
          courseTypethreeName: "课程类型：",
          courseTypethreePlaceholder: "课程类型",
          courseTypethree: courseType.individualCourseType,
          courseTypethreeId: null,
          classhourPlaceholder: "课时",
          classhourIdyu: null,
          classhourIdshu: null,
          classhourIdying: null,
          classhourIdwu: null,
          classhourIdhua: null,
          classhourIdsheng: null,
          classhourIdzheng: null,
          classhourIdli: null,
          classhourIddi: null,
          seniorTwo: [],
          classhourthree: courseType.classhour,
          icon: "el-icon-remove"
        });
      } else {
        this.listThree.splice(index, 1);
      }
    },
    addFour (icon, index) {
      if (icon == "el-icon-circle-plus") {
        this.listFour.push({
          courseTypefourName: "课程类型：",
          courseTypefourPlaceholder: "课程类型",
          courseTypefour: courseType.individualCourseType,
          courseTypefourId: null,
          classhourPlaceholder: "课时",
          classhourIdyu: null,
          classhourIdshu: null,
          classhourIdying: null,
          classhourIdwu: null,
          classhourIdhua: null,
          classhourIdzheng: null,
          classhourIdli: null,
          seniorThird: [],
          classhourfour: courseType.classhours,
          icon: "el-icon-remove"
        });
      } else {
        this.listFour.splice(index, 1);
      } 
    },
    getResSelectList(){
      this.list=this.$store.getters.individualSelectListArr.list
      this.listOne=this.$store.getters.individualSelectListArr.listOne
      this.listTwo=this.$store.getters.individualSelectListArr.listTwo
      this.listThree=this.$store.getters.individualSelectListArr.listThree
      this.listFour=this.$store.getters.individualSelectListArr.listFour
    }
  },
  mounted () {
    this.getHeadInfo();
  },
  created(){
    this.getResSelectList()
  }
};
</script>
<style scoped>
.entry-form {
  font-size: 14px;
}
.margin-bottom {
  margin-bottom: 10px;
  display: inline;
}
.margin-bottom10 {
  margin-bottom: 10px;
}
.el-row {
  margin: 5px 0 10px 0;
}
.but {
  margin-left: 60%;
}
.fontSize {
  font-size: 15px;
  line-height: 28px;
}
.width120 {
  width: 100px;
}
.width90 {
  width: 72px;
  margin: 0 15px 0 3px;
}
.flaot {
  width: 90px;
}
.flaot {
  float: left;
}
.el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.font-size {
  font-size: 20px;
  cursor: pointer;
}
.el-checkbox {
  margin-right: 5px;
}
.el-select {
  margin-right: 20px;
}
.el-form--inline .el-form-item{
  margin-right: 0px;
}
>>> .el-checkbox__label {
  padding-left: 4px;
}
>>> label{
  font-weight: normal;
}
>>> .el-form{
  margin-bottom: -9px;
}
>>> .el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label{
  line-height:25px;
}
</style>
