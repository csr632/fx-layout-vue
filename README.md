# fx-layout 布局组件

`fx-layout`是一套 Vue 组件，它是为了方便使用 flex 进行大量精细化布局而设计的。它能够减少使用者的输入、方便使用者在模板中调整常用的样式，并提供了一定的可扩展性。

## 使用方法

1. 安装 fx-layout-vue 作为依赖：

```bash
npm install --save fx-layout-vue
```

2. 创建第一个 Vue 实例之前(一般是在`main.js`入口文件中)，在 Vue 构造函数上安装 fx-layout-vue 插件：

```js
import FxLayout from "fx-layout-vue";
Vue.use(FxLayout);
```

3. 现在就可以在 Vue 模板中可以使用 FxRow、FxCol、FxItem(或 fx-row、fx-col、fx-item)了!

```html
<template>
  <fx-row wrap>
    <fx-item is-row>
      <fx-item rigid>
        字段1：
      </fx-item>
      <fx-item>
        {{ data }}
      </fx-item>
    </fx-item>
    <fx-item is-row>
      <fx-item rigid>
        字段2：
      </fx-item>
      <fx-item>
        {{ data }}
      </fx-item>
    </fx-item>
  </fx-row>
</template>
```

## 使用背景

页面中有大量表单控件和 label，几乎每个控件都需要单独定制大小（min-width、max-width、width）、位置（margin-right、padding-left、display:flex、justify-content:center 等），因此需要写**大量的布局代码**。

[iview 的布局组件](https://www.iviewui.com/components/grid#API)只是提供了 2 个简单的 flex 容器（`Row`和`Col`），进行大粒度的布局使用它已经足够，但是当需要进行**精细化布局**的时候，使用它仍然无法简化布局代码的书写。

因此我开发了一套布局组件 Fx，它蕴含了我在进行精细化布局实践中[总结的经验](https://segmentfault.com/a/1190000016199506)。

## Fx 套件的组成

1. FxBase 这个组件并不直接用在模板中，它是其它所有 Fx 组件的“基类”。其它 Fx 组件通过[extends 选项](https://vuejs.org/v2/api/#extends)继承 FxBase 的所有 props、data、computed（若出现重复，则子属性覆盖父属性）。计算样式值、将样式绑定到`div`就是在 FxBase 中完成的。其它 Fx 组件都是在 FxBase 的基础上**调整样式默认值、定义新`props`、覆盖`computed`从而覆盖样式计算的方式**。
2. FxRow 这个组件的语义是“一行”，它的子元素默认是**横向排列**的。它是一个 flex 容器。在 FxBase 的基础上提供了声明 crigid 的功能。
3. FxCol 与 FxRow 一样，只不过它的子元素默认是**纵向排列**的。
4. FxItem 这个组件的语义是“flex 容器中的一项”。默认具有弹性(flex-grow=flex-shrink=1)，可以通过声明 rigid 使它不具有弹性。默认`display:block`，但是如果声明了`is-row`，它就成为一个 flex 容器，与 FxRow 一样。

灵活使用以上三个组件就可以满足绝大多数的布局需求。一般来说使用方式是：

- FxCol 容纳行（FxRow），使得 FxRow 纵向排列。通过 cmt 调整行之间的**纵向距离**。
- FxRow 容纳横向排列的元素（FxItem）流。通过 cmr 调整元素之间的**横向距离**。
- FxItem 容纳具体内容，比如 label（纯文字，一般设置为 rigid）或者表单输入控件（一般不设置 rigid，而是通过 width、min/max-width 来调整宽度）

## Fx 组件的主要特性

1. 属性简写：比如`<fx-row mt="12px">content</fx-row>`，那么这个容器就会拥有`margin-top:12px`的 CSS。属性简写还包括 mr=>margin-right, cml=>children's margin-left, pt=>padding-top 等，更多属性简写可以查看`FxBase`的`styleBindings`方法。属性简写减少了代码的书写并使得模板简洁（前提是熟悉简写属性）。
2. 声明广播：可以在父组件中同时声明**所有子组件**的 CSS。**同一个父组件的所有子组件往往拥有一些一致的样式(比如 margin-right)**，所以这个功能有助于减少重复的代码。比如

```html
<fx-row cmr="12px">
    <fx-item>content1</fx-item>
    <fx-item>content2</fx-item>
    <fx-item mr="0">content3</fx-item>
</fx-row>
```

`cmr`的意思是 children's margin-right，也就是向所有子元素发送 margin-right 的广播。每个 fx-item 子元素都会感知到父元素的广播，因此前两个`fx-item`拥有`margin-right:12px`的样式。第三个`fx-item`由于**声明了自己的`mr`**，因此会**优先使用自己的声明**，拥有`margin-right:0`的样式。

目前的广播实现原理：当子元素上没有声明`mr`等属性时，它通过[\$parent](https://vuejs.org/v2/api/#vm-parent)获取到父组件，读取其`cmr`属性作为 fallback 值。

属性广播的深度为一层，也就是说，孙子组件不会去读取爷爷组件的`cmr`。

3. 语义化：`fx-row` `fx-col` `fx-item` `rigid` `is-row` 名称简洁而且具有语义，使得模板的可读性更好。将来添加的属性也应该遵循这个名称。
4. 可扩展性：使用者可以模仿 FxRow 的做法，在新组件中使用[extends](https://vuejs.org/v2/api/#extends): FxBase 选项，在继承 FxBase 特性的同时，还能为新组件增加自定义的功能（增加/覆盖 computed、data 中的默认值、props 输入）。我们称 FxBase 与继承组件之间是**父组件与子组件的关系**。可是既然将样式绑定到`div`是在 FxBase 中完成的，那如果新增的布局组件（FxBase 的子组件）**想要增加新的样式绑定**怎么办呢？这时**不应该直接修改 FxBase 的代码**，因为这会影响到**所有**继承 FxBase 的组件。FxBase 已经预先设计好了增加新的样式绑定、类名绑定的方案：在子组件中覆盖`extendedStyle`和`extendedClass`方法，返回需要额外绑定的属性和类名，FxBase 会将返回值一并绑定到 DOM 元素上。

## 原理：props 绑定->样式绑定 经过的流程

举个例子，在 FxBase 中，从`mr`输入到绑定`margin-right`是这样实现的：

1. 定义 props。props 用于接受输入。

```
mr: {
    type: String,
    default: undefined
},
```

2. 在 data 中定义默认值:`defaultMr: ""`。它定义了，当 props 没有输入时(`this.mr===undefined`)应该使用什么默认值。
3. 定义 computed 方法。computed 方法封装了绑定值的计算逻辑：**根据 props、default 值，计算出最终用于绑定的 css 值**。

```
marginRight() {
  if (this.mr !== undefined) return this.mr;
  if (this.$parent.cmr !== undefined) return this.$parent.cmr;
  if (this.$parent.defaultCmr) return this.$parent.defaultCmr;
  if (this.defaultMr) return this.defaultMr;
},
```

4. 在`computed.styleBindings`返回的样式绑定对象中增加:`"margin-right": this.marginRight`。

FxBase 的代码基本上全都是在重复这个流程，定义了十几种 CSS 样式的绑定。

把样式绑定分为以上 4 个步骤有以下好处：

子组件继承 FxBase 时，可以覆盖 defaultMr 或 marginRight 的环节，就能对绑定结果进行微调。比如子组件只需要在 data 中用`defaultMr: "2px"`来覆盖父值，就能将"margin-right"的默认值修改为 2px。

这也是为什么在定义 props 的环节，我不在`default`中指定默认值，而是将默认值放在 data.defaultMr 中。

可以参考[【组件复用性】原型的可扩展性与可增强性](https://segmentfault.com/a/1190000016055635)中对于扩展点粒度的讨论。

## 待改进的地方

1. 借鉴[iview](https://www.iviewui.com/components/grid#API)，允许声明**响应式**的样式。根据当前的设备宽度，应用不同的绑定。
2. 扩展方案可以设计得更好。在目前的方案下，假设组件 A 通过[extends 选项](https://vuejs.org/v2/api/#extends)继承 FxBase 并通过覆盖`extendedStyle`方法来扩展了样式绑定，这时，假设组件 B 想要继承组件 A，这时 B 想要扩展样式绑定就很困难了，因为如果 B 写提供了`extendedStyle`，它会覆盖掉 A 的`extendedStyle`！B 必须先将 A 的`extendedStyle`代码复制过来，然后在这个基础上修改代码。
3. FxBase 的实现能不能更加自动化?目前，FxBase 的代码是有些僵硬的，200 行代码几乎都在重复前面讲的【props 绑定->样式绑定的流程】。如果能做到这样就更好了：扩展者只需要提供这么一个声明式的对象就能增加一个样式绑定：

```
{
  cssName: "margin-right",
  shorthand: "mr",
  defaultValue: "",
  computedFunc: (propValue, $parent, defaultValue) => {
    if (propValue !== undefined) return propValue;
    if ($parent.cmr !== undefined) return $parent.cmr;
    if ($parent.defaultCmr) return $parent.defaultCmr;
    if (defaultValue) return defaultValue;
  }
}
```

框架在调用 computedFunc 时，会传入当时的 props.mr 值、实例的$parent、defaultValue（如果子组件为相同 cssName 提供了 defaultValue，则传入子组件提供的 defaultValue）。这样，所有与这个样式绑定相关的代码集中在一个地方，拥有更好的可读性、可维护性。

4. 我认为[组件可复用性包括**可扩展性**与**可增强性**两个方面](https://segmentfault.com/a/1190000016055635)。前面仅仅讨论了**可扩展性**一个方面，现在我们来讨论一下可增强性。目前，Fx 这套组件是无法动态增强的：如果你想要改变 FxBase（从而同时影响所有 Fx 组件）的行为，你就**只能通过修改 FxBase 的代码**。能不能允许使用者在使用之前根据自己的需要来配置 FxBase 的行为呢？就像[Vue.mixin( mixin )](https://vuejs.org/v2/api/#Vue-mixin)一样。比如，使用者想要为**所有 Fx 组件**（包括 FxRow 等）增加`background-color`的绑定属性。通过[extends](https://vuejs.org/v2/api/#extends)创建一个新组件无法达到这个效果，因为 extends 不会改变父组件的功能，FxRow 依然不会具有这个功能。这就是**可扩展性**的局限性所在。如何提供**可增强性**呢？我目前的想法是，使用者在调用[Vue.use(FxPlugin, { someOption: {} })](https://vuejs.org/v2/guide/plugins.html#Using-a-Plugin)的时候，FxPlugin 会全局注册 Fx 组件，注册之前根据 someOption 的配置来修改 FxBase 的组件选项。
5. 能不能做到深层的广播（不过，深层广播目前没有想到很好的使用场景）？深层广播本质上来说是**vue 组件与自己的子组件树进行通信**。在这里，“子组件”**不是**【子组件出现在父组件的模板中】的意思，而是【**子组件出现在父组件的 slot 中**】的意思。 > 举个例子，假设 ABC 都是 Vue 组件，在`<A> <B></B><C></C> </A>`的场景下，B 和 C 都出现在了 A 的`<slot>`中，因此`B.$parent` `C.$parent`都指向 A 组件实例。
   我目前想到的方案是通过`$parent`不断向上查找，类似于原型链。不过当组件层次比较深的时候，可能会出现性能问题。
