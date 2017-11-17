<template>
  <div class="aeris-validation-product-host">
   <!-- <div class="aeris-validation-product-component-container">-->
      <div class="aeris-validation-product-navbar">
         <header style="background: #4765a0;"><h3> <i class="fa fa-area-chart"></i>&nbsp
         Serie available 
       </h3></header>
        <div class="aeris-validation-product-list">         
          <div class="aeris-validation-product-item" v-for="serieName in serieListe" >
            {{serieName}}
          </div>
        </div>
      </div>
      <div class="aeris-validation-product-validation-panel">
      <header style="background: #4765a0;">
        <h3 > <i class="fa fa-cogs"></i>&nbsp
          Nephelometer time series for the Pic du Midi (65) station 
        </h3>
      </header>
           <aeris-day-images service="https://sedoo.aeris-data.fr/actris-validation-rest/rest/validation/daily?uuid=91440f71-9c3e-5d31-befc-2729873ce581&day=" lang="fr"></aeris-day-images>

     
      </div>
   <!-- </div>-->
  </div>
</template>

<script>

export default {
    props: {
      
  },

  data() {

    return {
       serieListe :["Nephelometer time series for the Pic du Midi (65) station",                    
                   ]
    }
  },
}
</script>

<style>

.tesst {
  background: red
}

.aeris-validation-product-host {
 
 min-height: 500px;
 color: #333;
 font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
 font-size: 1rem;
 line-height: 1.7;
 border: solid 1px black;
 max-width: 1700px;

}
.aeris-validation-product-host h3 {
  text-align:center;  
  color: #fff; 
  margin-top:0; 
  height: 2.6rem;
  margin-bottom:15px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

}
.aeris-validation-product-component-container {
  min-height: 500px;
   
}

.aeris-validation-product-navbar {
  float:left;
  max-width: 200px;
  min-height: 500px;
  margin-right: 20px;
}

.aeris-validation-product-list {
/* padding:10px;*/
}

.aeris-validation-product-item {
  max-width: 200px;
  padding: 10px;
  background-color: #ddd;
  color: #555;
  border: none;
  cursor: pointer;
  margin: 0px 10px 15px;
  /*box-shadow: 5px 5px 10px #555;
 */
}

.aeris-validation-product-list .active {
  background-color: orange;
  color: #fff
}

.aeris-validation-product-validation-panel {

margin-left: 220px;
}


</style>
