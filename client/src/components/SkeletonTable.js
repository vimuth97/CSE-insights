export default function SkeletonTable({ rowCount = 5, columnCount = 6 }) {
  return (
    <div className="table-wrapper">
      <table className="market-table skeleton-table">
        <thead>
          <tr>
            {Array.from({ length: columnCount }).map((_, i) => (
              <th key={i} scope="col" className="skeleton-header">
                <div className="skeleton-box skeleton-header-box" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, rowIdx) => (
            <tr
              key={rowIdx}
              className={rowIdx % 2 === 0 ? "row-odd" : "row-even"}
            >
              {Array.from({ length: columnCount }).map((_, colIdx) => (
                <td key={colIdx} className={colIdx > 0 ? "num" : ""}>
                  <div className="skeleton-box skeleton-cell-box" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
