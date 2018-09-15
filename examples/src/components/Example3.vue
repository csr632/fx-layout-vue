<template>
  <section>
    <h1>hoist children's common css property to their parent</h1>

    <section>
      <h2>hoist margin-right, margin-bottom and rigid</h2>
      <fx-col cmb="16px">
        <fx-row cmr="8px"
                crigid>
          <fx-item>item1</fx-item>
          <fx-item>item2</fx-item>
          <fx-item>item3</fx-item>
          <fx-item>item4</fx-item>
        </fx-row>

        <fx-row cmr="8px"
                crigid>
          <fx-item>item1</fx-item>
          <fx-item>item2</fx-item>
          <fx-item>item3</fx-item>
          <fx-item>item4</fx-item>
        </fx-row>

        <fx-row cmr="8px"
                crigid>
          <fx-item>item1</fx-item>
          <fx-item>item2</fx-item>
          <fx-item>item3</fx-item>
          <fx-item>item4</fx-item>
        </fx-row>
      </fx-col>
    </section>
  </section>
</template>
