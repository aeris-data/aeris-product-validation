require("exports-loader?!./l.min.js")

import Vue from 'vue';

import vueCustomElement from 'vue-custom-element'
import vueNavTabs from 'vue-nav-tabs'
import vueResource from 'vue-resource'
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue'

import AerisValidationProduct from './aeris-validation-product/aeris-validation-product.vue';
import AerisDrawImage from './aeris-image-draw/aeris-images-draw.vue';
import AerisDayImage from './aeris-image-draw/aeris-day-image.vue';
import AerisInstrumentSelect from './aeris-image-draw/aeris-instrument-select.vue';

Vue.use(vueCustomElement);
Vue.use(vueNavTabs);
Vue.use(Highcharts);
Vue.use(HighchartsVue);
Vue.use(vueResource);


ljs.addAliases({
    dep: ['https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
          'https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.1/css/pikaday.css',
          'https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.7.0/css/perfect-scrollbar.css',
          "https://unpkg.com/vue-nav-tabs/themes/vue-tabs.css", 
          
          "https://unpkg.com/vue-nav-tabs/dist/vue-tabs.js",
          'https://cdnjs.cloudflare.com/ajax/libs/document-register-element/1.4.1/document-register-element.js',
          'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.19.1/moment-with-locales.min.js',
          "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js",
          'https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.1/pikaday.js',
          'https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.7.0/js/perfect-scrollbar.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.7.20/fabric.js',
          "https://unpkg.com/vue/dist/vue.min.js",
          "https://unpkg.com/highcharts/highcharts.js",
           //<!-- vue-highcharts should be load after Highcharts -->
           "https://cdnjs.cloudflare.com/ajax/libs/highcharts/6.0.7/js/modules/data.js",
           "https://code.highcharts.com/modules/exporting.js",
           "https://code.highcharts.com/maps/modules/map.js"
          ]
})
ljs.load('dep', function() {
    
    Vue.customElement('aeris-images-draw', AerisDrawImage);
    Vue.customElement('aeris-day-images', AerisDayImage);
    Vue.customElement('aeris-instrument-select',AerisInstrumentSelect);
    Vue.customElement('aeris-validation-product', AerisValidationProduct);

   
})
