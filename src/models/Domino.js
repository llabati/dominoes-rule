class Domino {
    constructor(x, y){
        this.value = []
        this.value[0] = x
        this.value[1] = y
        this.isDouble = this.isDouble()
        this.left = true
        this.swap = false
        this.player = true
    }
    isDouble(){
        return this.value[0] === this.value[1]
    }
}

export default Domino