import { useEffect, useState } from "react"
import Cell from './Cell'

const Game = () => {
    const [size, setSize] = useState(8)
    const [mines, setMines] = useState(8)
    const [boardParams, setBoardParams] = useState({size, size, mines})
    const [boardData, setBoardData] = useState([])
    const [gameOver, setGameOver] = useState(false)
    const [gameWin, setGameWin] = useState(false)

    // Init board
    const initBoard = (e) => {
        !!e && e.preventDefault()

        setGameOver(false)
        setGameWin(false)
        setBoardParams({size, mines})

        // Create empty board
        let newBoardData = []
        for (let y = 0; y < size; y ++) {
            newBoardData.push([])

            for  (let x = 0; x < size; x ++) {
                newBoardData[y][x] = {
                    x,y,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighbors: 0
                }
            }
        }

        // Place mines and add helpers
        let m = mines
        while (m > 0) {
            let x = Math.floor(Math.random() * 8)
            let y = Math.floor(Math.random() * 8)

            if (!newBoardData[y][x].isMine) {
                newBoardData[y][x].isMine = true

                for (let y2 = Math.max(0, y -1); y2 <= Math.min(size - 1 , y + 1); y2 ++) {
                    for (let x2 = Math.max(0,x -1); x2 <= Math.min(size - 1, x + 1); x2 ++) {
                        newBoardData[y2][x2].neighbors ++
                    }
                }
                m --
            }
        }

        // Update State
        setBoardData([...newBoardData])
    }

    const onCellRightClick = (e, {x,y}) => {
        e.preventDefault()

        let newBoardData = boardData
        newBoardData[y][x].isFlagged = !newBoardData[y][x].isFlagged
        setBoardData([...newBoardData])
    }

    const onCellClick = ({x ,y ,isMine, isFlagged, neighbors}) => {
        if (isFlagged) return

        let newBoardData = boardData
        newBoardData[y][x].isRevealed = true

        // If mine explode
        if (isMine) {
            // BOOM
            setGameOver(true)
        }

        else {
            // If no neighbors, reveal adjacent cells
            if (neighbors === 0) {
                let queue = [
                    {x: x - 1, y: y},
                    {x: x + 1, y: y},
                    {x: x, y: y - 1},
                    {x: x, y: y + 1}
                ]
                while (queue.length > 0) {
                    let {x,y} = queue.pop()
                    if (x >= 0 && x < boardParams.size && y >= 0 && y < boardParams.size && !newBoardData[y][x].isRevealed) {
                        if (!newBoardData[y][x].isFlagged) newBoardData[y][x].isRevealed = true
                        if (newBoardData[y][x].neighbors === 0) {
                            queue.push({x: x - 1, y: y})
                            queue.push({x: x + 1, y: y})
                            queue.push({x: x, y: y - 1})
                            queue.push({x: x, y: y + 1})
                        }
                    }
                }
            }

            // Calculate remaining
            const unrevealedCells = newBoardData.map(arr => arr.filter(cell => !cell.isRevealed).length).reduce((a,b) => a + b)
            if (unrevealedCells === boardParams.mines) {
                setGameWin(true)
            }
        }

        // Update state
        setBoardData([...newBoardData])
    }

    useEffect(initBoard, [])

    return <>
        <div className="game-container">
            {/* DIFFICULTY */}
            <div className="game-params">
                <form onSubmit={initBoard}>
                    <div>
                        <label htmlFor="size">size</label>
                        <input type="number" name="size" id="size" value={size} onChange={e => setSize(e.target.value)} min={1} max={16}/>
                    </div>
                    <div>
                        <label htmlFor="mines">mines</label>
                        <input type="number" name="mines" id="mines" value={mines} onChange={e => setMines(e.target.value)} min={1} max={size * size}/>
                    </div>
                    <button type="submit">reset</button>
                </form>
            </div>
            {/* BOARD */}
            <div className={`game-grid ${(gameOver || gameWin) && 'noTouch'}`} style={{display: 'grid',gridTemplateColumns: `repeat(${boardParams.size}, 1fr)`}}>
                {boardData.map(col => (col.map(cell => (
                    <Cell key={`${cell.x}-${cell.y}`} cell={cell} onCellClick={onCellClick} onCellRightClick={onCellRightClick}/>
                    ))))}
            </div>
            {/* GAME OVER */}
            {gameOver && (
                <div className="game-modal">
                    <p>Game Over</p>
                    <button onClick={initBoard}>Retry</button>
                </div>
            )}
            {/* GAME WIN */}
            {gameWin && (
                <div className="game-modal">
                    <p>You win</p>
                    <button onClick={initBoard}>Play again ?</button>
                </div>
            )}
        </div>
    </>
}

export default Game