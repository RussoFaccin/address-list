/* ##################################################
  ROOT COMPONENT
################################################## */

var app = new Vue({
  el: '#app',
  data: {
    restaurantes: ['AAA', 'BBB'],
    modal_opened: false,
    API_KEY: 'AIzaSyDFOzA7-cOFg0rhq_cuwv0PFiIGZwaOUqo',
    // Styles
    styles: {
      storeList: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        padding: 0
      },
      modalMap: {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      },
      map: {
        backgroundColor: '#FFF',
        width: 'calc(100vw - 5vw)',
        height: 'calc(100vh - 5vw)'
      },
      mapClose: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        border: '2px solid #FFF',
        backgroundColor: '#000',
        color: '#FFF',
        zIndex: '2'
      },
      mapHighlight: {
        backgroundColor: '#AAA'
      }
    }
  },
  template: `
    <div id="lojas-list">
      <ul :style="styles.storeList">
        <loja-item v-for="(loja, index) in restaurantes" :loja="loja" :actionSelect="onSelectLoja" />
      </ul>
      <div v-show="modal_opened" id="modal-map" :style="styles.modalMap">
        <button :style="styles.mapClose" v-on:click="onCloseModal">X</button>
        <div id="map" :style="styles.map"></div>
      </div>
    </div>
  `,
  methods: {
    onSelectLoja(loja) {
      this.modal_opened = true;
      var position = {lat: Number(loja.lat), lng: Number(loja.lng)};
      var map = new google.maps.Map(document.querySelector('#map'), {
        center: position,
        zoom: 20
      });
      var marker = new google.maps.Marker({
        position: position,
        map: map
      });
    },
    onCloseModal() {
      this.modal_opened = !this.modal_opened;
    }
  },
  beforeCreate() {
    fetch('data/lista-lojas.json').then(response => {
      response.json().then(data => {
        data.restaurantes.map((item, index) => {
          item.thumbUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${item.lat},${item.lng}&zoom=18&scale=1&size=600x300&maptype=roadmap&key=${this.API_KEY}&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:%7C${item.lat},${item.lng}&key=${this.API_KEY}&format=png&visual_refresh=true`;
        });
        this.restaurantes = data.restaurantes;
      });
    });
  },
  mounted() {}
});

/* ##################################################
  LOJA-ITEM COMPONENT
################################################## */

Vue.component('loja-item', {
  data(){
    return {
      styles: {
        lojaItem: {
          flexBasis: '31.4%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#EEE',
          padding: '2vw',
          margin: '2vw 0',
          cursor: 'default',
          img: {
            width: '100%',
            height: 'auto',
            margin: '0 auto'
          }
        },
        modalMap: {
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)'
        },
        lojaHighlight: {
          backgroundColor: '#AAA'
        }
      },
      selectedStore: null
    }
  },
  methods: {
    onClick() {
      this.actionSelect(this.loja);
    },
    onMouseOver() {
      this.selectedStore = {
        backgroundColor: '#AAA'
      };
    },
    onMouseOut() {
      this.selectedStore = null;
    }
  },
  created() {},
  props: ['loja', 'actionSelect'],
  template: `
    <li :style="[styles.lojaItem, selectedStore]" v-on:click="onClick" v-on:mouseover="onMouseOver" v-on:mouseout="onMouseOut">
      <p>{{loja.endereco}} - {{loja.complemento}} - {{loja.bairro}} - {{loja.cidade}} - {{loja.estado}}</p>
      <img width="600" :src="loja.thumbUrl" :style="styles.lojaItem.img">
    </li>`
});