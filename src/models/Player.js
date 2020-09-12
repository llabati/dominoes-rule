class Player {
    constructor(name){
        this.name = name
        this.hand = []
        this.victories = 0
        this.points = 0
        this.isWinner = this.isWinner()
        this.isFinalWinner = this.isFinalWinner()
    }

    isWinner(){
        return false
    }
    isFinalWinner(){
        return false
    }

}

export default Player