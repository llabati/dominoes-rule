<template lang="pug">
    div(:class="{ intro: show, hidden: !show }")
        label.lead(for='name') Placer le domino à gauche ou à droite ?
        form.input-zone
            select.input-name(name='side' ref='side' v-model='side')
                option gauche
                option droite
            button.btn-name(@click='close') Choisissez
    
</template>

<script>
import { store } from '../store/index'
export default {
    data(){
        return {
            show: true,
            side: ''
        }
    },
    store,
    methods: {
        close(e){
            e.preventDefault()
            this.$emit('chosenSide', this.side)
            this.show = false
        }
    },
    directives: {
        focus(el){
            el.focus()
        }
    }
}
</script>

<style scoped>
.intro {
    width: 30%;
    position: relative;
    top: 300px;
    margin: 20px auto;
    padding: 15px;
    border: solid 3px white;
    border-radius: 5px;
    box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, .3);
    z-index: 10;
    background-color: brown;
    color: white;
    animation: GetVisible 3s ease;
}
.input-zone {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 80%;
    background-color: white;
    border: solid 2px red;
    margin: 10px auto;
}
.input-name {
    width: 66%;
    margin: 0;
    border: 1px;
    height: 100%;
    font-size: 20px;
    padding: 5px;
}
.btn-name {
    display: inline-block;
    width: 33%;
    margin: 0;
    padding: 2px 10px;
    border-radius: 5px;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, .3);
    background-color: green;
    color: white;
    font-weight: 400;
    text-transform: uppercase;
    cursor: pointer;
}
.hidden {
    display: none;
}
@keyframes GetVisible {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
@keyframes GetInvisible {
    0% {
        /*transform: scale(1);*/
        opacity: 1;
        z-index: 10;
    }
    /*20% {
        transform: scale(1.4);
        opacity: 0.9;
    }*/
    100% {
        /*transform: scale(0);*/
        opacity: 0;
        z-index: -5;
    }
}




</style>
