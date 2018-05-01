<template>
  <div class="aeris-validation-product-host">
    <div class="aeris-validation-product-component-container" v-if="orcid !='none'">
      <div class="aeris-validation-product-navbar">
        <header style="background: #4765a0;">
          <h3 style="clear:none">
            <i class="fa fa-area-chart"></i>&nbsp Serie available
          </h3>
        </header>
        <div class="aeris-validation-product-list">
          <div  class="aeris-validation-product-item" :class="{serieActive:selected == index}" v-for="(serie,index) in instrumentListeUUIDByName"   @click="selected = index;activeSerie(serie) " :data-uuid ="serie.uuid" :data-date-format="serie.date_format">
            {{serie.name}} 
          </div>
        </div>
      </div>
      
      <div class="aeris-validation-product-validation-panel" >
        <header style="background: #4765a0;">
          <h3 style="clear:none">
            <i class="fa fa-cogs"></i>&nbsp {{SerieTitle}}
          </h3>
        </header>
        <aeris-day-images service="https://sedoo.aeris-data.fr/actris-datacenter-rest/rest/validation/dailydetail?uuid=91440f71-9c3e-5d31-befc-2729873ce581&day=2018-04-10"lang="fr" ></aeris-day-images>
<!--        <aeris-day-images service="http://localhost:9080/actris-datacenter-rest/rest/validation/daily?uuid=91440f71-9c3e-5d31-befc-2729873ce581&day="lang="fr" ></aeris-day-images>
-->        <!--"https://sedoo.aeris-data.fr/actris-datacenter-rest/rest/validation/daily?uuid=91440f71-9c3e-5d31-befc-2729873ce581&day="-->
      </div>
    </div>


     <div class="aeris-information-loggin" v-else>
       <h1>Authentification required</h1> 
       <p>You must be logged in to access to the data validation.</p>
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
      instrumentListeUUIDByName:[],
      instrumentUUIDListe:[],
      instrumentNameListe:[],
      isclassActive: false,
      instrumentInfo :"",
      SerieTitle:"",
      orcid : {
        type:String,
      },
      selected:0,
      toto:[]
    }
  },
 

  created : function () {

    this.orcid="none"
    this.displayValidation=false
    document.addEventListener("aerisOrcidResponse", this.checkOrcidForvalidation.bind(this));
    var eventOrcid = new CustomEvent('aerisOrcidRequest');
    document.dispatchEvent(eventOrcid)
    
   
  },

  mounted : function () {
   
         
  },

  methods : {

    checkOrcidForvalidation: function(e) {
   
      if (typeof(e.detail.user.orcid) != "undefined") {
        console.log("orcid : " + e.detail.user.orcid)
        this.orcid = e.detail.user.orcid
        var urlServiceInstrumentUUIIDbyOrcid ="https://sedoo.aeris-data.fr/actris-datacenter-rest/rest/admin/uuids?orcid="+ this.orcid
        this.$http.get(urlServiceInstrumentUUIIDbyOrcid).then(
          (response)=>{ 
                        this.instrumentUUIDListe =response.body;                       
                        for(var i=0;i< response.body.length;i++){
                          this.getInstrumentInfo(this.instrumentUUIDListe[i]) 
                        } 
                      },
          (response)=>{
                        console.log("error")
          });
      } else {
        console.log("orcid is undefined")
      }
    },
  
    activeSerie: function(serie) {
     console.log("active serie ******************************")
     console.log(serie)
      this.SerieTitle = serie.name
      console.log("uuid of selected serie : "+ serie.uuid)
      var uuidPara =  "uuid="+serie.uuid+"&day="
                        
      //this.serviceUrl="http://localhost:9080/actris-datacenter-rest/rest/validation/daily?" + uuidPara
      this.serviceUrl="https://sedoo.aeris-data.fr/actris-datacenter-rest/rest/validation/daily?"+uuidPara
      this.viewElement = document.querySelector('aeris-day-images');
      this.viewElement.setAttribute("service", this.serviceUrl);
      this.getLabelValue(serie.uuid);
    },

    getInstrumentInfo : function (uuidInstrument) {
      var urlInstrumentInfo = "https://sedoo.aeris-data.fr/catalogue/rest/metadatarecette/id/"+uuidInstrument 
      var obj ={}
      this.$http.get(urlInstrumentInfo).then(
          (response)=>{ 
                        this.instrumentNameListe.push(response.body.resourceTitle.en)                       
                        obj= {name :response.body.resourceTitle.en,uuid :uuidInstrument}
                        this.instrumentListeUUIDByName.push(obj)                       
                        console.log(this.instrumentListeUUIDByName)    
                        this.activeSerie(this.instrumentListeUUIDByName[0])                      
                      },
          (response)=>{
                        console.log("error")
          });   
         
    },

    

    getLabelValue : function(uuid){
     
     var url_o = "https://sedoo.aeris-data.fr/actris-datacenter-rest/rest/quality/flags/"
     var service = url_o + uuid//"91440f71-9c3e-5d31-befc-2729873ce581"
    $.when( this.$http.get(service).then(
          (response)=>{ 
                        console.log("inside getlabelValue")
                        var event = new CustomEvent('getFlage', { 'detail': response.body })
                        document.dispatchEvent(event);
                      
                      },
          (response)=>{
                        console.log("error")
          }))
             
      /*$.when(
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
            });*/
            
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
  padding-left:15px;
  clear : none
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

.aeris-information-loggin {
 display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px;
    text-align: center;
    background: #fafafa;
}
.aeris-information-loggin h1 {
  border-bottom: 1px solid #f39c12;
    font-size: 1.4rem;
    font-weight: 300;
    color: #555;
}

.aeris-information-loggin p {
 font-size: 1.1rem;
    margin: 15px;
}


.aeris-validation-product-validation-panel {
 

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
