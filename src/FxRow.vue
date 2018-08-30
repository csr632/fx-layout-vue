<script>
import FxBase from "./FxBase";
// 添加继承性的属性时可以参考crigid的做法。
// 注意Fxitem在isRow===true时应该等同于FxRow，因此也有crigid的功能。
export default {
  name: "FxRow",
  extends: FxBase,
  props: {
    // 影响子组件FxItem的flexGrow和flexShrink
    crigid: {
      type: Boolean,
      default: undefined
    }
  },
  data() {
    return {
      // 设置为undefined而不是false的原因：
      // undefined的语义是“我不决定”。
      // 一般来说，fallback(default)属性不应该说“我不决定”，
      // 但是因为这个defaultCrigid之下还有defaultFg作为fallback(备胎)，(见FxItem的flexGrow方法)
      // 所以“defaultCrigid不决定”意味着交给defaultFg来决定。
      // 假设defaultCrigid设定了一个值，那么defaultFg将永远不会被用到。
      // 见FxItem的flexGrow()代码
      defaultCrigid: undefined
    };
  },
  computed: {
    computedCrigid() {
      if (this.crigid !== undefined) return this.crigid;
      return this.defaultCrigid;
    }
  }
};
</script>
