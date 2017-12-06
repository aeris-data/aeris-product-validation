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
          <div  class="aeris-validation-product-item" v-for="serie in serieListe"   @click="activeSerie " :data-uuid ="serie.uuid" :data-date-format="serie.date_format">
            {{serie.name}} 
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
      serieUuid:"",
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

      serieListe :[
                   { name: "Nephelometer time series for the Pic du Midi (65) station", uuid: "91440f71-9c3e-5d31-befc-2729873ce581", date_format:'LL' },
                   { name: "Radar VHF time series for the Centre de Recherche Atmospheriques de Lannemezan (65) station", uuid :"4f92fdf2-d518-52a3-897e-2df1ed7af750",date_format:'MMMM YYYY'}                    
      ],
      
      orcid : {
        type:String,
        
      },
      
    }
  },
 

 

  created : function () {
  
  this.orcid="none"
  this.displayValidation=false

  
  document.addEventListener("aerisOrcidResponse", this.checkOrcidForvalidation.bind(this));
  var eventOrcid = new CustomEvent('aerisOrcidRequest');
  document.dispatchEvent(eventOrcid)
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
      var _this=this
      this.serieUuid= clickedElement.getAttribute("data-uuid");
      console.log(this.serieUuid)
      var uuidPara =  "uuid="+this.serieUuid+"&day="
      this.serviceUrl="https://sedoo.aeris-data.fr/actris-datacenter-rest/rest/validation/daily?"+uuidPara
      this.viewElement = document.querySelector('aeris-day-images');
      this.viewElement.setAttribute("service", this.serviceUrl);
      this.viewElement.setAttribute("date_format", clickedElement.getAttribute("data-date-format"));
      this.displayValidation=true
      this.getLabelValue();
    },
    
     getUuid : function (uuid) {
       return uuid
     },

    getLabelValue : function(uuid){
     
     var url_o = "https://sedoo.aeris-data.fr/actris-datacenter-rest/rest/quality/flags/"
     
     var service = url_o + "91440f71-9c3e-5d31-befc-2729873ce581"
      $.when(
            $.ajax({
            url: service,
            data: "",
            contentType: "application/json; charset=utf-8", 
            type: "GET",
            success: function (data) {
               console.log("ajax request for label quality ok ");     
            },
            error: function (x, y, z) {
               alert(x.responseText +"  " +x.status);
            }
        })).then(function (resp){       
            var event = new CustomEvent('getFlage', { 'detail': resp })
            document.dispatchEvent(event);
            });
            
    }
  

  },

  

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
[id="breadcrumbs"] > div::before {
  display:none;
}
.serieActive{
  background-color: #555;
  color: #fff;
  box-shadow: none
}
</style>
