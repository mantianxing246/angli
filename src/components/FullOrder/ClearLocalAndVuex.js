export default {
    methods: {
        clearNumber(){
            localStorage.setItem("courses", JSON.stringify([])); //清空原来选中的班教、录播、直播、个性化、其他课程
            localStorage.setItem("giveCourseCus", JSON.stringify([])); //清空原来选中的其他课程
            localStorage.setItem("choiceCourse", JSON.stringify([])); //清空原来选中的课程
            //在开头清空录播、直播选中的列表
            this.$store.dispatch("RESSELECTLISTARR", {
            systemSecond: [],
            systemThress: [],
            confessSecound: [],
            confessThree: [],
            systemSecondHigh: [],
            confessSecoundHigh: [],
            confessThreeHigh: [],
            gradeSecoundHigh: [],
            systemThressHigh: []
            });
            this.$store.dispatch("OFFLINSELECTLISTARR", [
            {
                campusName: "校区",
                campusNamePlacehold: "校区",
                campuses: [],
                courseTypeName: "课程类型",
                courseTypePlaceholder: "课程类型",
                courseType: [],
                gradeName: "年级",
                gradePlaceholder: "年级",
                grades: [],
                icon: "el-icon-circle-plus",
                campusId: [],
                gradeId: [],
                courseTypeId: [],
                stageName: "阶段",
                stage: [],
                subjectName: "学科",
                subject: [],
                selectAll1: false,
                isIndeterminate1: false
            }
            ]);
            this.$store.dispatch("INDIVIDUALSELECTLISTARR", {
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
            })
        }
    }
}