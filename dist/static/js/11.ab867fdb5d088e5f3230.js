webpackJsonp([11],{"9FT9":function(t,e){},uE8Q:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("mvHQ"),s=a.n(i),l=a("ZoQJ"),n={name:"templateAdmin2",data:function(){var t=this;return{columnsData:[{title:"模板名称",key:"tem_name"},{title:"备注",key:"tem_remarks"},{title:"操作",key:"option",width:150,align:"center",render:function(e,a){return e("div",[e("Button",{props:{type:"primary",size:"small",disabled:!t.levelMess["修改"]},style:{marginRight:"5px"},on:{click:function(){t.modifierTemplate(a)}}},"修改"),e("Button",{props:{type:"error",size:"small",disabled:!t.levelMess["删除"]},on:{click:function(){t.delTem(a)}}},"删除")])}}],temData:[],originData:{},modalData:{},modifierData:{},modifierTemplateShow:!1,flag:!1,temName:"",temRemarks:"",optionTem:"",delConfirm:!1,delInd:"",modifierInd:"",levelMess:{}}},mounted:function(){var t;if(void 0!==(t=this.$store.state.userLevel))for(var e in t)e===this.$route.name&&(this.levelMess=t[e]);this.temShow()},computed:{a:function(){return this.$store.state.userLevel}},watch:{a:{handler:function(t){for(var e in t)e===this.$route.name&&(this.levelMess=t[e])}}},methods:{modifierTemplate:function(t){this.modifierTemplateShow=!0;var e=t.index,a=this.originData[e];"string"==typeof a.tem_level&&(a.tem_level=l.a.evil(a.tem_level)),this.modifierData=a},modifierSubmit:function(){var t=this,e=this.submitTemData(this.modifierData,this.temName,this.temRemarks,"modifi"),a=this.changeTemText(this.modifierData,e),i=s()(e);this.initModal(),this.modifierData={},a?this.$post("/webapi/template",{key:"update",content:i,id:e.id}).then(function(e){console.log(e),t.$Message.info("修改成功"),t.temShow()}).catch(function(e){console.log(e),t.$Message.info("修改失败 &nbsp;"+e)}):window.alert("模板信息没有更改，请更改后再确认！")},modifierCancel:function(){this.initModal(),this.modifierData={}},bulidTemplate:function(){this.initModal(),this.flag=!0,this.modalData={},this.optionTem="新建模板",this.getBuildTem()},getBuildTem:function(){var t=this;this.$post("/webapi/template",{key:"get_default_tem",content:"default"}).then(function(e){var a=e;a[0].tem_level=l.a.evil(a[0].tem_level),l.a.chartToBol(a[0].tem_level),t.modalData=a[0]}).catch(function(t){console.log(t)})},submitBuildTemData:function(){var t=this,e=this.submitTemData(this.modalData,this.temName,this.temRemarks,"build"),a=this.changeTemText(this.modalData,e);this.modalData={};var i=s()(e);a?this.$post("/webapi/template",{key:"add",content:i}).then(function(e){t.$Message.info("提交成功"),t.temShow(),t.modalData={},t.buildCancel(),t.flag=!1}).catch(function(e){setTimeout(function(){t.$Message.info("提交失败："+e)},1e3),t.modalData={}}):window.alert("模板信息没有更改，请更改后提交")},submitTemData:function(t,e,a,i){var n=s()(t).replace(/tem_level/g,"level"),o=l.a.evil(n);return""===e&&(e=t.tem_name),""===a&&(a=t.tem_remarks),o.tem_name=e,o.tem_remarks=a,l.a.changeCurrentValue(o.level,this.$refs,i),o},buildCancel:function(){this.initModal(),this.modalData={},this.getBuildTem()},delTem:function(t){this.delConfirm=!0,this.delInd=t.index},confirmDel:function(){var t=this,e=this.originData[this.delInd];this.$post("/webapi/template",{key:"del",id:e.id}).then(function(e){t.$Message.info("删除成功"),t.temShow(),t.delConfirm=!1}).catch(function(e){console.log(e),t.$Message.info("删除失败：&nbsp;"+e),t.delConfirm=!1})},initModal:function(){this.temName="",this.temRemarks=""},temShow:function(){var t=this;this.$post("/webapi/template",{key:"show"}).then(function(e){t.temData=[],t.originData=e;for(var a=0;a<e.length;a++){var i={tem_name:"",tem_remarks:""};i.tem_name=e[a].tem_name,i.tem_remarks=e[a].tem_remarks,t.temData.push(i)}})},changeTemText:function(t,e){var a=t.tem_name,i=t.tem_remarks,s=e.tem_name,n=e.tem_remarks;return a!==s||i!==n||l.a.changeValue(t.tem_level,e.level)}}},o={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"tem-container"},[a("div",{staticClass:"build-tem"},[a("Button",{attrs:{type:"primary",icon:"ios-plus-empty",disabled:!t.levelMess["新建"]},on:{click:t.bulidTemplate}},[t._v("添加模板")])],1),t._v(" "),a("div",{staticClass:"table"},[a("i-table",{attrs:{columns:t.columnsData,data:t.temData}})],1),t._v(" "),a("div",{staticClass:"modal"},[a("Modal",{attrs:{title:t.optionTem},on:{"on-ok":t.submitBuildTemData,"on-cancel":t.buildCancel},model:{value:t.flag,callback:function(e){t.flag=e},expression:"flag"}},[a("div",{staticClass:"tem-con"},[a("div",{staticClass:"tem-name"},[a("label",[t._v("模板名字：")]),t._v(" "),a("i-input",{attrs:{placeholder:t.modalData.tem_name},model:{value:t.temName,callback:function(e){t.temName=e},expression:"temName"}})],1),t._v(" "),a("div",{staticClass:"tem-remarks"},[a("label",[t._v("模板备注：")]),t._v(" "),a("i-input",{attrs:{placeholder:t.modalData.tem_remarks},model:{value:t.temRemarks,callback:function(e){t.temRemarks=e},expression:"temRemarks"}})],1),t._v(" "),a("div",{staticClass:"tem-access-tem"},[a("Collapse",{attrs:{accordion:""}},[a("Panel",{attrs:{name:"tem_level"}},[a("span",[t._v("权限模板")]),t._v(" "),a("div",{attrs:{slot:"content"},slot:"content"},[a("Collapse",{attrs:{accordion:""}},t._l(t.modalData.tem_level,function(e,i,s){return a("Panel",{key:i,attrs:{name:i}},[a("span",[t._v(t._s(i))]),t._v(" "),t._l(e,function(e,i){return a("div",{key:i,staticClass:"access-list",attrs:{slot:"content"},slot:"content"},[a("p",{staticClass:"access-text"},[t._v(t._s(i))]),t._v(" "),a("Checkbox",{ref:"build"+i+s,refInFor:!0,staticClass:"checkbox",attrs:{value:e}})],1)})],2)}))],1)])],1)],1)]),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{on:{click:t.buildCancel}},[t._v("重置")]),t._v(" "),a("Button",{attrs:{type:"primary"},on:{click:t.submitBuildTemData}},[t._v("提交")])],1)]),t._v(" "),a("Modal",{attrs:{title:"修改模板"},on:{"on-cancel":t.modifierCancel,"on-ok":t.modifierSubmit},model:{value:t.modifierTemplateShow,callback:function(e){t.modifierTemplateShow=e},expression:"modifierTemplateShow"}},[a("div",{staticClass:"tem-con"},[a("p",[a("label",[t._v("模板名字：")]),t._v(" "),a("i-input",{attrs:{placeholder:t.modifierData.tem_name},model:{value:t.temName,callback:function(e){t.temName=e},expression:"temName"}})],1),t._v(" "),a("p",[a("label",[t._v("模板备注：")]),t._v(" "),a("i-input",{attrs:{placeholder:t.modifierData.tem_remarks},model:{value:t.temRemarks,callback:function(e){t.temRemarks=e},expression:"temRemarks"}})],1),t._v(" "),a("div",{staticClass:"tem-access-tem"},[a("Collapse",{attrs:{accordion:""}},[a("Panel",{attrs:{name:"tem_level"}},[a("span",[t._v("权限模板")]),t._v(" "),a("div",{attrs:{slot:"content"},slot:"content"},[a("Collapse",{attrs:{accordion:""}},t._l(t.modifierData.tem_level,function(e,i,s){return a("Panel",{key:i,attrs:{name:i}},[a("span",[t._v(t._s(i))]),t._v(" "),t._l(e,function(e,i){return a("div",{key:i,staticClass:"access-list",attrs:{slot:"content"},slot:"content"},[a("p",{staticClass:"access-text"},[t._v(t._s(i))]),t._v(" "),a("Checkbox",{ref:"modifi"+i+s,refInFor:!0,staticClass:"checkbox",attrs:{value:e}})],1)})],2)}))],1)])],1)],1)])]),t._v(" "),a("Modal",{attrs:{width:"360"},model:{value:t.delConfirm,callback:function(e){t.delConfirm=e},expression:"delConfirm"}},[a("p",{staticStyle:{color:"rgb(255, 102, 0)","text-align":"center"},attrs:{slot:"header"},slot:"header"},[a("Icon",{attrs:{type:"information-circled"}}),t._v(" "),a("span",[t._v("删除确认")])],1),t._v(" "),a("div",{staticStyle:{"text-align":"center"}},[a("p",[t._v("该用户一经删除，无法恢复")])]),t._v(" "),a("div",{attrs:{slot:"footer"},slot:"footer"},[a("Button",{attrs:{type:"error",size:"large",long:""},on:{click:t.confirmDel}},[t._v("删除")])],1)])],1)])},staticRenderFns:[]};var m=a("VU/8")(n,o,!1,function(t){a("9FT9")},"data-v-74da5dba",null);e.default=m.exports}});
//# sourceMappingURL=11.ab867fdb5d088e5f3230.js.map