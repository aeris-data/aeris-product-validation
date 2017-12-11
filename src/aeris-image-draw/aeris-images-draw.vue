<template >

  <div  class="aeris-images-draw-host ">
     
    <div class="aeris-images-draw-component-container">
      <div class="aeris-images-draw-canvas-cont">
        <div class="aeris-images-draw-y-axis-container">
          <!--type axe odronnées -->
          <div  v-if="scaleYType =='log'" class="aeris-images-draw-y-axis" style="position: relative;">
             <span  class="aeris-image-draw-log-axis" v-for="log in ymarks" 
                :style="'z-index:'+log+';height:'+((Math.log10(log)*100)/Math.log10(500))+'%;'"> 
                {{log}}
             </span>
          </div>

          <div v-else class="aeris-images-draw-y-axis">
             <span  id="ymark"  class="aeris-images-draw-ymark" v-for="ym in ymarks">{{ym}}</span>
          </div>

          <div class="aeris-images-draw-relative-container">
            <div class="loader spinner" v-show="showSpinner"></div>
            <div class="aeris-images-draw-zoom-panel">
              
              <button v-on:click="buttonZoom" data-amount="1"style="border-raduis:50%">
                <i class="fa fa-plus"></i>
              </button>
          
              <button v-on:click="buttonZoom" data-amount="-1">
                <i class="fa fa-minus"></i>
              </button>
            </div>

              <div class="canvas-container" v-for="(elt,index,prop) in uuidArr" v-show="uuidDisplay === elt">
                <canvas :id="'canvas_'+ elt" ></canvas>
              </div>
            <div id="tooltip" class="aeris-images-draw-tooltip" v-if="hovering.aeris">
              <ul>
              
                <li v-for="tt in toArray(hovering.aeris)" v-show="tt.value">
                  <strong> {{capitalize(tt.name)}}:</strong> {{tt.value}}</li>
              
              </ul>
            </div>
          </div>
        </div>
        <div  class="aeris-images-draw-x-axis">
        
          <span  id="xmark" class="aeris-images-draw-xmark" v-for="xm in xmarks">{{xm}}</span>
          
        </div>
        
        <div id="controls" class="aeris-images-draw-control-panel">
          <!--<div class="buttons">
  
            <button  id="save" class="icon-button" type="button" v-on:click="saveCurrentCanvas()" title="Save" >
              <i class="fa fa-floppy-o" ></i>
            </button>
         
            <button id="drawMode" class="icon-button" type="button" v-on:click="drawMode" title="Draw Mode (d)" v-bind:class="{active : isDrawing}">
              <i class="fa fa-pencil-square-o"></i>
            </button>
            
            <button id="panMode" class="icon-button" type="button" v-on:click="panMode" title="Pan Mode (p)" v-bind:class="{active : isPanning}">
              <i class="fa fa-arrows-alt"></i>
            </button>
  
            <button id="del" class="icon-button" type="button" v-on:click="deleteSelected()" title="Delete selection (del)">
              <i class="fa  fa-eraser"></i>
            </button>
  
            <button id="resetZoom" class="icon-button" type="button" v-on:click="resetZoom" title="Reset Zoom (z)">
              <i class="fa fa-search"></i>
            </button>
  
            <button id="help" class="icon-button" type="button" v-on:click="toggleHelp" title="Help">
              <i class="fa fa-question"></i>
            </button>

            <button id="clearAll" class="icon-button" type="button" v-on:click="removeAllElement" title="Clear All Elements">
              <i class="fa fa-trash"></i>
            </button>
  
            <select name="drawType" id="drawType">
              <option value="range" selected>Range</option>
              <option value="zone">Zone</option>
            </select>
             <button id="ManualyInput" class="icon-button" type="button" v-on:click="panelOpen=!panelOpen" title="Input manualy">
              <i class="fa fa-keyboard-o"></i>
            </button>  
          </div>-->
           
          <!--<div class="coordinates">
            
            <div>x: {{toDisplayX(mousePosition.x)}}, y: {{toDisplayY(mousePosition.realY)}} </div>
          </div>-->
    
          <div class="aeris-images-draw-helpPanel" v-if="!helpVisible">
            <div class="aeris-images-draw-helpPanel-content">
              <h2>Keyboard shortcuts:</h2>
              <ul>
                <li>d : Enter draw mode</li>
                <li>p : Enter pan mode</li>
                <li>del : Delete selected element</li>
                <li>z : Reset zoom</li>
              </ul>
              <button class="aeris-images-draw-close-button" v-on:click="toggleHelp">Ok</button>
            </div>
          </div>
        </div>  
         
            <button id="addNew" style="border-radius: 50%;height: 50px;width: 50px;text-align: center;display: flex;justify-content: center;align-items: center;background-color: #4765a0;color: white;" class="btn aeris-images-draw-control-input" type="button" v-on:click="addNewEntry()" title="Add new element" v-show ="panelOpen">
               <i class="fa fa-plus"></i>
            </button>
        
          <ul id="input" v-for="n in uuidArr"  v-show="uuid === n">
            <li :id="'elt_'+ uuid+'_'+index" class="aeris-images-draw-control-input" v-for="(elt,index,prop) in manualElments[getCurrentCanvasId()]"  v-show ="panelOpen">
           
          
            <div class="buttons">

                <button id="viewResult" class="btn" type="button" v-on:click="drawEntry(elt)" title="View result">
                  <i class="fa fa-paint-brush" aria-hidden="true"></i>
                </button>

                <button id="viewId" class="btn" type="button"  :title="elt.id"> Id
                </button>

                <select v-model="elt.elementType" >
                  <option value="range" selected>Range</option>
                  <option value="zone">Zone</option>
                </select>

                <select class="selectQuality"name="quality" v-model="elt.quality" style="width:150px;" >
                  <option value="" selected disabled>&nbsp Quality</option>
                  <option :value="item.code" v-for="item in qualityList">{{item.label}}</option>
                </select>

              </div>
             
              <label>Start</label>
              <div class="input_time">
         
<!--                <input type="number" step="1" min="0" max="23" placeholder="0" style="width : 30px"  onchange="if(this.value.length < 2) this.value = '0' + this.value;" /> h
-->                <input type="text" required pattern="(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9])" placeholder="hh:mm" style="width : 70px" v-model="elt.coords.start.x"/>
              <!--  <input type="number" step=".1" min="0" placeholder="x" style="width : 70px" v-model="elt.coords.start.x" /> -->
                <input type="number" step=".1" min="0" placeholder="y" style="width : 70px"  v-if="elt.elementType !='range'"/>
              </div>

              <label>End</label>
              <div style="width : 100px">
                <input type="text" required pattern="(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9])" placeholder="hh:mm" style="width : 70px" v-model="elt.coords.stop.x"/>
               <!-- <input id="chgwidth" type="number" step=".1" placeholder="x" style="width : 70px" v-model="elt.coords.stop.x"/>-->
                <input type="number" step=".1" placeholder="y" style="width : 70px"v-if="elt.elementType !='range'"/>
              </div>
              
              <div class=" comment">
                <textarea rows="" cols="" placeholder="Comment" style="height: 100px;" v-model="elt.comment"></textarea>
              </div>

               <div class="buttons">
                <button id="delInput" class="btn" style="margin-left:20px" type="button" v-on:click="deleteEntry(elt.id,index)" title="Delete input">
                  <i class="fa fa fa-trash" aria-hidden="true"></i>
                </button>
              </div>
                 
            </li>
          
          </ul>
         
          
      </div>
      <aside class="aeris-images-draw-sidepanel">
            <button  id="save" class="icon-button" type="button" v-on:click="saveCurrentCanvas()" title="Save" >
              <i class="fa fa-floppy-o" ></i>
            </button>
            <select style="font-weight: bold;background: #4765a0;border: none;width:3.3rem;height:2.9rem; font-size:11px;color:#fff"name="drawType" id="drawType">
              <option value="range" selected>Range</option>
              <option value="zone">Zone</option>
            </select>
            <button id="drawMode" class="icon-button" type="button" v-on:click="drawMode" title="Draw Mode (d)" v-bind:class="{active : isDrawing}">
              <i class="fa fa-pencil-square-o"></i>
            </button>
            
            <button id="panMode" class="icon-button" type="button" v-on:click="panMode" title="Pan Mode (p)" v-bind:class="{active : isPanning}">
              <i class="fa fa-arrows-alt"></i>
            </button>
  
            <button id="del" class="icon-button" type="button" v-on:click="deleteSelected()" title="Delete selection (del)">
              <i class="fa  fa-eraser"></i>
            </button>
  
            <button id="resetZoom" class="icon-button" type="button" v-on:click="resetZoom" title="Reset Zoom (z)">
              <i class="fa fa-search"></i>
            </button>
  
        <!--    <button id="help" class="icon-button" type="button" v-on:click="toggleHelp" title="Help">
              <i class="fa fa-question"></i>
            </button>-->

            <button id="clearAll" class="icon-button" type="button" v-on:click="removeAllElement" title="Clear All Elements">
              <i class="fa fa-trash"></i>
            </button>
  
            
             <button id="ManualyInput" class="icon-button" type="button" v-on:click="panelOpen=!panelOpen" title="Input manualy">
              <i class="fa fa-keyboard-o"></i>
            </button> 
            <div class="coordinates">
            
            <!--<div style="font-size:9px;margin-rigth:3px">x: {{toDisplayX(mousePosition.x)}}, y: {{toDisplayY(mousePosition.realY)}} </div>-->
          </div>
            </aside>
      <aside class="aeris-images-draw-sidepanel">
        
        <div class="legend" >
         <!-- <img :src="srcLegend">-->
        </div>
        
        <!--<div class="informations">-->
         
        <vue-tabs v-model="tabName">
          <v-tab title="Legende">
           <div class="legend" >
          <img src="https://dummyimage.com/200x100/ddd/000.jpg&text=no+legende+available+">
        </div>
          </v-tab>

          <v-tab title="Edition" :disabled="disableEdit">
          Edit element value 
          <textarea rows="" cols="" placeholder="Comment" v-model="toolTipComment" ></textarea>
       
          
            <select name="quality" v-model="toolTipQuality" >
              <option value="" selected disabled>Choose quality flag</option>
              <option :value="item.code" v-for="item in qualityList">{{item.label}}</option>
            </select>
             
          </v-tab>
         
          
        </vue-tabs>

          
     <!--   </div>-->

      </aside>
    </div>
    
  </div>
</template>

<script>
import debounce from "debounce"
var qualityList = [];

/*window.onbeforeunload = function() {
  return "Data will be lost if you leave the page, are you sure?";
};*/

export default {
  props: {

    lang: {
      type: String,
      default: 'fr',     
    },

    service: {
      type: String,
      default: ''
    },

    uuid: {
      type: String,
    },
    
    date_file: {
      type: String,
    },

    totalResults: {
      type: Number,
    },
  },

  data() {

    return {
      tabName:'',
      pickerSetting: {
      headerShow: false,
      },

      srcLegend: {
        type: String
      },

      debug: {
        type: Boolean,
        default: true
      },

      saveElement: {
        type: Array,
      },

      alreadyInit: {
        type: Array,
        default: []
      },

      canvasTab: {
        type: Array,
        default: []
      },

      jsonPara: {
        type: Array,
        default: []
      },

      img: {
        type: String,
        default: ''
      }, 

      color: {
        type: String,
        default: 'red'
      },

      isDrawing: {
        type: Boolean,
      },

      panelOpen: {
        type: Boolean,
      },

      isPanning: {
        type: Boolean,
      },

      drawButtonActive: {
        type: String,
      },

      panButtonActive: {
        type: String,
      },

      helpVisible: {
        type: Boolean,
        default: false
      },

      hovering: {
        type: String,
        default: {}
      },

      zoomReset: {
        type: Boolean,
        default: true,
      },
      showSpinner: {
        type:Boolean,
       
      },

      xmarks:[],

      ymarks:[],

      mousePosition: {
        type: Object,
        default: {}
      },
    
      qualityList: {
        type: Array,
        default: []
      },

      scaleXType: {
        type: String,
      },

      scaleYType: {
        type: String,
      },

      origBounds: {
        type: Object,
        default: {}
      },

      uuidDisplay: {
        type: String,
      },
      disableEdit : true,
      manualElments: {},

      blankElment: {"comment": "",
                    "quality": "",
                    "coords": {
                      "start": {
                        "x": "6:30",
                        "y": "500"
                      },
                      "stop": {
                        "x": "10:00",
                        "y": "0"
                      }
                    },
                    "id": this.getId(),
                    "elementType": "range"},
                    
      logScale: [],

      toolTipComment: '',

      toolTipQuality: '',

      qualityList: [],

      uuidArr: {},
      lastSelectedElementId:''

    }

  },

  created: function () {
 
    moment.locale(this.lang);
    this.qualityList = qualityList;
    this.isDrawing = false
    this.isPanning = false
    this.panelOpen = false
    this.showSpinner= true
    document.addEventListener('getFlage', this.getQualityFlag.bind(this));
  },

  mounted: function () {
    console.log("initialisation image draw...")
     
    // valeur arbitaire peut etre changé
    // evite le redimensionnement au chargement du canvas 
  $('.aeris-images-draw-relative-container').css('min-height', 340);
    $('.aeris-images-draw-relative-container').css('min-width', 1000);
  },
 
  watch: {
    uuid: function() {
      this.debugTrace(this.debug,"**watch hook : query service ...")
      this.queryService()
    }
  },

  methods: {

    /*******************************/
    /* Generate simple debug trace */
    /*******************************/
    debugTrace: function(dbg,msg){
      var txt = msg + ": aeris-image-draw "
      if(dbg){
        console.log(txt)
      }
    },

    /*****************************************/
    /* Get all informations from web-service */
    /*****************************************/
    queryService: function () {
      this.debugTrace(this.debug,"**queryService start")
     
      var _this = this;
      
      this.bounds = {};
      var url = _this.service + _this.date_file; /* Modify with the UUID */
      console.log("url :" + url)
      $.ajax({
        url: url,
        method: 'get',
        dataType: 'json'
      }).done(function (data) {
        _this.jsonPara["canvas_"+_this.uuid]=data 
        _this.origBounds = data.bounds;
        _this.imgDate = moment.unix(data.timestamp).format('L - LT (Z)');
        //_this.img = data.granules[0].media.content;
        _this.legend    = data.legend;
        _this.srcLegend = data.legend;
        _this.color = data.color
        _this.scaleXType = data.scaleXType
        _this.scaleYType = data.scaleYType
        _this.logScale   = data.logScale 
        _this.elements = data.elements;
        _this.bounds.xMin = data.bounds.xMin;
        _this.bounds.xMax = data.bounds.xMax;
        _this.bounds.yMin = data.bounds.yMin;
        _this.bounds.yMax = data.bounds.yMax;
        _this.origBounds= _this.bounds

       if (_this.uuid === 'no-graph'){        
          _this.img ="https://dummyimage.com/1500x500/ddd/fff.jpg&text=no+graph+available+for+the+current+date"
         // _this.resizeCanvas(_this.canvasTab[_this.getCurrentCanvasId()]);

       }else{
          _this.img = data.image;
       }
       
        /* Draw marks on the rules */
        var arrX = [];
        var arrY = [];
       
        if (_this.scaleXType == "time") {
          for (var j = 2; j <= 22; j = j + 2) {
            var xlabel = j + ":00"
            arrX.push(xlabel);
          }
          arrX.push(0 + ":00");
        } else {
          for (var i = data.bounds.xMin; i <= data.bounds.xMax; i=i+1) {
            arrX.push(i);
          
          }
          for (var i = 4; i <= 16; i=i+2) {
            arrY.push(i);
           
          }
        }
        
        _this.xmarks = arrX;
        _this.ymarks = _this.logScale;
        //_this.logScale = [10,100,500],
        _this.canvasManager()
       // affichage spinner 
       _this.showSpinner = false
      }).fail(function (data) {
        _this.img ="https://dummyimage.com/1500x500/babfc6/fff.jpg&text=no+graph+available+for+the+current+date"
        _this.resizeCanvas(_this.canvasTab[_this.getCurrentCanvasId()]);
        console.log('Error draw: ' + data.statusText);
      });
       
       this.debugTrace(this.debug,"**queryService end")
    },

    /******************************/
    /*create one canavas by graph */
    /******************************/
    canvasManager: function() {
          
      if(Object.values(this.uuidArr).indexOf(this.uuid) > -1){
        console.log('value is in the Array!');
        this.uuidDisplay = this.uuid
  
      } else {
        var _this = this 
        var canvasName = "canvas_" + this.uuid 
        /* "this.$set" : for reactive property */     
        this.$set(this.uuidArr, this.uuid, this.uuid)        
        this.$set(this.manualElments, canvasName, [this.blankElment])
        console.log("**canvasName = " + canvasName)

        if (this.canvas) {
          this.canvas.clear();
        } else {                      
          window.setTimeout(function () {
            _this.canvasTab[canvasName] = new fabric.Canvas(canvasName);
            _this.viewportTransform = _this.canvasTab[canvasName].viewportTransform;
          },5)

          window.setTimeout(function () { 
            _this.resizeCanvas(_this.getCurrentCanvas());
            _this.uuidDisplay = _this.uuid
            $(".aeris-images-draw-ymark").css("height" , '15%')
            $(".aeris-images-draw-ymark").css("width", 'none')
          },5)
        } 
      }
    },

    /*******************************/
    /*Get the current canvas object*/
    /*******************************/
    getCurrentCanvas: function() {
      return this.canvasTab["canvas_"+this.uuid]
      console.log("getCurrentCanvas" + this.canvasTab["canvas_"+this.uuid] )
    },

    /***************************/
    /*Get the current canvas id*/
    /***************************/
    getCurrentCanvasId: function() {
      return "canvas_" +this.uuid
    },

    /********************************************************************/
    /* Initialize Canvas element and store initial transformation matrix*/
    /********************************************************************/
    initialise: function() {
      this.debugTrace(this.debug, "**initialise start")
      this.selectedElement = '';
      /* Remove resizing handles */
      fabric.Group.prototype.hasControls = false
      for (var cpt = 1; cpt <= this.totalResults; cpt++) {
        var cvs = "canvas_" + cpt
        this.$set(this.manualElments, cvs, [this.blankElment])

        if (this.canvas) {
          this.canvas.clear();
        } else {
          this.canvasTab[cvs] = new fabric.Canvas(cvs);
          this.viewportTransform = this.canvasTab[cvs].viewportTransform;
          this.alreadyInit[cvs] = false
        }

      }
      this.debugTrace(this.debug, "**initialise end")
    },

    /*******************************/
    /* Resize canvas to image size */
    /*******************************/
    resizeCanvas: debounce(function(canvas) {
      this.debugTrace(this.debug, "**resizeCanvas start")

      var canvasId = this.getCurrentCanvasId()

      this.alreadyInit[canvasId] = true
      var data = this.jsonPara[canvasId]
      
      this.bgImg = canvas.setBackgroundImage(0, canvas.renderAll.bind(canvas));
      var img = new Image();

      img.setAttribute('src', this.img);

      $(img).on('load', function() {
       // limite la taille du canvas 
       if (img.width > 800) {
          var ratio = img.height / img.width;
          img.width = 1000;
          img.height = img.width * ratio;
          //avoid resizing when graph change
          $('.aeris-images-draw-relative-container').css('min-height', img.height);
          $('.aeris-images-draw-relative-container').css('min-width', img.width);
        }
        var width = img.width;
        var height = img.height;
        var ratio = width / height;
        //en com  pour permettre les canvas unique 
        /*var containers = [].slice.call(document.querySelectorAll('.canvas-container'));
        containers.forEach(function (el) {
          el.style.width = 'initial';
          el.style.height = 'initial';
        });*/ 

        canvas.setHeight(height);
        canvas.setWidth(width);

        canvas.setZoom(1);
        this.bgImg = canvas.setBackgroundImage(img.src,
          function() {
            canvas.backgroundImage.scaleToWidth(width);
            canvas.backgroundImage.scaleToHeight(height);
            canvas.setDimensions({ width: width, height: height });
            canvas.renderAll();
          }.bind(this),
          {
            scaleX: 1,
            scaleY: 1,
            top: 0,
            left: 0,
            originX: 'left',
            originY: 'top'
          });
        canvas.viewportTransform = this.viewportTransform;
        if (this.zoomReset) {
          this.drawElements(canvas);
          this.zoomReset = true
        }

      }.bind(this));
      this.setListeners(canvas)
      this.debugTrace(this.debug, "**resizeCanvas end")
    }, 100),

    /*****************/
    /* Draw elements */
    /*****************/
    drawElements: debounce(function(canvas) {
      this.debugTrace(this.debug, "**drawElements start")
      var _this = this
      var data = _this.jsonPara[this.getCurrentCanvasId()]

      var _canvas = canvas
      data.elements.forEach(function(elem) {
        var pointer = {
          x: this.convert2pixelX(elem.coords.start.x, canvas),
          y: this.computeY(this.convert2pixelY(elem.coords.start.y, canvas), canvas)
        }
        _this.origX = pointer.x;
        _this.origY = pointer.y;

        var config = this.getElementConfig(elem.elementType, pointer, canvas);
        var controls = this.getElementControls(elem.elementType);

        var el = new fabric.Rect(config);
        el.setControlsVisibility(controls);
        el.id = elem.id;
        el.elementType = elem.elementType;

        var infos = {}

        if (elem.comment) infos.comment = elem.comment;
        if (elem.quality) infos.quality = elem.quality;

        if (Object.keys(infos).length) {
          el.aeris = infos;
        }

        var pixels = {
          start: {
            x: this.convert2pixelX(elem.coords.start.x, canvas),
            y: this.computeY(this.convert2pixelY(elem.coords.start.y, canvas), canvas)
          },
          stop: {
            x: this.convert2pixelX(elem.coords.stop.x, canvas),
            y: this.computeY(this.convert2pixelY(elem.coords.stop.y, canvas), canvas)
          }
        }

        var w = Math.abs(pixels.stop.x - pixels.start.x);
        var h = Math.abs(pixels.stop.y - pixels.start.y);

        el.set({ width: w });
        el.set({ height: h });

        canvas.add(el);

      }.bind(this));
      canvas.renderAll();           
      this.debugTrace(this.debug, "**drawElements end")
    }, 150),

    /*********************************************/
    /*Delete selected element(s) from the canvas */
    /*********************************************/
    deleteSelected: debounce(function() {
      this.debugTrace(this.debug, "**deleteSelected start")
      /* Get selected element(s) */
      var canvas = this.getCurrentCanvas()
      var activeObject = canvas.getActiveObject();
      var activeGroup  = canvas.getActiveGroup();
      var ids = [];

      if (activeObject) {
        var id = activeObject.id;
        canvas.remove(activeObject);
        ids.push(id);
      } else if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();

        objectsInGroup.forEach(function(object) {   
          var id = object.id;
          canvas.remove(object);
          ids.push(id);
        }.bind(this));
      }

      this._justDeleted = true;
      window.setTimeout(function() {
        this._justDeleted = false;
      }.bind(this), 300);

      var event = new CustomEvent('selectionRemoved', { 'detail': ids })
      document.dispatchEvent(event);

      this.debugTrace(this.debug, "**deleteSelected end")
    }, 100),

    /*****************************/
    /* Set listeners on elements */
    /*****************************/
    setListeners: function(canvas) {
      this.debugTrace(this.debug, "**setListeners start")
      var _this = this;
      var canvasId = this.getCurrentCanvasId()
      /* Initialisation */
      console.log("**setListeners start")
      console.log("**setListeners start = " + canvasId)
      console.log($(document.getElementById(canvasId)))
      
      this.canvasPosition = {
        x: $(document.getElementById(canvasId)).offset().left,
        y: $(document.getElementById(canvasId)).offset().top
      };

      this.scale = 1;
      this.mousedown = false;

      this.start = {
        x: 0,
        y: canvas.height
      };

      this.stop = {
        x: 0,
        y: canvas.height
      };

      this.mousePosition = {
        x: 0,
        y: 0,
        realY: 0
      };

      
      /* KeyDown */
     /* document.addEventListener('keydown', this.handleKeyDown.bind(this));*/

      /* Mousedown */
      canvas.on('mouse:down', this.handleMouseDown.bind(this));

      /* Object modification (resize / move) */
      canvas.on('object:modified', this.handleObjectModified.bind(this));

      /* Mouseup */
      canvas.on('mouse:up', this.handleMouseUp.bind(this));

      /* Mousemove */
      canvas.on('mouse:move', this.handleMouseMove.bind(this));

      /* Mouse wheel event */
      canvas.wrapperEl.addEventListener("mousewheel", this.handleMouseWheel.bind(this));
      canvas.wrapperEl.addEventListener("DOMMouseScroll", this.handleMouseWheel.bind(this));

      /* On element unselection */
      canvas.on('before:selection:cleared', this.handleObjectUnselected.bind(this));
      canvas.on('object:added', this.handleObjectCreated.bind(this));
       /* On element selection */
      canvas.on('object:selected', this.handleObjectselected.bind(this));

      /* MouseOver */
      canvas.on('mouse:over', this.handleMouseOver.bind(this));

      /* MouseOut */
      canvas.on('mouse:out', this.handleMouseOut.bind(this));

      /*keep the stroke width*/
      canvas.on('object:scaling', this.keepStrokeWidth.bind(this))

      this.debugTrace(this.debug, "**setListeners start")
    },

    /* -------------------- */
    /*  Listeners Methods   */
    /* -------------------- */
    
    /**********************************************/
    /*keep the stroke width when resizing elements*/
    /**********************************************/
    keepStrokeWidth: function(ev) {
      this.debugTrace(this.debug, "**keepStrokWidth start")
      var canvas = this.getCurrentCanvas()
      var elt = ev.target;
      var activeObject = canvas.getActiveObject();
      elt.get("strokeWidth")

      if (!elt.strokeWidthUnscaled && elt.strokeWidth) {
        elt.strokeWidthUnscaled = elt.strokeWidth;
      }
      if (elt.strokeWidthUnscaled) {
        elt.strokeWidth = 2 / ((elt.scaleX + elt.scaleY) / 2);
        console.log("***")
        activeObject.set('strokeWidth', elt.strokeWidth)
      }

      this.debugTrace(this.debug, "**keepStrokWidth start")
    },

    /*************************************/
    /*Add action when you handle key Down*/
    /*************************************/
    handleKeyDown: debounce (function (ev) {
      this.debugTrace(this.debug, "**handleKeyDown start")

      switch (ev.keyCode) {
        /* On press 'Delete' key */
        case 46:
          this.deleteSelected();
          break;

        /* On press 'd' key */
        case 68:
          this.drawMode();
          break;

        /* On press 'z' key */
        case 90:
          this.resetZoom();
          break;

        /* On press 'p' key */
        case 80:
          this.panMode();
          break;
      }
       this.debugTrace(this.debug, "**handleKeyDown end")
    },100),

     handleObjectCreated: function (ev) {
      this.debugTrace(this.debug, "**object created start")
       this.disableEdit = false
      var canvas = this.getCurrentCanvas()
      this.selectedElement = ev.target;
     
      var index =canvas.getObjects().indexOf(this.selectedElement)
      canvas.setActiveObject(canvas.item(index));
      
       this.debugTrace(this.debug, "**object created end")
    },
    /*****************************/
    /*manage handle Mouse Up event*/ 
    /*****************************/
    handleMouseUp: debounce(function(ev) {
      
      this.stop.x = parseInt(ev.e.clientX - this.canvasPosition.x);
      this.stop.y = parseInt(ev.e.clientY - this.canvasPosition.y);
      var _this = this;
      var canvas = this.getCurrentCanvas()

      this.mousedown = false;
      this.panning = false;
      canvas.selection = true;

      var coords = {
        start: this.computeCoordsObject(this.start),
        stop: this.computeCoordsObject(this.stop)
      };

      if (this.isDrawing) {
        this.rect.setCoords();
        this.drawMode();

        var obj = {
          objectId: this.rect.id,
          type: this.elementType,
          coords: coords,
          scale: this.scale,

        };

        this.rect["aeris"] = {
          comment: "",
          quality: ""
        }
        this.toolTipComment =  this.rect["aeris"].comment
        var event = new CustomEvent('selectionEnd', { 'detail': obj })
        document.dispatchEvent(event);

      }
      canvas.renderAll();
      
    }, 100),
    /********************************/
    /*manage handle mouse down event*/
    /********************************/
    handleMouseDown: debounce(function(ev) {
      
      
      var _this = this;
      var canvas = this.getCurrentCanvas()
      this.start.x = parseInt(ev.e.clientX - this.canvasPosition.x);
      this.start.y = parseInt(ev.e.clientY - this.canvasPosition.y);
      this.mousedown = true;

      /* Get pointer coordinates on the canvas */
      var pointer = canvas.getPointer(ev.e);
      this.origX = pointer.x;
      this.origY = pointer.y;

      /* Get type of element to draw */
      this.elementType = this.getType();

      if (this.isDrawing) {
        var height;
        /* Element configuration */
        var config = this.getElementConfig(this.elementType, pointer, canvas);
        var controls = this.getElementControls(this.elementType);

        this.rect = new fabric.Rect(config)
        this.rect.setControlsVisibility(controls);
        this.rect.id = this.getId();
        this.rect.elementType = this.elementType;
        canvas.add(this.rect);
        canvas.selection = false;

      } else if (this.isPanning) {
        this.panning = true;
        canvas.selection = false;
      }
     
    }, 100),

    /********************************/
    /*manage handle mouse move event*/
    /********************************/
    handleMouseMove:  debounce (function (ev) {
      
      var canvas = this.getCurrentCanvas();
      var pointer = canvas.getPointer(ev.e);
      var elt = ev.target;
      this.mousePosition.x = Math.round(pointer.x);
      this.mousePosition.y = Math.round(pointer.y);
      this.mousePosition.realY = this.computeY(Math.round(pointer.y), canvas);

      var _this = this
      if (this.mousedown && this.isDrawing) {

        if (_this.origX > this.mousePosition.x) {
          this.rect.set({ left: Math.abs(this.mousePosition.x) });

        }
        if (_this.origY > this.mousePosition.y) {
          this.rect.set({ top: Math.abs(this.mousePosition.y) });

        }

        this.rect.set({ width: Math.abs(_this.origX - this.mousePosition.x) });

        if (this.elementType === 'zone') {
          this.rect.set({ height: Math.abs(_this.origY - this.mousePosition.y) });
        } else if (this.elementType === 'range') {
          this.rect.set({ height: canvas.getHeight() });

        }

        canvas.renderAll();

      } else if (this.mousedown && this.panning && ev && ev.e && this.isPanning) {
        var offset = {
          x: canvas.viewportTransform[4],
          y: canvas.viewportTransform[5]
        };

        var ratio = {
          x: canvas.viewportTransform[0] - 1,
          y: canvas.viewportTransform[3] - 1
        }

        var limit = {
          x: (canvas.width * ratio.x) * -1,
          y: (canvas.height * ratio.y) * -1
        }

        var delta = new fabric.Point(ev.e.movementX, ev.e.movementY);

        if (offset.x >= 0 && delta.x > 0) {
          return;
        } else if (offset.x <= limit.x && delta.x < 0) {
          return;
        } else if (offset.y >= 0 && delta.y > 0) {
          return;
        } else if (offset.y <= limit.y && delta.y < 0) {
          return;
        } else {
          canvas.relativePan(delta);
          this.setRules();
        }

      } else if (this.hovering) {
        if(elt.aeris.comment !=''|| elt.aeris.quality !=''){
        $('#tooltip').css({ left: Math.abs(ev.e.offsetX) + 25, top: Math.abs(ev.e.offsetY) + 25 });
        $('#tooltip').css("padding","5px")
      }
      }
      /* Change cursor when in panning mode */
      if (this.isPanning) {
        this.changeCursor('move', this.getCurrentCanvas());
      } else {
        this.changeCursor('default', this.getCurrentCanvas());
      }
      
    }, 5),

    /********************************/
    /*manage handle mouse wheel event*/
    /********************************/
    handleMouseWheel: function(ev) {
      

      var ev = window.event || ev;
      var canvas = this.getCurrentCanvas()
      var delta = ev.detail ? ev.detail * (-120) : ev.wheelDelta;

      if (delta) {
        var val = Number(delta) / 100;
        delta = (val < 0) ? -0.1 : 0.1;
        this.scale = this.scale + delta;

        if (this.scale < 1) {
          this.scale = 1;
          canvas.viewportTransform = this.viewportTransform;
        }

        this.mousePosition.x = ev.offsetX;
        this.mousePosition.y = ev.offsetY;
        this.zoomTo(new fabric.Point(this.mousePosition.x, this.mousePosition.y), canvas);
      }
      
    },

    /********************************/
    /*manage handle mouse over event*/
    /********************************/
    handleMouseOver: function(ev) {
    
      try {
        if (ev.target) {
          this.hovering = ev.target
        
        }
      } catch (ex) {
        /* Do nothing */
      }
      
    },

    handleMouseOut: function(ev) {
       
      try {
        this.hovering = false;
      } catch (ex) {
        /* Do nothing */
      }
    
    },
    /*************************************/
    /*manage handle object unselected event*/
    /*************************************/
    handleObjectUnselected: function(ev) {
      this.debugTrace(this.debug, "**handleObjectunSelected start")
      this.lastSelectedElementId=''
      
      this.tabName= "Legende"
      this.selectedElement = ev.target;
      this.elementInfos = this.selectedElement.aeris || {};

      /* Set tooltip data */
      this.selectedElement.aeris.comment = this.toolTipComment || '';
      this.selectedElement.aeris.quality = this.toolTipQuality || '';

      /* On element deselection */

      var infos = {}

      if (this.comment) infos.comment = this.toolTipComment;
      if (this.quality) infos.quality = this.toolTipQuality;

      //this.saveInformations(infos);

      /* Clear tooltip data */
      this.toolTipComment = '';
      this.toolTipQuality = '';
      this.disableEdit = true
      this.debugTrace(this.debug, "**handleObjectunSelected end")
    },
    /*************************************/
    /*manage handle object selected event*/
    /*************************************/
    handleObjectselected: function(ev) {
      this.debugTrace(this.debug, "**handleObjectSelected start")
      this.selectedElement = ev.target;
       this.disableEdit = false
      var canvas = this.getCurrentCanvas()      
     
      if ( (this.selectedElement.id != this.lastSelectedElementId) && (this.lastSelectedElementId !='')){ 
        console.log("current tool tip : " + this.toolTipComment)
        console.log("getDrawElementById Last : " +this.lastSelectedElementId)
        
        this.getDrawElementById(this.lastSelectedElementId).aeris.comment= this.toolTipComment
        this.getDrawElementById(this.lastSelectedElementId).aeris.quality= this.toolTipQuality
        this.toolTipComment = '';
        this.toolTipQuality = '';
      }
 
      this.lastSelectedElementId= this.selectedElement.id
      
     
      if(this.selectedElement.aeris != null) {
          if  (this.selectedElement.aeris.comment != '') {
      this.toolTipQuality =this.selectedElement.aeris.quality;
      this.toolTipComment = this.selectedElement.aeris.comment
      }
     }
     this.tabName = "Edition"
     this.debugTrace(this.debug, "**handleObjectSelected end")
    },

    /*************************************/
    /*manage handle object modified event*/
    /*************************************/
    handleObjectModified: debounce(function(ev) {
      this.debugTrace(this.debug, "**handleObjectModified start")

      var el = ev.target;
      var canvas = this.getCurrentCanvas()
      var obj = {
        objectId: el.id,
        type: el.elementType,
        coords: {
          start: this.computeCoordsObject(el.aCoords.tl),
          stop:  this.computeCoordsObject(el.aCoords.br)
        },
        scale: this.scale
      };

      /* If element got additional informations, add it to the event object */
      obj.comment = el.aeris.comment,
      obj.quality = el.aeris.quality

      var event = new CustomEvent('selectionModified', { 'detail': obj })
      document.dispatchEvent(event);
      var activeObject = canvas.getActiveObject();

      canvas.renderAll();
      this.debugTrace(this.debug, "**handleObjectModified end")
    }, 100),
     /*******************/
    /*Get element by id */
    /********************/

    getDrawElementById : function(id){
       
      if ( id ===""){console.log("****** no last id")}
      else{ 
      this.debugTrace(this.debug, "**deleteEntry start")
      var canvas = this.getCurrentCanvas()
      var object ={}
      console.log(canvas)
      canvas.forEachObject(function(obj) {
     
        if (obj.id === id) {
          object = obj
        }
      })
      return object}
      this.debugTrace(this.debug, "**deleteEntry end")
    
    },

    /* -------------------- */
    /*  Zoom                */
    /* -------------------- */

    /***************/
    /* Handle zoom */
    /***************/
    zoomTo: function(point, canvas) {
      this.debugTrace(this.debug, "**zoomTo start")
      if (!point) return;
      canvas.zoomToPoint(point, this.scale);
      /* Regenerate rules */
      this.setRules();
      this.debugTrace(this.debug, "**zoomTo end")
    },

    /*******************************/
    /*manage the button zoom action*/
    /*******************************/
    buttonZoom: function(ev) {
      this.debugTrace(this.debug, "**buttonZoom start")
      var amnt = $(ev.target).closest('button').attr('data-amount');
      var canvas = this.getCurrentCanvas()
      this.scale = this.scale + (amnt / 10);
      if (this.scale < 1) {
        this.scale = 1;
        return;
      }

      var point = new fabric.Point(canvas.width / 2, canvas.height / 2);
      this.zoomTo(point, this.getCurrentCanvas());
      this.setRules();
      this.debugTrace(this.debug, "**buttonZoom end")
    },

    /******************************/
    /* Generate rules and markers */
    /******************************/
    setRules: function () {
      this.debugTrace(this.debug, "**setRules start")

      var canvas = this.getCurrentCanvas()
      this.pixelsBounds = this.getPixelBounds(canvas);

      /* Get min and max coordinates */
      var xMin = this.convert2unitX(this.pixelsBounds.bl.x,canvas);
      var xMax = this.convert2unitX(this.pixelsBounds.br.x,canvas);
      var yMin = this.convert2unitY(this.computeY(this.pixelsBounds.bl.y,canvas),canvas);
      var yMax = this.convert2unitY(this.computeY(this.pixelsBounds.tl.y,canvas),canvas);

      /* Generate markers */
      this.xmarks = [];
      this.ymarks = [];
      var arrX = [];
      var arrY = [];

      if (this.scaleXType === "time"){
        var xMin = this.pixelsBounds.bl.x 
        var xMax = this.pixelsBounds.br.x
        for (var i = 1; i < 13; i++) {
          var x = (((xMax - xMin) / 12) * i) + xMin;         
          var y = (((yMax - yMin) / 12) * i) + yMin;       
          var valx = this.convert2unitX(x,canvas);
          arrX.push(valx);
          
          arrY.push(Math.round(y * 10) / 10);
        }
      }else{
        for (var i = 1; i < 11; i++) {
          var x = (((xMax - xMin) / 10) * i) + xMin;
          var y = (((yMax - yMin) / 10) * i) + yMin;
          arrX.push(Math.round(x * 10) / 10);
          arrY.push(Math.round(y * 10) / 10);
        }
      }
      this.xmarks = arrX;
      this.ymarks = arrY;
      this.debugTrace(this.debug, "**setRules end")
    },

    /***************************************/
    /* Get coordinates of the view on zoom */
    /***************************************/
    getPixelBounds: function(canvas) {
      this.debugTrace(this.debug, "**getPixelBounds start")
      var invertedMatrix = fabric.util.invertTransform(canvas.viewportTransform);

      var topLeft = { x: 0, y: 0 };
      var bottomLeft = { x: 0, y: canvas.height };
      var topRight = { x: canvas.width, y: 0 };
      var bottomRight = { x: canvas.width, y: canvas.height };

      /* Get corners coordinates */
      var obj = {
        tl: fabric.util.transformPoint(topLeft, invertedMatrix),
        bl: fabric.util.transformPoint(bottomLeft, invertedMatrix),
        tr: fabric.util.transformPoint(topRight, invertedMatrix),
        br: fabric.util.transformPoint(bottomRight, invertedMatrix)
      };

      /* Avoid negative coordinates */
      if (obj.tl.x < 0) obj.tl.x = 0;
      if (obj.tl.y < 0) obj.tl.y = 0;
      if (obj.bl.x < 0) obj.bl.x = 0;
      if (obj.bl.y < 0) obj.bl.y = 0;
      if (obj.tr.x < 0) obj.tr.x = 0;
      if (obj.tr.y < 0) obj.tr.y = 0;
      if (obj.br.x < 0) obj.br.x = 0;
      if (obj.br.y < 0) obj.br.y = 0;

      this.debugTrace(this.debug, "**getPixelBounds end")
      return obj;
    },

    /*************************/
    /* Reset zoom to default */
    /*************************/
    resetZoom: function () {
      this.debugTrace(this.debug, "**resetZoom start")
      var canvas = this.getCurrentCanvas()
      this.scale = 1;
      this.setRules();
      this.resizeCanvas(canvas);
      canvas.viewportTransform = this.viewportTransform;

      this.zoomReset = false
      this.debugTrace(this.debug, "**resetZoom end")
    },

    /* -------------------- */
    /*  Control bar         */
    /* -------------------- */

    /**********************************/
    /* Activate / Deactivate draw mode*/
    /**********************************/
    drawMode: function () {
      this.debugTrace(this.debug, "**drawMode start")
      if (this.isPanning) this.isPanning = false;
      this.isDrawing = !this.isDrawing;
      this.debugTrace(this.debug, "**drawMode end")
    },

    /*********************************/
    /* Activate / Deactivate pan mode*/
    /*********************************/
    panMode: function () {
      this.debugTrace(this.debug, "**panMode start")
      if (this.isDrawing) this.isDrawing = false;
      this.isPanning = !this.isPanning;
      this.debugTrace(this.debug, "**panMode end")
    },

    /******************/
    /*Open/close panel*/
    /******************/
    openPanel : function () {
      this.debugTrace(this.debug, "**openPanel start")
      this.panelOpen = !this.panelOpen
      this.debugTrace(this.debug, "**openPanel end")
    },

    /******************************/
    /*Get type of element to draw */
    /******************************/
    getType: function () {
     
      return $("#drawType").val();
    },

    /************************************/
    /* Clear everything from the canvas */
    /************************************/
    clearCanvas: function () {
      this.debugTrace(this.debug, "**clearCanvas start")
      var canvas = this.getCurrentCanvas()
     
      canvas.clear();
      canvas.setBackgroundImage(this.img, canvas.renderAll.bind(canvas), {
        originX: 'left',
        originY: 'top'
      });
      canvas.renderAll();

      this.start = {
        x: 0,
        y: canvas.height
      };

      this.stop = {
        x: 0,
        y: canvas.height
      };
      this.resetZoom()
      this.debugTrace(this.debug, "**clearCanvas end")
    },

    /*********************/
    /* Toggle help panel */
    /*********************/
    toggleHelp: function () {
      this.debugTrace(this.debug, "**toggleHelp start")
      this.helpVisible = !this.helpVisible;
    },

    /* -------------------- */
    /*  Sidebar             */
    /* -------------------- */

    /**************************************/
    /* Save selected element informations */
    /**************************************/
    saveInformations: function (infos) {
      this.debugTrace(this.debug, "**saveInformations start")
     
      if (this._justDeleted) return;

      var el = this.selectedElement;

      if (!el) return;

      var obj = {
        objectId: el.id,
        type: el.elementType,
        coords: {
          start: this.computeCoordsObject(el.aCoords.tl),
          stop:  this.computeCoordsObject(el.aCoords.br)
        },
        scale: this.scale
      };

      if (Object.keys(infos).length) {
        el.aeris = infos;
        obj.comment = el.aeris.comment;
        obj.quality = el.aeris.quality;
      }

      this.selectedElement = null;
      var event = new CustomEvent('selectionModified', { 'detail': obj })
      document.dispatchEvent(event);
      this.debugTrace(this.debug, "**saveInformations end")
    },

    /**************************************/
    /* Clear selected element information */
    /**************************************/
    clearInformations: function () {
      this.debugTrace(this.debug, "**clearInformations start")
      var el = this.selectedElement;

      if (!el) return;

      this.comment = '';
      this.quality = '';
      el.aeris = null;

      var obj = {
        objectId: el.id,
        coords: {
          start: this.computeCoordsObject(el.aCoords.tl),
          stop: this.computeCoordsObject(el.aCoords.br)
        },
        scale: this.scale,
        comment: '',
        quality: ''
      };

      var event = new CustomEvent('selectionModified', { 'detail': obj })
      document.dispatchEvent(event);
      this.debugTrace(this.debug, "**clearInformations end")
    },

    /*************************/
    /*add new element manualy*/
    /*************************/
    addNewEntry : function() {
      this.debugTrace(this.debug, "**addNewEntry start")

      var newId = this.getId()
      this.manualElments[this.getCurrentCanvasId()].push({
                      "comment":'',
                      "quality":'',
                      "coords": {
                                "start": {
                                    "x":'' ,
                                    "y":'' 
                                  },
                                  "stop": {
                                    "x":'' ,
                                    "y":''
                                  }
                      },
                      "id":newId,
                      "elementType":"range"});
     
      this.debugTrace(this.debug, "**addNewEntry end")
    },

    /********************************/
    /*delete element created manualy*/
    /********************************/
    deleteEntry: function(id, index) {
      this.debugTrace(this.debug, "**deleteEntry start")

      this.manualElments[this.getCurrentCanvasId()].splice(index, 1)
      var canvas = this.getCurrentCanvas()

      canvas.forEachObject(function(obj) {

        if (obj.id === id) {
          canvas.remove(obj)
        }
      })

      this.debugTrace(this.debug, "**deleteEntry end")
    },

    /***********************/
    /*genrate id for entry*/
    /**********************/
    generateEntryId: function(id) {
      this.debugTrace(this.debug, "**generateEntryId start")
      if (id === "") {
        return this.getId()
      } else {
        return id
      }
      this.debugTrace(this.debug, "**generateEntryId end")
    },

    /************************************/
    /*Save element of the current canvas*/
    /************************************/
    saveCurrentCanvas : function() {
      
      this.debugTrace(this.debug, "**saveCurrentCanvas start")
      var saveDrawElt = {};
      var _this    = this
      var canvas   = this.getCurrentCanvas()
      var canvasId = this.getCurrentCanvasId()

      this.jsonPara[canvasId].elements = []
      this.manualElments[canvasId].forEach(function(elt) {

        if (elt.elementType === 'range') {
          elt.coords.start.y = _this.bounds.yMax;//max
          elt.coords.stop.y = 0
        }
      })

      Array.prototype.push.apply(this.jsonPara[canvasId].elements, this.manualElments[canvasId])
      canvas.forEachObject(function(obj) {

        saveDrawElt = {
          id: obj.id,
          coords: {
            start: _this.computeCoordsObject(obj.aCoords.tl),
            stop: _this.computeCoordsObject(obj.aCoords.br)
          },
          elementType: obj.elementType,
          comment: obj.aeris.comment,
          quality: obj.aeris.quality
        };

        var index = _this.manualElments[canvasId].findIndex(i => i.id === obj.id);

        if (index === -1) {          
          _this.jsonPara[canvasId].elements.push(saveDrawElt)
        }

      });

      var _this = this
      console.log(JSON.stringify(this.jsonPara[canvasId]))
      $.ajax({
        url: "http://localhost/save.txt",
        method: "POST",
        data: JSON.stringify(this.jsonPara[canvasId]),
        dataType: 'json'
      });
      this.debugTrace(this.debug, "**saveCurrentCanvas end")
    },

    /**********************************************/ 
    /*draw element with parameter of manualy entry*/
    /**********************************************/
    drawEntry : function(entryElt) {
      this.debugTrace(this.debug, "**drawEntry start")

      var _this = this
      var canvas =this.getCurrentCanvas();

      var pointer = {
        x: this.convert2pixelX(entryElt.coords.start.x,canvas),
        y: this.computeY(this.convert2pixelY(entryElt.coords.start.y,canvas),canvas)
      }
      _this.origX = pointer.x;
      _this.origY = pointer.y;
      var config = this.getElementConfig(entryElt.elementType, pointer,canvas);
      var controls = this.getElementControls(entryElt.elementType);

      var el = new fabric.Rect(config);
      el.setControlsVisibility(controls);
      el.id = entryElt.id;
      el.elementType = entryElt.elementType;

      var infos = {}

      if (entryElt.comment) infos.comment = entryElt.comment;
      if (entryElt.quality) infos.quality = entryElt.quality;
      
      el.aeris = infos;
      
      var yStart = 0
      var yStop  = 0

      if (entryElt.elementType === 'range'){
        var yStart = this.bounds.yMax;//max
        var yStop  = 0
      }else{
        yStart = entryElt.coords.start.y
        yStop  = entryElt.coords.stop.y
      }

      var pixels = {
        start: {
          x: this.convert2pixelX(entryElt.coords.start.x,canvas),
          y: this.computeY(this.convert2pixelY(yStart,canvas),canvas)
        },
        stop: {
          x: this.convert2pixelX(entryElt.coords.stop.x,canvas),
          y: this.computeY(this.convert2pixelY(yStop,canvas),canvas)
        }
      }

      var w = Math.abs(pixels.stop.x - pixels.start.x);
      var h = Math.abs(pixels.stop.y - pixels.start.y);
      el.set({ width: w });
      el.set({ height: h });
      canvas.add(el);
      canvas.renderAll();
      this.debugTrace(this.debug, "**drawEntry end")
    },

    /******************************************/
    /*remove all element of the current canvas*/
    /******************************************/
    removeAllElement :function() {
      this.debugTrace(this.debug, "**removeAllElement start")

      var canvas = this.getCurrentCanvas()
      var canvasId = this.getCurrentCanvasId()
      var _this = this

      canvas.forEachObject(function(obj) {

        _this.manualElments[canvasId].forEach(function(elt) {
          if (elt.id === obj.id) {

            var index = _this.manualElments[canvasId].findIndex(i => i.id === elt.id);
            _this.manualElments[canvasId].splice(index, 1)
          }
        })
        window.setTimeout(function() { canvas.remove(obj) }, 100)
      })
      this.debugTrace(this.debug, "**removeAllElement end")
    },

    /****************************************************/
    /*remove all elements of current canvas a reset zoom*/
    /****************************************************/
    removeAllElementAndResetZoom :function() {
      this.debugTrace(this.debug, "**removeAllElementAndResetZoom start")
      var canvas = this.getCurrentCanvas()
      var o = canvas.getActiveGroup();

      canvas.forEachObject(function(obj) {

        window.setTimeout(function() { canvas.remove(obj) }, 100)
      })
      this.resetZoom();
      this.debugTrace(this.debug, "**removeAllElementAndResetZoom end")
    },

    /**********************************/
    /*Get quality flag                */
    /**********************************/
    getQualityFlag : function(ev){
      this.debugTrace(this.debug, "**getQualityFlag start")
      this.qualityList = []
      var data = ev.detail

      var i = 0
      for (i = 0; i < data.length; i++) {
        this.qualityList.push(data[i])
      }

      console.log("qualityListe :")
      console.log(this.qualityList)
      console.log("getQualityFlag end")
      this.debugTrace(this.debug, "**getQualityFlag end")
    },

    /* -------------------- */
    /*  Utilities           */
    /* -------------------- */


    /************************************/ 
    /* Change cursor to given parameter */
    /************************************/
    changeCursor: function (cursorType,canvas) {
      canvas.defaultCursor = cursorType;
    },

    /********************************/
    /* Create element configuration */
    /********************************/
    getElementConfig: function (type, pointer,canvas) {

      if (type === 'zone') {
        this.config = {
          left: this.origX,
          top: this.origY,
          originX: 'left',
          originY: 'top',
          width: pointer.x - this.origX,
          height: pointer.y - this.origY,
          scaleX: 1,
          scaleY: 1,
          angle: 0,
          fill: 'rgba(255,255,255,0.2)',
          strokeWidth: 2,
          stroke: this.color,
          transparentCorners: false,
          selectable: true,
          lockRotation: true
        };
      } else if (type === 'range') {
        this.origY = 0;
        this.config = {
          left: this.origX,
          top: this.origY,
          originX: 'left',
          originY: 'top',
          width: pointer.x - this.origX,
          height: canvas.getHeight(),
          scaleX: 1,
          scaleY: 1,
          angle: 0,
          fill: 'rgba(255,255,255,0.2)',
          strokeWidth: 2,
          stroke: this.color,
          transparentCorners: false,
          selectable: true,
          lockRotation: true,
          lockMovementX: true,
          lockMovementY: true,
        };
      }
      return this.config;
    },

    /******************************************/
    /* Create elements controls configuration */
    /******************************************/
    getElementControls: function (type) {
      if (type === 'zone') {
        this.controls = {
          mt: true,
          mb: true,
          ml: true,
          mr: true,
          bl: true,
          br: true,
          tl: true,
          tr: true,
          mtr: false,
        }
      } else if (type === 'range') {
        this.controls = {
          mt: false,
          mb: false,
          ml: true,
          mr: true,
          bl: false,
          br: false,
          tl: false,
          tr: false,
          mtr: false,
        }
      }

      return this.controls;
    },

    /***************************/
    /* Convert object to array */
    /***************************/
    toArray: function (obj) {
      if (!obj) return;
      return Object.keys(obj).map(function (key) {
        return {
          name: key,
          value: obj[key]
        };
      });
    },

    /******************************************************/
    /* Return x coordinates in unit rounded to 2 decimals */
    /******************************************************/
    toDisplayX: function (x) {
        
      if (this.scaleXType === "time") {
        return this.convert2unitX(x, this.getCurrentCanvas())
      } else { 
        return this.round2(this.convert2unitX(x, this.getCurrentCanvas()));
      }
    },

    /******************************************************/
    /* Return y coordinates in unit rounded to 2 decimals */
    /******************************************************/
    toDisplayY: function (y) {

      return this.round2(this.convert2unitY(y,this.getCurrentCanvas()))
    },

    /*********************************/
    /* Generate a new id for element */
    /*********************************/
    getId: function () {
     
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    },

    /*************************************/
    /* Change color for activated button */
    /*************************************/
    computeColor: function (isActive) {
      return isActive ? 'active' : '';
    },

    /******************************/
    /* Convert coordinates object */
    /******************************/
    computeCoordsObject: function (obj) {
      var canvas = this.getCurrentCanvas()
      return {
        x: this.convert2unitX(obj.x,canvas),
        y: this.convert2unitY(this.computeY(obj.y,canvas),canvas)
      };

    },

    /***********************/
    /* Round to 2 decimals */
    /***********************/
    round2: function (num) {
      return Math.round(num * 10) / 10;
    },

    /************************************/
    /* Convert x in pixel to x in units */
    /************************************/
    convert2unitX: function (x,canvas) {

      if (this.scaleXType == "time") {

        if (canvas) {
          var ratio = 12 / canvas.width;
          var prop  = 2 * (x * ratio)
          var temp  = Math.trunc(prop)
          var min   = Math.trunc((prop - temp) * 60)
          if ( min < 10 ){min = "0"+min }
          prop = temp + ":" + min
          return prop;
        }
      }
      else {

        if (canvas) {
          var ratio = (this.bounds.xMax - this.bounds.xMin) / canvas.width;
          var prop = (x * ratio) + this.origBounds.xMin;
          return prop;
        }
      }
    },

    /************************************/
    /* Convert y in pixel to y in units */
    /************************************/
    convert2unitY: function (y,canvas) {
      
      if (this.scaleYType == "log") {

        if (canvas) {
          var ratio = (Math.log10(500)) / canvas.height;
          var prop = Math.pow(10, y * ratio)
          return prop;
        }
      } else {
        
        if (canvas) {
          var ratio = (this.bounds.yMax - this.bounds.yMin) / canvas.height;
          var prop = (y * ratio) + this.origBounds.yMin;
          return prop;
        }
      }
    },

    /*************************************/
    /* Convert x in units to x in pixels */
    /*************************************/
    convert2pixelX: function (x,canvas) {

     if (this.scaleXType == "time") {
      
        var ratio = 12 / canvas.width;
        var timeArray = x.split(":");
        var hour = timeArray[0]       
        var min = timeArray[1]        
        var minArr = min
        
        if (min < 10) { minArr = min.substring(1, 2) }
        min = minArr / 60        
        hour = parseInt(hour) + parseFloat(min)
        
        var xPixel = hour / (2 * ratio)        
        return parseInt(xPixel)
    }
    else {
        var ratio = (this.bounds.xMax - this.bounds.xMin) / canvas.width;
        var prop = (x - this.origBounds.xMin) / ratio;
        return Math.round(prop * 10) / 10;
    }
    },

    /*************************************/
    /* Convert y in units to y in pixels */
    /*************************************/
    convert2pixelY: function (y,canvas) {
      if (this.scaleYType == "log") {
       
        if (y <1){y=1}
        var ratio = (Math.log10(500)) / canvas.height;
        var yPixel=Math.log(y)/(ratio*Math.log(10))
        return yPixel;
      } else {
        var ratio = (this.bounds.yMax - this.bounds.yMin) / canvas.height;
        var prop = (y - this.origBounds.yMin) / ratio;
        return Math.round(prop * 10) / 10;
      }
  },

    /******************************************************/
    /* Convert canvas y coordinates to real y coordinates */
    /******************************************************/
    computeY: function (pos,canvas) {
     
     return pos === 0 ? canvas.height : (pos - canvas.height) * -1;
    },

    /************************/
    /*convert to upper case */
    /************************/
    capitalize: function (str) {
      return str.substring(0, 1).toUpperCase() + str.substr(1).toLowerCase();
    }

  }
}
</script>

 <style>
.comment textarea {
  resize: none;
  border: 1px solid #ddd;
  color:#555;
  border-radius: 3px;

}
#input {
  text-align: left;
  padding: 0px;
  margin: 0px; 
}

#input li {
  border-bottom: 1px solid #ddd
}

#input li:last-of-type {
  border-bottom:none
}

input[type="number"]:-moz-placeholder {
    text-align: right;
    margin-right:5px
}
input[type="number"]:-ms-input-placeholder {
    text-align: right;
    margin-right:5px
}
input[type="number"]::-webkit-input-placeholder {
    margin-right:15px;
    text-align: right;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {  

   opacity: 1;

}
.aeris-images-draw-host {
  
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  margin: 0;
  padding: 20px;
  color: #333;
  
  font-family: 'Open Sans', sans-serif
}

.aeris-images-draw-host .btn {
  color: #333;
  background: transparent;
  outline: none;
  border: 1px solid;
  font-size: 1.2em;
  cursor: pointer
}

.aeris-images-draw-host .btn:hover {
  background-color: #333;
  color: #fff
}

.aeris-images-draw-host .icon-button.active {
  color: orange
}

.aeris-images-draw-host .btn.active:hover {
  background-color: orange;
  color: #fff
}

.aeris-images-draw-component-container {
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex
}

.canvas-container {
  position: relative;
  /*margin-right: 10px*/
}

.aeris-images-draw-relative-container {
  position: relative;
  
}

.aeris-images-draw-zoom-panel {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: column nowrap;
  flex-flow: column nowrap;
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 9999
}

.aeris-images-draw-zoom-panel button {
  width: 30px;
  height: 30px;
  border: 1px solid;
  margin-bottom: 2px;
  opacity: 0.6;
  font-size: 16px;
  background-color:#aaaaaa;
  color: #fff;
  border-radius: 50%;
  padding: inherit;
}

.aeris-images-draw-zoom-panel button:hover {
  cursor: pointer;
  opacity: 1
}

.aeris-images-draw-control-panel {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: row wrap;
  flex-flow: row wrap;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-align: center;
  align-items: center;
  margin: 10px 0 0 50px;
  color: var(--text-color)
}

.aeris-images-draw-control-panel .buttons {
  display: -ms-flexbox;
  display: flex
}

.aeris-images-draw-control-panel .buttons>* {
  margin: 0 2px
}

.aeris-images-draw-control-panel .btn {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 16px
}

.aeris-images-draw-control-panel input,
.aeris-images-draw-control-panel select,
.aeris-images-draw-control-panel option {
  color: inherit;
  background: transparent;
  outline: none;
  border: 1px solid;
  cursor: pointer;
  
}

.aeris-images-draw-control-panel .coordinates {
  width: 150px;
  font-size: 12px;
  text-align: center
}

.aeris-images-draw-helpPanel {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.6)
}

.aeris-images-draw-helpPanel-content {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: column nowrap;
  flex-flow: column nowrap;
  -ms-flex-align: center;
  align-items: center
}

.aeris-images-draw-helpPanel-content ul {
  margin: 0 0 20px
}

.aeris-images-draw-helpPanel-content .close-button {
  margin: 0 auto;
  padding: 5px 30px;
  background-color: #2980B9;
  color: #fff;
  font-size: 1.2em;
  border: none;
  cursor: pointer
}

.aeris-images-draw-sidepanel {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: column nowrap;
  flex-flow: column nowrap;
  /*border-left: 1px solid #ccc;*/
  padding-left: 10px;
  margin-left: 10px
}

.aeris-images-sidepanel .informations {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: column nowrap;
  flex-flow: column nowrap
}

.aeris-images-draw-sidepanel .informations>* {
  box-sizing: border-box;
  outline: none;
  margin: 5px 0;
  height: 30px;
  min-width: 200px;
  border-color: inherit;
  color: inherit
}

.aeris-images-draw-sidepanel .informations textarea,
.aeris-images-draw-sidepanel .informations select {
  border: 1px solid #ddd;
  color:#555;
 
}

.aeris-images-draw-sidepanel .informations select {
  width: 200px;
  
}

.aeris-images-draw-sidepanel .informations textarea {
  height: 100px;
  resize: none;
 
}

.aeris-images-draw-sidepanel .informations .button-group {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: end;
  justify-content: flex-end
}

.aeris-images-draw-tooltip {
  position: absolute;
  color: #fff;
  border: 1px solid;
  
  max-width: 150px;
  word-wrap: break-word;
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.5)
}

.aeris-images-draw-tooltip:before {
  content: '';
  position: absolute;
  top: 0;
  right: 100%;
  width: 30px;
  height: 2px;
  background-color: #fff;
  -webkit-transform-origin: 100% 50%;
  transform-origin: 100% 50%;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg)
}

.aeris-images-draw-tooltip ul {
  list-style: none;
  padding: 0;
  margin: 0;

}

.aeris-images-draw-y-axis-container {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: stretch;
  align-items: stretch
}

.aeris-images-draw-x-axis,
.aeris-images-draw-y-axis {
  box-sizing: border-box;
  color: #333
}

.aeris-images-draw-x-axis {
  display: -ms-flexbox;
  display: flex;
  position: relative;
  width: calc(100% - 50px);
  height: 20px;
  margin-left: 50px
}

.aeris-images-draw-x-axis .aeris-images-draw-xmark {
  margin: 0;
  box-sizing: border-box;
  display: inline-block;
  width: 10%;
  height: 10px;
  border-right: 1px solid;
  text-align: right;
  font-size: 12px;
  line-height: 12px;
  padding: 5px
}

.aeris-images-draw-y-axis {
 
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column-reverse;
  flex-direction: column-reverse;
  -ms-flex-align: end;
  align-items: flex-end;
  width: 50px
}


.aeris-images-draw-y-axis .aeris-images-draw-ymark {
  position: relative;
  margin: 0;
  box-sizing: border-box;
  display: inline-block;
  height: 10%;
  width: 10px;
  text-align: right;
  font-size: 12px;
  line-height: 12px;
  padding: 5px 5px 0 0
}

.aeris-images-draw-y-axis .aeris-images-draw-ymark:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 1px;
  background-color: #333
}
.aeris-image-draw-log-axis {
  position: absolute;
 padding-right:2px;
  bottom: 0; 
  font-size: 12px; 
  border:solid 1px; 
  border-right:none; 
  border-bottom:none;
  border-left:none; 

}

.aeris-images-draw-control-input {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: row wrap;
  flex-flow: row wrap;
  -ms-flex-pack: justify;
  -ms-flex-align: center;
  align-items: center;
  margin: 10px 0 0 50px;
  color: var(--text-color)
}

.aeris-images-draw-control-input label {
  margin-left: 20px;
   margin-right: 10px;
}

.aeris-images-draw-control-input .buttons {
  display: -ms-flexbox;
  display: flex
}

.aeris-images-draw-control-input .buttons>* {
  margin: 0 2px
}

.aeris-images-draw-control-input .btn {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 16px;
  border-radius: 50%;
  color :white;
  background-color:  #4765a0;
  padding: inherit
}

.aeris-images-draw-control-input .input_coord{
  margin-left: 0;
  width : 70px
}

.aeris-images-draw-control-input .input_time{
  margin-left: 0;
  width : 90px
}

.aeris-images-draw-control-input input,
.aeris-images-draw-control-input select,
.aeris-images-draw-control-input option {
  color: inherit;
  background: transparent;
  outline: none;
  border: 1px solid #ddd;
  color:#555;
  border-radius: 3px;
  cursor: pointer
}

.selectQuality{
  text-overflow:ellipsis;
}

.spinner{
    position: absolute;
    height: 20px;
    width: 20px;
    top: 50%;
    left: 50%;
    margin-left: -50px;
    margin-top: -50px;
    background-size: 100%;
}

.icon-button{
    
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    /*border-radius: 50%;*/
    width: 3.3rem;
    height: 2.6rem;
    background: #eee;
    color: #fff;
    font-size: 1.3rem;
    cursor: pointer;
    background-color: #4765a0;
    border-radius: inherit;
}
.vue-tabs{
  font-size: 11px;
  font-weight: bold;
}
.tab-container{
  margin:5px;
  padding:5px;
  font-size: 15px;
  max-width:200px;
}

.tab-container textarea{
  border: solid 1px #ddd;
  height: 100px;
  resize: none;
  width:100%;
  color:#555;
  border-radius: 3px;
}


.tab-container select{
  color: inherit;
  background: transparent;
  outline: none;
  border: 1px solid #ddd;
  cursor: pointer;
  width:100%;
  height: 30px;
  color:#555;
  border-radius: 3px;
}

.tab-container input[type=button]{
  background: transparent;
   outline: none;
   border: 1px solid #ddd;
   color:#555;
   height: 30px;
   padding: inherit;
}



.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #4765a0;
  border-bottom: 16px solid #4765a0;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>