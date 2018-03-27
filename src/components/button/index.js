import Vue from 'vue'

import ElRuleButton from './src/button';

/* istanbul ignore next */
ElRuleButton.install = function(Vue) {
    Vue.component(ElRuleButton.name, ElRuleButton);
};

export default ElRuleButton;