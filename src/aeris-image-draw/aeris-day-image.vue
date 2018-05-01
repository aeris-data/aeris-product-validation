       

<template>
  <div class ="aeris-day-image-host" >
    <div class="aeris-day-image-component-container">
     <!-- <aeris-images-draw id="viewer"   service=' http://localhost:9080/actris-datacenter-rest/rest/validation/dailydetail?uuid=91440f71-9c3e-5d31-befc-2729873ce581&day='  ></aeris-images-draw>-->
      
    <aeris-images-draw id="viewer"   service='https://sedoo.aeris-data.fr/actris-validation-rest/rest/validation/dailydetail?uuid=91440f71-9c3e-5d31-befc-2729873ce581&day='  ></aeris-images-draw>
      <div class="aeris-day-image-calendar-container">
        <i class="fa fa-2x fa-angle-left" v-on:click="prevDay"></i>
        <input class="aeris-day-image-datepicker-input" id="datepicker"  v-model="selectedDay" @blur="getinputVal()" >
        <i class="fa fa-2x fa-angle-right" v-on:click="nextDay"></i>
      </div>
      <button class="aeris-day-image-today-button" v-if="!hideTodayBtn" v-on:click="goToToday">Today</button>
      <div id="dayElements" class="aeris-day-image-day-elements">
        <div id="dayElementsList" class="aeris-day-image-day-elements">
         
          <div class="aeris-day-image-day-element" v-if="showql" v-on:click="getElementFromClick(day) " v-for="(day,index) in days" :checked="checkFirst(index)">
            <input :id="'ql'+index" class="input-radio" type="radio" name="quicklooks">
            <!--<label class="aeris-day-image-quicklook-label">
              <img style="border:solid 1px" class="aeris-day-image-quicklook" :src="day.media.content" :alt="day.media.category">
              <!-<span>{{formatItemHour(day.date)}}</span>-
             
            </label>-->
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
 
const DATE_FORMAT = 'LL';
export default {
  props: {
    service: {
      type: String,
      default: ''
    },
    collection: {
      type: String,
      default: ''
    },
    lang: {
      type: String,
      default: 'fr',
    },
   
  },
  data() {
    return {
      debug :{
        type:Boolean,
        default:false
      },
      showql: {
        type: Boolean,
      },
      days: {
        type: Array,
        default: []
      },
      selectedDay: {
        type: String,
        default: '10 avril 2018'
      },
      picker: {
        type: Object,
      },
      queryParams: {
        type: Object,
        default: {}
      },
      hideTodayBtn: {
        type: Boolean,
      },
      totalResults : {
        type:Number,
      },
      uuid_day : {
        type : String,
      }
    }
  },
  created: function () {
    this.debugTrace(this.debug, "**created start")
    //this.queryServiceDayComp();
    this.showql = false
    moment.locale(this.lang);
    this.selectedDay = '23 avril 2018';
   /* this.selectedDay = moment(new Date());
    var selectedMoment = moment(this.selectedDay, DATE_FORMAT);
    this.selectedDay = selectedMoment.format(DATE_FORMAT);*/
    this.debugTrace(this.debug, "**created end")
  },
  mounted: function () {
    this.debugTrace(this.debug, "**mounted start")
    this.viewElement = document.querySelector('aeris-images-draw');
     
    /* i18n */
    var monthsArray = [];
    var daysArray = [];
    var shortDaysArray = [];
    for (var i = 0; i < 12; i++) {
      monthsArray.push(this.capitalize(moment().month(i).format('MMMM')));
    }
    for (var i = 0; i < 7; i++) {
      daysArray.push(this.capitalize(moment().day(i).format('dddd')));
      shortDaysArray.push(this.capitalize(moment().day(i).format('ddd')));
    }
    this.picker = new Pikaday({
      field: this.$el.querySelector("#datepicker"),
      format: DATE_FORMAT,
      maxDate: new Date(),
      firstDay: 1,
      defaultDate: new Date(),
      setDefaultDate: true,
      i18n: {
        previousMonth: 'Previous',
        nextMonth: 'Next',
        months: monthsArray,
        weekdays: daysArray,
        weekdaysShort: shortDaysArray
      }
    });
    this.debugTrace(this.debug, "**mounted end")  
  },
  watch: {
    selectedDay: (function () {
      
      this.viewElement.setAttribute("date_file", this.convert_Date_Format());
      this.queryServiceDayComp();
      var today = moment(new Date());
      var selected = moment(this.selectedDay, DATE_FORMAT);
      this.hideTodayBtn = selected.isSame(today, 'day') ? true : false;
      return this.hideTodayBtn;
    }),
   
  },
  methods: {
    /*************************/
    /* Add debug basic trace */
    /*************************/
    debugTrace: function(dbg,msg){
      var txt = msg + ": aeris-day-image "
      if(dbg){
        console.log(txt)
      }
    },
    /************************************************************/
    /* get current value from input text field of the datepicker*/
    /************************************************************/
    getinputVal : function () {
      this.selectedDay = document.getElementById('datepicker').value
    },
    /********************************************************************/
    /* Set current selected day to today (on display and in datepicker) */
    /********************************************************************/
    goToToday: function () {
      this.picker.setDate(new Date());
      this.selectedDay = this.picker.getMoment().format(DATE_FORMAT);
    },
    /*************************************************/
    /* Intercept events and add granule informations */
    /*************************************************/
    setListenersDayComp: function (event) {
       this.debugTrace(this.debug, "**setListenersDayComp start")
      this.$.viewer.addEventListener('selectionModified', function (ev) {
        ev.detail.granule = this.selectedElem;
      }.bind(this));
      this.$.viewer.addEventListener('selectionEnd', function (ev) {
        ev.detail.granule = this.selectedElem;
      }.bind(this))
      this.debugTrace(this.debug, "**setListenersDayComp end")
    },
    /************************************************/
    /* Query service to get images for a given date */
    /************************************************/
    queryServiceDayComp: function () {
      this.debugTrace(this.debug, "**queryServiceDayComp start")
      var _this = this; 
      var url_service = this.service+  _this.convert_Date_Format() 
      console.log("url_service " + url_service )
      $.ajax({
        url:url_service,
        data: _this.queryParams,
        method: 'get',
        dataType: 'json'
      }).done(function (data) {
           _this.uuid_day = _this.getId()
        _this.days = data.granules;
        _this.showql = true
        _this.totalResults = data.totalResults
        /*if(_this.totalResults == 0){
          _this.uuid_day =_this.getId
       
        }else{
          _this.uuid_day =_this.getId//_this.days[0].uuid
        }*/
  
        window.setTimeout(function () {
         
          _this.selectedElem =_this.uuid_day//_this.days[0];
          _this.viewElement.setAttribute("totalResults", data.totalResults);
          _this.viewElement.setAttribute("uuid",  _this.uuid_day);        
           // _this.showElement( _this.selectedElem);//if (_this.days.length) _this.showElement( _this.uuid_day);
          Ps.initialize(document.getElementById('datepicker'));
        },200);
      
      }).fail(function (data) {
       console.log('Error day: ' + data.statusText);
       
      });
      this.debugTrace(this.debug, "**queryServiceDayComp end")
    },
    /******************************************************/
    /* Display the selected element in the view component */
    /******************************************************/
    showElement: function (selectedElem) {
      this.debugTrace(this.debug, "**showElement start")
      this.viewElement.setAttribute("uuid", this.selectedElem.uuid);
    },
    /* -------------------- */
    /*  Utilities           */
    /* -------------------- */
    /**************************************************/
    /* Check if this is the first element in the list */
    /**************************************************/
    checkFirst: function (index) {
      return index === 0;
    },
    /***************************/
    /* Capitalize given string */
    /***************************/
    capitalize: function (str) {
      return str.substring(0, 1).toUpperCase() + str.substr(1).toLowerCase();
    },
    /******************************************/
    /* Define the selected element from click */
    /******************************************/
    getElementFromClick: function (element) {
      /* Cooldown to avoid display bugs */
      this.debugTrace(this.debug, "**getElementFromClick start")
      this.selectedElem = element;
      this.showElement();
    },
    /****************************************/
    /* Format time displayed under elements */
    /****************************************/
    formatItemHour: function (date) {
      return moment(date).format('LT (Z)');
    },
    /******************************************/
    /* subtract a day to current selected day */
    /******************************************/
    prevDay: function () {
      this.debugTrace(this.debug, "**prevDay start")
      var selectedMoment = moment(this.selectedDay, DATE_FORMAT);
      this.selectedDay = selectedMoment.subtract(1, 'days').format(DATE_FORMAT);
    },
    /*************************************/
    /* Add a day to current selected day */
    /*************************************/
    nextDay: function () {
      this.debugTrace(this.debug, "**nextDay start")
      var selectedMoment = moment(this.selectedDay, DATE_FORMAT);
      if (selectedMoment.isBefore(moment(new Date()), 'day')) {
        this.selectedDay = selectedMoment.add(1, 'days').format(DATE_FORMAT);
      }
    },
     getId: function () {
     
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    },
    /************************************/
    /*Convert date format => YYYY-MM-DD */
    /************************************/
    convert_Date_Format : function () {
      console.log("this.selectedDay : "+moment(this.selectedDay, 'DD MMMMMMM YYYY').format('YYYY-MM-DD'))
      return moment(this.selectedDay, 'DD MMMMMMM YYYY').format('YYYY-MM-DD')//moment(this.selectedDay).format("YYYY-MM-DD")
    }
  }
}
</script>

<style>
.aeris-day-image-host {
  /*position:absolute;*/
  display: block;
  margin: 0;
  padding: 0;
  color: #333;
  font-family: 'Open Sans', sans-serif;
  /*border: 1px solid #ddd;*/
  overflow: auto;
  z-index:0;
/*  box-shadow: 8px 8px 20px #aaa; */
}
.aeris-day-image-host * {
  box-sizing: border-box
}
.aeris-day-image-component-container {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: column nowrap;
  flex-flow: column nowrap;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;
 
}
.aeris-day-image-calendar-container {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none
}
.aeris-day-image-calendar-container .aeris-day-image-datepicker-input {
  text-align: center;
  font-size: 1.2em;
  outline: none;
  padding: 5px 10px;
  margin: 0 10px;
  border: none;
  cursor: pointer
}
.aeris-day-image-calendar-container .fa {
  cursor: pointer
}
aeris-images-draw {
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px
}
.aeris-day-image-today-button {
  width: 100px;
  height: 30px;
  margin-top: 10px;
  color: #333;
  background: transparent;
  outline: none;
  text-align: center;
  
  border: 1px solid;
  cursor: pointer
}
.aeris-day-image-today-button:hover {
  background-color: #333;
  color: #fff
}
.aeris-day-image-day-elements {
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -ms-flex-pack: center;
  justify-content: center;
  width: 100%;
  margin-top: 5px;
  padding: 10px 5px 20px;
  overflow-x: auto;
  overflow-y: hidden
}
.aeris-day-image-day-elements .aeris-day-image-day-element {
  text-align: center
}
.aeris-day-image-day-elements .aeris-day-image-day-element img {
  opacity: 0.6;
  transition: 0.3s
}
.aeris-day-image-day-elements .aeris-day-image-day-element img:hover {
  cursor: pointer;
  opacity: 1
}
.aeris-day-image-day-elements .aeris-day-image-quicklook {
  display: block;
  width: 200px;
  height: auto;
  margin: 0 5px
}
.aeris-day-image-day-elements .aeris-day-image-quicklook-label {
  display: block;
  margin: 5px;
  padding-bottom: 5px;
  font-size: 12px;
  border-bottom: 3px solid transparent
}
.aeris-day-image-day-elements .input-radio {
  display: none
}
.aeris-day-image-day-elements .input-radio:checked~.quicklook-label {
  border-bottom: 3px solid rgba(255, 165, 0, 0.6)
}
.aeris-day-image-day-elements .input-radio:checked~.quicklook-label img {
  opacity: 1
}
</style>