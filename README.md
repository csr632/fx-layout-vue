# Fx布局组件实现报告

# 困难：
页面中有大量表单控件和label，几乎每个控件都需要单独定制大小（min-width、max-width、width）、位置（margin-right、padding-left、display:flex、justify-content:center等），因此需要写**大量的布局代码**。

[iview的布局组件](https://www.iviewui.com/components/grid#API)只是提供了2个简单的flex容器（`Row`和`Col`），进行大粒度的布局使用它已经足够，但是当需要进行**精细化布局**的时候，使用它仍然无法简化布局代码的书写。

因此我开发了一套布局组件Fx，它蕴含了我在进行精细化布局实践中[总结的经验](https://segmentfault.com/a/1190000016199506)。

# Fx布局组件包含：
1. FxBase 这个组件并不直接用在模板中，它是其它所有Fx组件的“基类”。其它Fx组件通过[extends选项](https://vuejs.org/v2/api/#extends)继承FxBase的所有props、data、computed（若出现重复，则子属性覆盖父属性）。计算样式值、将样式绑定到`div`就是在FxBase中完成的。其它Fx组件都是在FxBase的基础上**调整样式默认值、定义新`props`、覆盖`computed`从而覆盖样式计算的方式**。
2. FxRow 这个组件的语义是“一行”，它的子元素默认是**横向排列**的。它是一个flex容器。在FxBase的基础上提供了声明crigid的功能。
3. FxCol 与FxRow一样，只不过它的子元素默认是**纵向排列**的。
4. FxItem 这个组件的语义是“flex容器中的一项”。默认具有弹性(flex-grow=flex-shrink=1)，可以通过声明rigid使它不具有弹性。默认`display:block`，但是如果声明了`is-row`，它就成为一个flex容器，与FxRow一样。

灵活使用以上三个组件就可以满足绝大多数的布局需求。一般来说使用方式是：
* FxCol容纳行（FxRow），使得FxRow纵向排列。通过cmt调整行之间的**纵向距离**。
* FxRow容纳横向排列的元素（FxItem）流。通过cmr调整元素之间的**横向距离**。
* FxItem容纳具体内容，比如label（纯文字，一般设置为rigid）或者表单输入控件（一般不设置rigid，而是通过width、min/max-width来调整宽度）

# Fx布局组件的主要特性：
1. 属性简写：比如`<fx-row mt="12px">content</fx-row>`，那么这个容器就会拥有`margin-top:12px`的CSS。属性简写还包括mr=>margin-right, cml=>children's margin-left, pt=>padding-top等，更多属性简写可以查看`FxBase`的`styleBindings`方法。属性简写减少了代码的书写并使得模板简洁（前提是熟悉简写属性）。
2. 声明广播：可以在父组件中同时声明**所有子组件**的CSS。**同一个父组件的所有子组件往往拥有一些一致的样式(比如margin-right)**，所以这个功能有助于减少重复的代码。比如
```html
<fx-row cmr="12px">
    <fx-item>content1</fx-item>
    <fx-item>content2</fx-item>
    <fx-item mr="0">content3</fx-item>
</fx-row>
```
`cmr`的意思是children's margin-right，也就是向所有子元素发送margin-right的广播。每个fx-item子元素都会感知到`mr="12px"`，因此前两个`fx-item`拥有`margin-right:12px`的样式。第三个`fx-item`由于**声明了自己的`mr`**，因此会**优先使用自己的声明**，拥有`margin-right:0`的样式。
目前的广播实现原理：当子元素上没有声明`mr`等属性时，它通过[\$parent](https://vuejs.org/v2/api/#vm-parent)获取到父组件，读取其`cmr`属性作为fallback值。
属性广播的深度为一层，也就是说，孙子组件不会去读取爷爷组件的`cmr`。
3. 语义化：`fx-row` `fx-col` `fx-item` `rigid` `is-row` 名称简洁而且具有语义，使得模板的可读性更好。将来添加的属性也应该遵循这个名称。 
4. 可扩展性：使用者可以模仿FxRow的做法，在新组件中使用[extends](https://vuejs.org/v2/api/#extends): FxBase 选项，在继承FxBase特性的同时，还能为新组件增加自定义的功能（增加/覆盖 computed、data中的默认值、props输入）。我们称FxBase与继承组件之间是**父组件与子组件的关系**。可是既然将样式绑定到`div`是在FxBase中完成的，那如果新增的布局组件（FxBase的子组件）**想要增加新的样式绑定**怎么办呢？这时**不应该直接修改FxBase的代码**，因为这会影响到**所有**继承FxBase的组件。FxBase已经预先设计好了增加新的样式绑定、类名绑定的方案：在子组件中覆盖`extendedStyle`和`extendedClass`方法，返回需要额外绑定的属性和类名，FxBase会将返回值一并绑定到DOM元素上。

# 原理：props绑定->样式绑定 经过的流程
举个例子，在FxBase中，从`mr`输入到绑定`margin-right`是这样实现的：
定义props。props用于接受输入。
```
mr: {
    type: String,
    default: undefined
},
```
在data中定义默认值:`defaultMr: ""`。它定义了，当props没有输入时(`this.mr===undefined`)应该使用什么默认值。
定义computed方法。computed方法封装了绑定值的计算逻辑：**根据props、default值，计算出最终用于绑定的css值**。
```
marginRight() {
  if (this.mr !== undefined) return this.mr;
  if (this.$parent.cmr !== undefined) return this.$parent.cmr;
  if (this.$parent.defaultCmr) return this.$parent.defaultCmr;
  if (this.defaultMr) return this.defaultMr;
},
```
在`computed.styleBindings`返回的样式绑定对象中增加:`"margin-right": this.marginRight`。
FxBase的代码基本上全都是在重复这个流程，定义了十几种CSS样式的绑定。

把样式绑定分为以上4个步骤有以下好处。
子组件继承FxBase时，可以覆盖defaultMr或marginRight的环节，就能对绑定结果进行微调。比如子组件只需要在data中用`defaultMr: "2px"`来覆盖父值，就能将"margin-right"的默认值修改为2px。
这也是为什么在定义props的环节，我不在`default`中指定默认值，而是将默认值放在data.defaultMr中。
可以参考[【组件复用性】原型的可扩展性与可增强性](https://segmentfault.com/a/1190000016055635)中对于扩展点粒度的讨论。

# 待改进的地方：
1. 借鉴[iview](https://www.iviewui.com/components/grid#API)，允许声明**响应式**的样式。根据当前的设备宽度，应用不同的绑定。
2. 扩展方案可以设计得更好。在目前的方案下，假设组件A通过[extends选项](https://vuejs.org/v2/api/#extends)继承FxBase并通过覆盖`extendedStyle`方法来扩展了样式绑定，这时，假设组件B想要继承组件A，这时B想要扩展样式绑定就很困难了，因为如果B写提供了`extendedStyle`，它会覆盖掉A的`extendedStyle`！B必须先将A的`extendedStyle`代码复制过来，然后在这个基础上修改代码。
3. FxBase的实现能不能更加自动化?目前，FxBase的代码是有些僵硬的，200行代码几乎都在重复前面讲的【props绑定->样式绑定的流程】。如果能做到这样就更好了：扩展者只需要提供这么一个声明式的对象就能增加一个样式绑定：
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

框架在调用computedFunc时，会传入当时的props.mr值、实例的$parent、defaultValue（如果子组件为相同cssName提供了defaultValue，则传入子组件提供的defaultValue）。这样，所有与这个样式绑定相关的代码集中在一个地方，拥有更好的可读性、可维护性。
4. 我认为[组件可复用性包括**可扩展性**与**可增强性**两个方面](https://segmentfault.com/a/1190000016055635)。前面仅仅讨论了**可扩展性**一个方面，现在我们来讨论一下可增强性。目前，Fx这套组件是无法动态增强的：如果你想要改变FxBase（从而同时影响所有Fx组件）的行为，你就**只能通过修改FxBase的代码**。能不能允许使用者在使用之前根据自己的需要来配置FxBase的行为呢？就像[Vue.mixin( mixin )](https://vuejs.org/v2/api/#Vue-mixin)一样。比如，使用者想要为**所有Fx组件**（包括FxRow等）增加`background-color`的绑定属性。通过[extends](https://vuejs.org/v2/api/#extends)创建一个新组件无法达到这个效果，因为extends不会改变父组件的功能，FxRow依然不会具有这个功能。这就是**可扩展性**的局限性所在。如何提供**可增强性**呢？我目前的想法是，使用者在调用[Vue.use(FxPlugin, { someOption: {} })](https://vuejs.org/v2/guide/plugins.html#Using-a-Plugin)的时候，FxPlugin会全局注册Fx组件，注册之前根据someOption的配置来修改FxBase的组件选项。
5. 能不能做到深层的广播（不过，深层广播目前没有想到很好的使用场景）？深层广播本质上来说是**vue组件与自己的子组件树进行通信**。在这里，“子组件”**不是**【子组件出现在父组件的模板中】的意思，而是【**子组件出现在父组件的slot中**】的意思。
    > 举个例子，假设ABC都是Vue组件，在`<A> <B></B><C></C> </A>`的场景下，B和C都出现在了A的`<slot>`中，因此`B.$parent` `C.$parent`都指向A组件实例。
我目前想到的方案是通过`$parent`不断向上查找，类似于原型链。不过当组件层次比较深的时候，可能会出现性能问题。

