import FxBase from "./FxBase.vue";
import FxRow from "./FxRow.vue";
import FxCol from "./FxCol.vue";
import FxItem from "./FxItem.vue";

const FxPlugin = {
  install(Vue, options) {
    // duplicate installation
    if (FxPlugin.installed) return;
    
    // 全局注册组件
    Vue.component("FxBase", FxBase);
    Vue.component("FxRow", FxRow);
    Vue.component("FxCol", FxCol);
    Vue.component("FxItem", FxItem);

    FxPlugin.installed = true;
  }
};

export default FxPlugin;
