<template>
  <div class="aeris-validation-product-host">
    <div class="aeris-validation-product-component-container" v-if="orcid !='none'">
      <div class="aeris-validation-product-navbar">
        <header style="background: #4765a0;">
          <h3>
            <i class="fa fa-area-chart"></i>&nbsp Serie available
          </h3>
        </header>
        <div class="aeris-validation-product-list">
          <div class="aeris-validation-product-item" v-for="serieName in serieListe"   @click="activeSerie">
            {{serieName}}
          </div>
        </div>
      </div>
      <div class="aeris-validation-product-validation-panel" v-show="displayValidation">
        <header style="background: #4765a0;">
          <h3>
            <i class="fa fa-cogs"></i>&nbsp {{SerieTitle}}
          </h3>
        </header>
        <aeris-day-images lang="fr" ></aeris-day-images>
        <!--"https://sedoo.aeris-data.fr/actris-datacenter-rest/rest/validation/daily?uuid=91440f71-9c3e-5d31-befc-2729873ce581&day="-->
      </div>
    </div>

    <div v-else>
      <h1> Please login with your OrcID before start validation</h1>
    </div>
  </div>
</template>

<script>

export default {
    props: {
      
  },

  data() {

    return {
      theme: null,
      aerisThemeListener: null,
      view: null,
      serviceUrl : "",
      displayValidation: {
        type:Boolean,
        default:false
      },

      isclassActive: false,

      SerieTitle:"",

      serieListe :["Nephelometer time series for the Pic du Midi (65) station",
                   "Radar VHF time series for the Centre de Recherche Atmospheriques de Lannemezan (65) station",       
                   "Radar VHF"                   
                   ],
      
      orcid : {
        type:String,
        
      },
      
    }
  },
 mounted: function() {
    var event = new CustomEvent('aerisThemeRequest', {});
    document.dispatchEvent(event);
  },

 destroyed: function() {
    document.removeEventListener('aerisTheme', this.aerisThemeListener);
    this.aerisThemeListener = null;
  },

  created : function () {

  this.orcid="none"
  this.displayValidation=false

  this.aerisThemeListener = this.handleTheme.bind(this);
  document.addEventListener('aerisTheme', this.aerisThemeListener);
  
  document.addEventListener("aerisOrcidResponse", this.checkOrcidForvalidation.bind(this));
  var eventOrcid = new CustomEvent('aerisOrcidRequest');
  document.dispatchEvent(eventOrcid)
},


updated: function() {
    this.ensureTheme();
  },

  

  methods : {

    checkOrcidForvalidation: function(e) {
   
      if (typeof(e.detail.user.orcid) != "undefined") {
        console.log("orcid : " + e.detail.user.orcid)
        this.orcid = e.detail.user.orcid
      } else {
        console.log("orcid is undefined")
      }
    },
  
    activeSerie: function(e) {
      var clickedElement = e.target;
      
      $(clickedElement).siblings().removeClass('serieActive');
      $(clickedElement).addClass('serieActive');
      this.SerieTitle = $(clickedElement).text()
  
      this.serviceUrl="https://sedoo.aeris-data.fr/actris-datacenter-rest/rest/validation/daily?uuid=91440f71-9c3e-5d31-befc-2729873ce581&day="
      this.viewElement = document.querySelector('aeris-day-images');
      this.viewElement.setAttribute("service", this.serviceUrl);
      this.displayValidation=true
    },
    
    handleTheme: function(event) {
      console.log("handletheme ======= ")
      console.log(event.detail)
      this.theme = event.detail;
      this.ensureTheme();
    },

    ensureTheme: function() {
      
        document.querySelector("header h3 i").style.color = this.theme.primary;
      
    }
  }


}
</script>

<style>


.aeris-validation-product-host {

  min-height: 500px;
  color: #333;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.7;
}

 h3 {
  
  color: #fff;
  margin-top: 0;
  height: 2.6rem;
  margin-bottom: 0px;
  text-align: center;
  display: flex;
  align-items: center;
  padding-left:15px
}

.aeris-validation-product-component-container {
  min-height: 500px;
}

.aeris-validation-product-navbar {
  float: left;
  max-width: 410px;
  min-height: 500px;
  margin-right: 20px;
  background-color: #f5f5f5;
}

.aeris-validation-product-list {
  /* padding:10px;*/
}

.aeris-validation-product-item {
  
  padding: 20px;
  background-color: #f5f5f5;
  color: #727272;
  cursor: pointer;
  margin: 0px 0px;
  border-bottom: 1px solid #ddd;
  

}

/*.aeris-validation-product-list .active {
  background-color: orange;
  color: #fff
}*/

.aeris-validation-product-validation-panel {
  float: right;

}

.page-template-template-fullwidth article .wrapper-content, .page-template-template-fullwidth [id="content-area"] {
    padding: 0;
}

[id="breadcrumbs"] > div::after{
  display: none;
}
.serieActive{
  background-color: #555;
  color: #fff;
  box-shadow: none
}
</style>
