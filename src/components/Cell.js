const Cell = ({cell, onCellClick, onCellRightClick}) => (<>
    {!cell.isRevealed ? (
        <div className="cell">
            <button onContextMenu={(e) => onCellRightClick(e, cell)} onClick={() => onCellClick(cell)}>{cell.isFlagged ? '🚩' : ''}</button>
        </div>
    ) : (
        <div className={`cell ${cell.isMine && 'cell--mine'} cell--${cell.neighbors}`}>
            <span>{cell.isMine ? '💣' : cell.neighbors > 0 ? cell.neighbors : ''}</span>
        </div>
    )}
</>)

export default Cell