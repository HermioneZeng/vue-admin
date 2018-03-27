<template>
    <div @click="handleClick" class="btn-warpper" v-if="show" :style="inlinestyle">
        <slot></slot>
    </div>
</template>

<style lang="stylus" scoped>
    .btn-warpper{
        display:inline-block;
    }
</style>
<script>
   export default {
        name:'ElRuleButton',
        componentName: 'ElRuleButton',
        data() {
            return {
                show:true
            }
        },
        props:[
            'ruleCode',
            'inlinestyle'
        ],
        created(){
            try{
                let ruleCodes = this.$store.state.ruleCodes;
                let rules = ruleCodes || [];
                if(this.ruleCode)
                    this.show = rules.indexOf(this.ruleCode) == - 1 ? false:true
            }catch(error){
                console.log("权限编码异常");
            }
        },
        methods:{
            handleClick(evt) {
                this.$emit('click', evt);
            }
        }
    }
</script>
