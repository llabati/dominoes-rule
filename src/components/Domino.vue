<template>
    <div @click="chooseForLeft" @dblclick="chooseForRight">
        <img v-if="value[0] === 1 && value[1] === 0" class="domino domino-swap" src="../assets/0-1.png">
        <img v-if="value[0] === 2 && value[1] === 0" class="domino domino-swap" src="../assets/0-2.png">
        <img v-if="value[0] === 3 && value[1] === 0" class="domino domino-swap" src="../assets/0-3.png">
        <img v-if="value[0] === 4 && value[1] === 0" class="domino domino-swap" src="../assets/0-4.png">
        <img v-if="value[0] === 5 && value[1] === 0" class="domino domino-swap" src="../assets/0-5.png">
        <img v-if="value[0] === 6 && value[1] === 0" class="domino domino-swap" src="../assets/0-6.png">
        <img v-if="value[0] === 2 && value[1] === 1" class="domino domino-swap" src="../assets/1-2.png">
        <img v-if="value[0] === 3 && value[1] === 1" class="domino domino-swap" src="../assets/1-3.png">
        <img v-if="value[0] === 4 && value[1] === 1" class="domino domino-swap" src="../assets/1-4.png">
        <img v-if="value[0] === 5 && value[1] === 1" class="domino domino-swap" src="../assets/1-5.png">
        <img v-if="value[0] === 6 && value[1] === 1" class="domino domino-swap" src="../assets/1-6.png">
        <img v-if="value[0] === 3 && value[1] === 2" class="domino domino-swap" src="../assets/2-3.png">
        <img v-if="value[0] === 4 && value[1] === 2" class="domino domino-swap" src="../assets/2-4.png">
        <img v-if="value[0] === 5 && value[1] === 2" class="domino domino-swap" src="../assets/2-5.png">
        <img v-if="value[0] === 6 && value[1] === 2" class="domino domino-swap" src="../assets/2-6.png">
        <img v-if="value[0] === 4 && value[1] === 3" class="domino domino-swap" src="../assets/3-4.png">
        <img v-if="value[0] === 5 && value[1] === 3" class="domino domino-swap" src="../assets/3-5.png">
        <img v-if="value[0] === 6 && value[1] === 3" class="domino domino-swap" src="../assets/3-6.png">
        <img v-if="value[0] === 5 && value[1] === 4" class="domino domino-swap" src="../assets/4-5.png">
        <img v-if="value[0] === 6 && value[1] === 4" class="domino domino-swap" src="../assets/4-6.png">
        <img v-if="value[0] === 6 && value[1] === 5" class="domino domino-swap" src="../assets/5-6.png"> 
        <img v-if="value[0] === 0 && value[1] === 0" class="domino" src="../assets/0-0.png"> 
        <img v-if="value[0] === 0 && value[1] === 1" class="domino" src="../assets/0-1.png">
        <img v-if="value[0] === 0 && value[1] === 2" class="domino" src="../assets/0-2.png">
        <img v-if="value[0] === 0 && value[1] === 3" class="domino" src="../assets/0-3.png">
        <img v-if="value[0] === 0 && value[1] === 4" class="domino" src="../assets/0-4.png">
        <img v-if="value[0] === 0 && value[1] === 5" class="domino" src="../assets/0-5.png">
        <img v-if="value[0] === 0 && value[1] === 6" class="domino" src="../assets/0-6.png">
        <img v-if="value[0] === 1 && value[1] === 1" class="domino" src="../assets/1-1.png">
        <img v-if="value[0] === 1 && value[1] === 2" class="domino" src="../assets/1-2.png">
        <img v-if="value[0] === 1 && value[1] === 3" class="domino" src="../assets/1-3.png">
        <img v-if="value[0] === 1 && value[1] === 4" class="domino" src="../assets/1-4.png">
        <img v-if="value[0] === 1 && value[1] === 5" class="domino" src="../assets/1-5.png">
        <img v-if="value[0] === 1 && value[1] === 6" class="domino" src="../assets/1-6.png">
        <img v-if="value[0] === 2 && value[1] === 2" class="domino" src="../assets/2-2.png">
        <img v-if="value[0] === 2 && value[1] === 3" class="domino" src="../assets/2-3.png">
        <img v-if="value[0] === 2 && value[1] === 4" class="domino" src="../assets/2-4.png">
        <img v-if="value[0] === 2 && value[1] === 5" class="domino" src="../assets/2-5.png">
        <img v-if="value[0] === 2 && value[1] === 6" class="domino" src="../assets/2-6.png">
        <img v-if="value[0] === 3 && value[1] === 3" class="domino" src="../assets/3-3.png">
        <img v-if="value[0] === 3 && value[1] === 4" class="domino" src="../assets/3-4.png">
        <img v-if="value[0] === 3 && value[1] === 5" class="domino" src="../assets/3-5.png">
        <img v-if="value[0] === 3 && value[1] === 6" class="domino" src="../assets/3-6.png">
        <img v-if="value[0] === 4 && value[1] === 4" class="domino" src="../assets/4-4.png">
        <img v-if="value[0] === 4 && value[1] === 5" class="domino" src="../assets/4-5.png">
        <img v-if="value[0] === 4 && value[1] === 6" class="domino" src="../assets/4-6.png">
        <img v-if="value[0] === 5 && value[1] === 5" class="domino" src="../assets/5-5.png">
        <img v-if="value[0] === 5 && value[1] === 6" class="domino" src="../assets/5-6.png">
        <img v-if="value[0] === 6 && value[1] === 6" class="domino" src="../assets/6-6.png"> 
    </div>
</template>

<script>
export default {
    props: {
        value: Array
    },
    methods: {
        chooseForLeft(){
            this.$emit('chosenLeft')
        },
        chooseForRight(){
            this.$emit('chosenRight')
        }
    }
}
</script>

<style>

.domino {
    height: 50px;
    width: 100px;
    margin: 3px;
    border: solid 1px black;
}
.domino-vert {
    transform: rotate(0.75turn);
}
.domino-swap {
    transform: rotate(0.25turn);
}
.domino-mid {
    transform: rotate(0.50turn);
}
/*.half-domino {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    border: solid 2px black;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.row-in-domino {
    height: 24px;
    padding: 2px;
}
.surdot {
    display: inline-block;
    width: 30%;
}
.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: black;
    margin: 0 auto;
}

.img-container {
    padding: 0;
}
.domino-value {
    width: 100%;
}*/
</style>
