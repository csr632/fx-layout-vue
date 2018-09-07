<template>
  <!-- 这是Fx组件的共用模板，FxRow等子组件不需要再定义模板 -->
  <div :style="styleBindings"
       :class="classBingdings">
    <slot></slot>
  </div>
</template>

<script>
/*
可扩展性：使用者可以模仿FxRow的做法，在新组件中使用[extends](https://vuejs.org/v2/api/#extends): FxBase 选项，在继承FxBase特性的同时，还能为新组件增加自定义的功能（增加/覆盖 computed、data中定义的default值、props输入）。我们称FxBase与继承组件之间是**父组件与子组件的关系**。
可是既然将样式绑定到`div`是在FxBase中完成的，那如果新增的布局组件（FxBase的子组件）**想要增加新的样式绑定**怎么办呢？这时**不应该直接修改FxBase的代码**，因为这会影响到**所有**继承FxBase的组件。
FxBase已经预先设计好了增加新的样式绑定、类名绑定的方案：在子组件中覆盖`extendedStyle`和`extendedClass`方法，返回需要额外绑定的属性和类名，FxBase会将返回值一并绑定到DOM元素上。

FxBase只用于直接绑定样式和类。如果要添加间接影响样式的属性（比如rigid），或其它非基本的功能，添加到FxRow或FxItem等子组件中。
 */
export default {
  name: "FxBase",
  props: {
    // 在这里只定义prop name，不应在这里定义default值。默认值应该在data中定义。
    // 否则无法区分prop的值到底是父组件传递来的，还是回退的。
    disp: {
      type: String,
      default: undefined
    },
    dir: {
      type: String,
      default: undefined
    },
    wrap: {
      type: String,
      default: undefined
    },
    jc: {
      type: String,
      default: undefined
    },
    ai: {
      type: String,
      default: undefined
    },
    ac: {
      type: String,
      default: undefined
    },
    fg: {
      type: String,
      default: undefined
    },
    fs: {
      type: String,
      default: undefined
    },
    fb: {
      type: String,
      default: undefined
    },
    as: {
      type: String,
      default: undefined
    },
    w: {
      type: String,
      default: undefined
    },
    cw: {
      type: String,
      default: undefined
    },
    mnw: {
      type: String,
      default: undefined
    },
    cmnw: {
      type: String,
      default: undefined
    },
    mxw: {
      type: String,
      default: undefined
    },
    cmxw: {
      type: String,
      default: undefined
    },
    h: {
      type: String,
      default: undefined
    },
    ch: {
      type: String,
      default: undefined
    },
    mnh: {
      type: String,
      default: undefined
    },
    cmnh: {
      type: String,
      default: undefined
    },
    mxh: {
      type: String,
      default: undefined
    },
    cmxh: {
      type: String,
      default: undefined
    },
    mt: {
      type: String,
      default: undefined
    },
    cmt: {
      type: String,
      default: undefined
    },
    mr: {
      type: String,
      default: undefined
    },
    cmr: {
      type: String,
      default: undefined
    },
    mb: {
      type: String,
      default: undefined
    },
    cmb: {
      type: String,
      default: undefined
    },
    ml: {
      type: String,
      default: undefined
    },
    cml: {
      type: String,
      default: undefined
    },
    pt: {
      type: String,
      default: undefined
    },
    cpt: {
      type: String,
      default: undefined
    },
    pr: {
      type: String,
      default: undefined
    },
    cpr: {
      type: String,
      default: undefined
    },
    pb: {
      type: String,
      default: undefined
    },
    cpb: {
      type: String,
      default: undefined
    },
    pl: {
      type: String,
      default: undefined
    },
    cpl: {
      type: String,
      default: undefined
    },
    lh: {
      type: String,
      default: undefined
    },
    // 如果rigid设为true，那么flex-grow和flex-shrink都为"0"（无弹性）
    // 这个属性仅仅是为了方便和语义化而设计的
    rigid: {
      type: Boolean,
      default: undefined
    },
    // 影响子组件FxItem的flexGrow和flexShrink
    crigid: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      // 定义默认值。子组件在extends:FxBase的时候，可以覆盖这里的默认值。
      defaultDisp: "flex",
      defaultDir: "row",
      defaultWrap: "nowrap",
      defaultJc: "flex-start",
      defaultAi: "center",
      defaultAc: "stretch",
      defaultFg: "1",
      defaultFs: "1",
      defaultFb: "auto",
      defaultAs: "auto",
      defaultW: "",
      defaultCw: "",
      defaultMnw: "",
      defaultMxw: "",
      defaultCmnw: "",
      defaultCmxw: "",
      defaultH: "",
      defaultCh: "",
      defaultMnh: "",
      defaultMxh: "",
      defaultCmnh: "",
      defaultCmxh: "",
      defaultMt: "",
      defaultMr: "",
      defaultMb: "",
      defaultMl: "",
      defaultCmt: "",
      defaultCmr: "",
      defaultCmb: "",
      defaultCml: "",
      defaultPt: "",
      defaultPr: "",
      defaultPb: "",
      defaultPl: "",
      defaultCpt: "",
      defaultCpr: "",
      defaultCpb: "",
      defaultCpl: "",
      defaultLh: "",
      // 设置为undefined而不是false的原因：
      // undefined的语义是“我不决定”。
      // 一般来说，fallback(default)属性不应该说“我不决定”，
      // 但是因为这个defaultCrigid之下还有defaultFg作为fallback(备胎)，(见FxBase的flexGrow方法)
      // 所以“defaultCrigid不决定”意味着交给defaultFg来决定。
      // 假设defaultCrigid设定了一个值，那么defaultFg将永远不会被用到。
      // 见FxBase的flexGrow()代码
      defaultCrigid: undefined,
      // defaultRigid使用undefined的原因同上
      defaultRigid: undefined
    };
  },
  computed: {
    // 返回样式绑定对象
    styleBindings() {
      const baseStyle = {
          display: this.display,
          "flex-direction": this.flexDirection,
          "flex-wrap": this.flexWrap,
          "justify-content": this.justifyContent,
          "align-items": this.alignItems,
          "align-content": this.alignContent,
          "flex-grow": this.flexGrow,
          "flex-shrink": this.flexShrink,
          "flex-basis": this.flexBasis,
          "align-self": this.alignSelf,
          width: this.width,
          "min-width": this.minWidth,
          "max-width": this.maxWidth,
          height: this.height,
          "min-height": this.minHeight,
          "max-height": this.maxHeight,
          "margin-top": this.marginTop,
          "margin-right": this.marginRight,
          "margin-bottom": this.marginBottom,
          "margin-left": this.marginLeft,
          "padding-top": this.paddingTop,
          "padding-right": this.paddingRight,
          "padding-bottom": this.paddingBottom,
          "padding-left": this.paddingLeft,
          "line-height": this.lineHeight
        },
        extendedStyle = this.extendedStyle;
      // 可以通过在子组件中覆盖extendedStyle计算属性来扩展styleBindings的功能
      if (extendedStyle === "object" && extendedStyle !== null)
        return Object.assign(baseStyle, extendedStyle);
      else return baseStyle;
    },
    extendedStyle() {
      return undefined;
    },
    // 返回类名绑定对象
    classBingdings() {
      const baseClass = {},
        extendedClass = this.extendedClass;
      // 可以通过覆盖extendedClass计算属性来扩展classBingdings的功能
      if (extendedClass === "object" && extendedClass !== null)
        return Object.assign(baseClass, extendedClass);
      else return baseClass;
    },
    extendedClass() {
      return undefined;
    },
    // 以下的计算属性的作用是，根据props、default值，计算出最终用于绑定的css值
    // 子组件同样可以覆盖下面的这些计算属性，从而改变css值的计算方式
    display() {
      return this.disp !== undefined ? this.disp : this.defaultDisp;
    },
    flexDirection() {
      return this.dir !== undefined ? this.dir : this.defaultDir;
    },
    flexWrap() {
      if (this.wrap === "") return "wrap";
      if (this.wrap === undefined) return this.defaultWrap;
      return this.wrap;
    },
    justifyContent() {
      return this.jc !== undefined ? this.jc : this.defaultJc;
    },
    alignItems() {
      return this.ai !== undefined ? this.ai : this.defaultAi;
    },
    alignContent() {
      return this.ac !== undefined ? this.ac : this.defaultAc;
    },
    flexGrow() {
      if (this.fg !== undefined) return this.fg;
      if (this.computedRigid !== undefined)
        return this.computedRigid ? "0" : "1";
      if (this.$parent.computedCrigid !== undefined)
        return this.$parent.computedCrigid ? "0" : "1";
      return this.defaultFg;
    },
    flexShrink() {
      if (this.fs !== undefined) return this.fs;
      if (this.computedRigid !== undefined)
        return this.computedRigid ? "0" : "1";
      if (this.$parent.computedCrigid !== undefined)
        return this.$parent.computedCrigid ? "0" : "1";
      return this.defaultFs;
    },
    computedRigid() {
      if (this.rigid !== undefined) return this.rigid;
      return this.defaultRigid;
    },
    computedCrigid() {
      if (this.crigid !== undefined) return this.crigid;
      return this.defaultCrigid;
    },
    flexBasis() {
      return this.fb !== undefined ? this.fb : this.defaultFb;
    },
    alignSelf() {
      return this.as !== undefined ? this.as : this.defaultAs;
    },
    width() {
      if (this.w !== undefined) return this.w;
      if (this.$parent.cw !== undefined) return this.$parent.cw;
      if (this.$parent.defaultCw) return this.$parent.defaultCw;
      if (this.defaultW) return this.defaultW;
    },
    minWidth() {
      if (this.mnw !== undefined) return this.mnw;
      if (this.$parent.cmnw !== undefined) return this.$parent.cmnw;
      if (this.$parent.defaultCmnw) return this.$parent.defaultCmnw;
      if (this.defaultMnw) return this.defaultMnw;
    },
    maxWidth() {
      if (this.mxw !== undefined) return this.mxw;
      if (this.$parent.cmxw !== undefined) return this.$parent.cmxw;
      if (this.$parent.defaultCmxw) return this.$parent.defaultCmxw;
      if (this.defaultMxw) return this.defaultMxw;
    },
    height() {
      if (this.h !== undefined) return this.h;
      if (this.$parent.ch !== undefined) return this.$parent.ch;
      if (this.$parent.defaultCh) return this.$parent.defaultCh;
      if (this.defaultH) return this.defaultH;
    },
    minHeight() {
      if (this.mnh !== undefined) return this.mnh;
      if (this.$parent.cmnh !== undefined) return this.$parent.cmnh;
      if (this.$parent.defaultCmnh) return this.$parent.defaultCmnh;
      if (this.defaultMnh) return this.defaultMnh;
    },
    maxHeight() {
      if (this.mxh !== undefined) return this.mxh;
      if (this.$parent.cmxh !== undefined) return this.$parent.cmxh;
      if (this.$parent.defaultCmxh) return this.$parent.defaultCmxh;
      if (this.defaultMxh) return this.defaultMxh;
    },
    marginTop() {
      if (this.mt !== undefined) return this.mt;
      if (this.$parent.cmt !== undefined) return this.$parent.cmt;
      if (this.$parent.defaultCmt) return this.$parent.defaultCmt;
      if (this.defaultMt) return this.defaultMt;
    },
    marginRight() {
      if (this.mr !== undefined) return this.mr;
      if (this.$parent.cmr !== undefined) return this.$parent.cmr;
      if (this.$parent.defaultCmr) return this.$parent.defaultCmr;
      if (this.defaultMr) return this.defaultMr;
    },
    marginBottom() {
      if (this.mb !== undefined) return this.mb;
      if (this.$parent.cmb !== undefined) return this.$parent.cmb;
      if (this.$parent.defaultCmb) return this.$parent.defaultCmb;
      if (this.defaultMb) return this.defaultMb;
    },
    marginLeft() {
      if (this.ml !== undefined) return this.ml;
      if (this.$parent.cml !== undefined) return this.$parent.cml;
      if (this.$parent.defaultCml) return this.$parent.defaultCml;
      if (this.defaultMl) return this.defaultMl;
    },
    paddingTop() {
      if (this.pt !== undefined) return this.pt;
      if (this.$parent.cpt !== undefined) return this.$parent.cpt;
      if (this.$parent.defaultCpt) return this.$parent.defaultCpt;
      if (this.defaultPt) return this.defaultPt;
    },
    paddingRight() {
      if (this.pr !== undefined) return this.pr;
      if (this.$parent.cpr !== undefined) return this.$parent.cpr;
      if (this.$parent.defaultCpr) return this.$parent.defaultCpr;
      if (this.defaultPr) return this.defaultPr;
    },
    paddingBottom() {
      if (this.pb !== undefined) return this.pb;
      if (this.$parent.cpb !== undefined) return this.$parent.cpb;
      if (this.$parent.defaultCpb) return this.$parent.defaultCpb;
      if (this.defaultPb) return this.defaultPb;
    },
    paddingLeft() {
      if (this.pl !== undefined) return this.pl;
      if (this.$parent.cpl !== undefined) return this.$parent.cpl;
      if (this.$parent.defaultCpl) return this.$parent.defaultCpl;
      if (this.defaultPl) return this.defaultPl;
    },
    lineHeight() {
      return this.lh !== undefined ? this.lh : this.defaultLh;
    }
  }
};
</script>
