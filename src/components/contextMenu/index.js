import Vue from 'vue'

import ElContextMenu from './src/contextMenu.vue';

/* istanbul ignore next */
ElContextMenu.install = function(Vue) {
    Vue.component(ElContextMenu.name, ElContextMenu);
};

export default ElContextMenu;
