<template lang="pug">
    div(:class="{ intro: show, hidden: !show }")
        p.alert {{ notification }}
        button.btn-notif(@click='close') Continuez
    
</template>

<script>
//import { store } from '../store/index'
export default {
    props: {
        notification: String
    },
    data(){
        return {
            show: true,
            name: ''
        }
    },
    store,
    methods: {
        named(){
            },
        close(e){
            e.preventDefault()
            this.show = false
        }
    },
    
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
.btn-notif {
    float: right;
    margin: 10px;
    padding: 10px;
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
