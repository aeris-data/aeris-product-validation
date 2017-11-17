<template>
  <div>
    <button v-if="!isShow" class="btn-close" v-on:click="isShow = !isShow" style="">
      <i class="fa fa-angle-double-right" aria-hidden="true"></i>
    </button>
    <transition name="slide">
      <div v-if="isShow" class="content">
        <button v-if="isShow" class="btn-open" v-on:click="isShow = !isShow">
          <i class="fa fa-angle-double-left" aria-hidden="true"></i>
        </button>
        <br>
        <div class="aeris-catalog-box"> Select instrument for validation </div>
        
        <div v-show="isShow">
        <div class="card" >
                <div  v-on:click="getLabelValue" class=" card-header">Nephelometer time series for the Pic du Midi (65) station</div>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque animi maxime commodi dolore earum autem unde exercitationem asperiores ipsam deleniti repellat voluptatum iusto dolorem est cupiditate mollitia, reiciendis voluptate iste.</p>
        </div>

        </div>
      </div>
    </transition>
   <aeris-day-images service="https://sedoo.aeris-data.fr/actris-validation-rest/rest/validation/daily?uuid=91440f71-9c3e-5d31-befc-2729873ce581&day=" lang="fr"></aeris-day-images>
  </div>
</template>


<script>
export default {

  props: {

  },

  data() {
    return {
      isShow: false
    }
  },

  created: function() {
  },

  mounted: function() {

  },

  watch: {

  },

  methods: {

    getLabelValue : function(uuid){
     
     var url_o = "https://sedoo.aeris-data.fr/actris-validation-rest/rest/quality/flags/"
     
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
            this.isShow = !this.isShow
    }
  }
}
</script>
<style>

.content {
  background: white;
  box-shadow: 8px 8px 20px #aaa;
  /* border: solid 1px #ddd;*/
  font-family: 'Open Sans', sans-serif;
  position: absolute;
  width: 1755px;
  height: 815px;
  z-index: 10;
}

.slide-leave-active,
.slide-enter-active {
  transition: all .8s;
  width: 100%;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  width: 0;
}

.slide2-leave-active,
.slide2-enter-active {
  transition: all .8s;
  width: 100%;
}

.slide2-enter,
.slide2-leave-to {
  opacity: 0;
  width: 0px;
}

.rotate-leave-active,
.rotate-enter-active {
  -moz-transition: all 1.5s linear;
  -webkit-transition: all 1.5s linear;
  transition: all 1.5s linear;
}

.rotate-enter,
.rotate-leave-to {
  -moz-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}

.btn-open {

  float: right;

  color: white;
  background: transparent;
  border: 1px solid #ddd;
  font-size: 1.2em;
  cursor: pointer;
  border-right: none;
  border-top: none;
}

.btn-close {

  float: left;

  color: #333;
  background: transparent;
  border: 1px solid #ddd;
  font-size: 1.2em;
  cursor: pointer;
  border-left: none;
  border-top: none;
  position: absolute;
  z-index: 20;
}

.aeris-catalog-box {
  margin-top: -22px;

  font-weight: bold;
  padding: 10px;
  background-color: #4765a0;
  color: #fff;
  border: none;
}

.card {
  float: left;
  background: #FFF;
  border: 1px solid #AAA;
  border-bottom: 3px solid #BBB;
  padding: 0px;
  margin: 15px;
  overflow: hidden;
  width: 200px;
  box-shadow: 8px 8px 20px #aaa;
}

.card-header {
  font-weight: bold;
  padding: 10px;
  background-color: #4765a0;
  color: #fff;
  border: none;
  cursor: pointer;
}

.card h1 {
  margin: 0px;
  padding: 10px;
  padding-bottom: 0px;
}

.card p {
  margin: 0px;
  padding: 10px;
}

.card-image {
  width: 100%;
  height: 200px;
  padding: 0px;
  margin: 0px;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
}

</style>