webpackJsonp([15],{t0F0:function(t,i,a){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var e=a("mvHQ"),n=a.n(e),s=a("ZoQJ"),o={name:"maunalAdmin",data:function(){var t=this;return{columnsData:[{title:"机房名称",key:"ftow_root_name"},{title:"ip地址",key:"ftow_key"},{title:"备注",key:"ftow_remarks"},{title:"操作时间",key:"ftow_time"},{title:"操作人员",key:"ftow_user"},{title:"操作",key:"option",width:100,align:"center",render:function(i,a){return i("Button",{props:{type:"error",size:"small",disabled:!t.levelMess["删除"]},on:{click:function(){t.confirmClick(a)}}},"解封ip")}}],idcData:[{idc_name:"全部",id:""}],idc_name:"",buildIpShow:!1,buildData:{ip:"",remarks:""},buildInd:"",levelMess:{},addData:[],queryIp:"",idcName:"",pageNum:"",pageShow:!1,originData:"",confirmShow:!1,confirmInd:"",inter:""}},mounted:function(){var t,i=this;if(void 0!==(t=this.$store.state.userLevel))for(var a in t)a===this.$route.name&&(this.levelMess=t[a]);this.getData(),this.getIpData(),this.inter=setInterval(function(){i.getIpData()},3e3)},methods:{getData:function(){var t=this;this.$post("/webapi/public",{key:"idc_root"}).then(function(i){"{}"!==n()(i)&&void 0!==i&&i.forEach(function(i,a){t.idcData.push(i)})}).catch(function(t){console.log(t)})},getIpData:function(){for(var t=this,i="",a={},e=0;e<this.idcData.length;e++)this.idcName===this.idcData[e].idc_name&&(i=this.idcData[e].id);a.ip=this.queryIp,a.root_id=i;var s=n()(a);this.$post("/webapi/manualtow",{key:"show",content:s}).then(function(i){t.addData=[],t.originData=[],"{}"!==n()(i)&&void 0!==i&&(i.forEach(function(i,a){t.addData.push(i),t.originData.push(i)}),i.length>10?(t.pageNum=i.length,t.pageShow=!0,t.addData=t.originData.slice(0,10)):i.length<=10&&(t.pageShow=!1))}).catch(function(t){console.log(t)})},buildClick:function(){this.buildIpShow=!0},buildIpCancel:function(){this.buildData.ip="",this.buildData.remarks="",this.choseIdc=""},confirmClick:function(t){this.confirmShow=!0,this.confirmInd=t.index},confirmDec:function(){var t=this,i=this.addData[this.confirmInd].id;this.$post("/webapi/manualtow",{key:"del",id:i}).then(function(i){t.$Message.info("解封成功"),t.getIpData(),t.confirmShow=!1}).catch(function(i){t.$Message.info("解封失败"+i)})},subBuildIp:function(){var t=this,i=[];if(""===this.buildData.ip||""===this.buildData.remarks)return alert("请填写完整资料！"),!0;if(/[^\d.\s]+/g.test(this.buildData.ip))return alert("两个ip地址之间用换行符分隔，请勿输入其他符号"),!0;i=this.buildData.ip.split(/\s/g),this.$post("/webapi/manualtow",{key:"add",ip:i.join(" "),remarks:this.buildData.remarks}).then(function(i){if(403===i[1])return alert(i[2]),!0;t.$Message.info("添加成功"),t.buildIpShow=!1,t.buildIpCancel(),t.getIpData()}).catch(function(i){t.$Message.info("添加失败"+i)})},Query:function(){return""===this.idcName&&""===this.queryIp?(alert("请输入机房名称或ip地址！"),!0):s.a.regIp(this.queryIp)||""===this.queryIp?"全部"===this.idcName&&""===this.queryIp?(alert("请输入查询IP！"),!0):void this.getIpData():(alert("输入ip格式不正确！"),!0)},pageChange:function(t){this.addData=this.originData.slice(10*(t-1),10*t)},inpFocus:function(){clearInterval(this.inter)},inpBlur:function(){var t=this;this.inter=setInterval(function(){t.getIpData()},3e3)},hisQuery:function(){var t=this;this.idcName="",this.queryIp="";var i=n()({ip:"",root_id:""});this.$post("/webapi/manualtow",{key:"show",content:i}).then(function(i){t.addData=[],t.originData=[],"{}"!==n()(i)&&void 0!==i&&(i.forEach(function(i,a){t.addData.push(i),t.originData.push(i)}),i.length>10?(t.pageNum=i.length,t.pageShow=!0,t.addData=t.originData.slice(0,10)):i.length<=10&&(t.pageShow=!1))}).catch(function(t){console.log(t)})}},computed:{a:function(){return this.$store.state.userLevel}},watch:{$route:function(t,i){clearInterval(this.inter)},a:{handler:function(t){for(var i in t)i===this.$route.name&&(this.levelMess=t[i])}}}},r={render:function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",{staticClass:"maunal-container"},[a("div",{staticClass:"manual-build"},[a("Button",{attrs:{type:"primary",icon:"ios-plus-empty",disabled:!t.levelMess["新建"]},on:{click:t.buildClick}},[t._v("新建封停ip")])],1),t._v(" "),a("div",{staticClass:"query"},[a("div",{staticClass:"query-idc"},[a("Select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择机房名称"},model:{value:t.idcName,callback:function(i){t.idcName=i},expression:"idcName"}},t._l(t.idcData,function(i,e){return a("Option",{key:e,attrs:{value:i.idc_name}},[t._v(t._s(i.idc_name))])}))],1),t._v(" "),a("div",{staticClass:"query-ip"},[a("i-input",{staticStyle:{width:"200px"},attrs:{placeholder:"请输入查询ip"},on:{"on-focus":t.inpFocus,"on-blur":t.inpBlur},model:{value:t.queryIp,callback:function(i){t.queryIp=i},expression:"queryIp"}})],1),t._v(" "),a("div",{staticClass:"query-btn"},[a("Button",{attrs:{type:"primary"},on:{click:t.Query}},[t._v("查询")])],1),t._v(" "),a("div",{staticClass:"history"},[a("Button",{attrs:{type:"primary"},on:{click:t.hisQuery}},[t._v("近一周记录")])],1)]),t._v(" "),a("div",{staticClass:"table"},[a("i-table",{attrs:{columns:t.columnsData,data:t.addData}})],1),t._v(" "),a("div",{staticClass:"modal"},[a("div",{staticClass:"modal"},[a("Modal",{staticClass:"build-ip",attrs:{title:"新建封停ip"},on:{"on-cancel":t.buildIpCancel},model:{value:t.buildIpShow,callback:function(i){t.buildIpShow=i},expression:"buildIpShow"}},[a("div",{staticClass:"content"},[a("div",{staticClass:"item",staticStyle:{"margin-bottom":"10px"}},[a("label",[t._v("ip地址（可新建多个ip，请以换行分隔！）")]),t._v(" "),a("i-input",{attrs:{placeholder:"请输入ip地址",type:"textarea"},model:{value:t.buildData.ip,callback:function(i){t.$set(t.buildData,"ip",i)},expression:"buildData.ip"}})],1),t._v(" "),a("div",{staticClass:"item"},[a("label",[t._v("备注")]),t._v(" "),a("i-input",{attrs:{placeholder:"请输入备注"},model:{value:t.buildData.remarks,callback:function(i){t.$set(t.buildData,"remarks",i)},expression:"buildData.remarks"}})],1)]),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{on:{click:t.buildIpCancel}},[t._v("重置")]),t._v(" "),a("Button",{attrs:{type:"primary"},on:{click:t.subBuildIp}},[t._v("提交")])],1)]),t._v(" "),a("Modal",{attrs:{width:"360"},model:{value:t.confirmShow,callback:function(i){t.confirmShow=i},expression:"confirmShow"}},[a("p",{staticStyle:{color:"rgb(255, 102, 0)","text-align":"center"},attrs:{slot:"header"},slot:"header"},[a("Icon",{attrs:{type:"information-circled"}}),t._v(" "),a("span",[t._v("解封确认")])],1),t._v(" "),a("div",{staticStyle:{"text-align":"center"}},[a("p",[t._v("确定解封该ip?")])]),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"error",size:"large",long:""},on:{click:t.confirmDec}},[t._v("确定")])],1)])],1)]),t._v(" "),a("div",{staticClass:"page"},[t.pageShow?a("Page",{attrs:{total:t.pageNum,"show-elevator":""},on:{"on-change":t.pageChange}}):t._e()],1)])},staticRenderFns:[]};var l=a("VU/8")(o,r,!1,function(t){a("yr0Z")},"data-v-1bf0622f",null);i.default=l.exports},yr0Z:function(t,i){}});
//# sourceMappingURL=15.504eaaf709cb2a6f9759.js.map