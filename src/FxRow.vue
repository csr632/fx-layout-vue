<script>
import FxBase from "./FxBase";
// 添加继承性的属性时可以参考crigid的做法。
// 注意Fxitem在isRow===true时应该等同于FxRow，因此也有crigid的功能。
export default {
  name: "FxRow",
  extends: FxBase
};
</script>
