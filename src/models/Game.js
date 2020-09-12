class Game {
    constructor(player, machine){
        this.human = {
            name = player.name,
            score = player.score,
            victories = player.victories
        }
        this.machine = {
            name = 'IA',
            score = machine.score,
            victories = machine.victories
        }
    }
}

export default Game