import Vue from 'vue'

import ElTreeSelect from './src/treeSelect';

/* istanbul ignore next */
ElTreeSelect.install = function(Vue) {
    Vue.component(ElTreeSelect.name, ElTreeSelect);
};

export default ElTreeSelect;