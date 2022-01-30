export const gravMap = (board) => {
    let flips = 0
    const gravProb = (board, y, x) => {
        const probMax = 1 //blackhole
        const r = board.reduce(
            (r, row, yR) =>
                row.reduce((_, cell, xR) => {
                    if (x === xR && y === yR) return r
                    const rTotal =
                        r.total + 1 / (Math.sqrt((x - xR) ** 2) + (y - yR) ** 2)

                    const rCell = cell
                        ? r.cell +
                          1 / (Math.sqrt((x - xR) ** 2) + (y - yR) ** 2)
                        : r.cell
                    return { total: rTotal, cell: rCell }
                }, null),
            { total: 0, cell: 0 }
        )

        const prob = (r.cell / 15 / r.total)  * .999
        if (isNaN(prob)) throw new Error()
        const value = Math.random() <= prob + .001
        if (value) flips++
        return value
    }
    const draftBoard = board.map((row, y) =>
        row.map((cell, x) => {
            return cell ? true : gravProb(board, y, x)
        })
    )
    console.log(flips)
    return draftBoard
}
