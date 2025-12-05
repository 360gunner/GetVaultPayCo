export default function Table({ headers, rows }) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        <li className="px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-4 gap-4">
            {headers.map((header, idx) => (
              <div key={idx} className="text-sm font-medium text-gray-900">{header}</div>
            ))}
          </div>
        </li>
        {rows.map((row, idx) => (
          <li key={idx} className="px-6 py-4">
            <div className="grid grid-cols-4 gap-4">
              {row.map((cell, cellIdx) => (
                <div key={cellIdx} className="text-sm text-gray-900">{cell}</div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
