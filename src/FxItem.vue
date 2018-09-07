
<script>
import FxRow from "./FxRow";
export default {
  name: "FxItem",
  extends: FxRow,
  props: {
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
    display() {
      if (this.disp !== undefined) return this.disp;
      if (!this.computedIsRow) return "block";
      return this.defaultDisp;
    },
    computedIsRow() {
      if (this.isRow !== undefined) return this.isRow;
      return this.defaultIsRow;
    }
  }
};
</script>
