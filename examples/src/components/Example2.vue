<template>
  <section>
    <h1>set css property easily with abbreviated props</h1>
    <section>
      <h2>set flex-releated css</h2>
      <fx-col>
        <fx-item>item1</fx-item>
        <fx-row jc="space-between">
          <fx-item fg="0"
                   fs="0">item2</fx-item>
          <fx-item fg="0"
                   fs="0">item3</fx-item>
        </fx-row>
        <fx-item>item4</fx-item>
      </fx-col>
    </section>

    <section>
      <h2>
        <code>rigid</code> is same as
        <code>fg="0" fs="0"</code>, but more intuitive
      </h2>
      <fx-col>
        <fx-item>item1</fx-item>
        <fx-row jc="space-between">
          <fx-item rigid>item2</fx-item>
          <fx-item rigid>item3</fx-item>
        </fx-row>
        <fx-item>item4</fx-item>
      </fx-col>
    </section>

    <section>
      <h2>many other frequently-used css property can also be set using props</h2>
      <fx-row>
        <fx-item rigid
                 w="30%"
                 pb="30%"
                 mr="5%"
                 class="bordered"></fx-item>
        <fx-item rigid
                 w="30%"
                 pb="30%"
                 mr="5%"
                 class="bordered"></fx-item>
        <fx-item rigid
                 w="30%"
                 pb="30%"
                 class="bordered"></fx-item>
      </fx-row>

    </section>

  </section>
</template>

<style scoped>
.bordered {
  border: 2px solid black;
  box-sizing: border-box;
}
</style>
