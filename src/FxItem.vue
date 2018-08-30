
<script>
import FxRow from "./FxRow";
export default {
  name: "FxItem",
  extends: FxRow,
  props: {
    // 如果rigid设为true，那么flex-grow和flex-shrink都为"0"（无弹性）
    // 这个属性仅仅是为了方便和语义化而设计的
    rigid: {
      type: Boolean,
      default: undefined
    },
    // 声明这个item同时也是一个FxRow容器
    isRow: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      defaultIsRow: false
    };
  },
  computed: {
    flexGrow() {
      if (this.fg !== undefined) return this.fg;
      if (this.rigid !== undefined) return this.rigid ? "0" : "1";
      if (this.$parent.computedCrigid !== undefined)
        return this.$parent.computedCrigid ? "0" : "1";
      return this.defaultFg;
    },
    flexShrink() {
      if (this.fs !== undefined) return this.fs;
      if (this.rigid !== undefined) return this.rigid ? "0" : "1";
      if (this.$parent.computedCrigid !== undefined)
        return this.$parent.computedCrigid ? "0" : "1";
      return this.defaultFs;
    },
    display() {
      if (this.disp !== undefined) return this.disp;
      if (!this.computedIsRow) return "block";
      return this.defaultDisp;
    },
    computedIsRow() {
      if (this.isRow !== undefined) return this.isRow;
      return this.defaultIsRow;
    },
    computedCrigid() {
      if (this.crigid !== undefined && this.computedIsRow) return this.crigid;
      return this.defaultCrigid;
    }
  }
};
</script>
