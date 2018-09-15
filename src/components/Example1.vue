<template>
  <section>
    <h1>flex containers and flex items</h1>
    <section>
      <h2>&lt;fx-row&gt; with &lt;fx-item&gt;</h2>
      <fx-row>
        <fx-item>item1</fx-item>
        <fx-item>item2</fx-item>
        <fx-item>item3</fx-item>
        <fx-item>item4</fx-item>
      </fx-row>
    </section>

    <section>
      <h2>&lt;fx-col&gt; with &lt;fx-item&gt;</h2>
      <fx-col>
        <fx-item>item1</fx-item>
        <fx-item>item2</fx-item>
        <fx-item>item3</fx-item>
        <fx-item>item4</fx-item>
      </fx-col>
    </section>

    <section>
      <h2>&lt;fx-row&gt; can be an item, which contains other items</h2>
      <fx-col>
        <fx-item>item1</fx-item>
        <fx-row>
          <fx-item>item2</fx-item>
          <fx-item>item3</fx-item>
        </fx-row>
        <fx-item>item4</fx-item>
      </fx-col>
    </section>

    <section>
      <h2>&lt;fx-col&gt; can be an item, which contains other items</h2>
      <fx-row>
        <fx-item>item1</fx-item>
        <fx-col>
          <fx-item>item2</fx-item>
          <fx-item>item3</fx-item>
          <fx-item>item4</fx-item>
        </fx-col>
        <fx-item>item5</fx-item>
      </fx-row>
    </section>
  </section>

</template>

<script>
export default {
  name: "Example1"
};
</script>
