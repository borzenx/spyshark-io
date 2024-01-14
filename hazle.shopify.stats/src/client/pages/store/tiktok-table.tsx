import React, { useState } from 'react';

interface Data {
  poster: string;
  views: number;
  likes: number;
  comments: number;
  engagement: number;
  created_at: string;
  vph: number | string; // Allow for string representation of numbers
}

interface FilterableSortableTableProps {
  data: Data[];
}

const TiktokTable: React.FC<FilterableSortableTableProps> = ({ data }) => {
  const [sortCriteria, setSortCriteria] = useState<keyof Data>('created_at');
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const sortData = (criteria: keyof Data) => {
    if (sortCriteria === criteria) {
      setIsAscending(!isAscending);
    } else {
      setSortCriteria(criteria);
      setIsAscending(true);
    }
  };

  const getSortIndicator = (columnName: keyof Data) => {
    if (sortCriteria === columnName) {
      return isAscending ? '↑' : '↓';
    }
    return null;
  };

  let sortedData = [...data];

  if (sortCriteria === 'created_at') {
    sortedData.sort((a, b) => {
      return isAscending ? a.created_at.localeCompare(b.created_at) : b.created_at.localeCompare(a.created_at);
    });
  } else {
    sortedData.sort((a, b) => {
      const valueA = a[sortCriteria];
      const valueB = b[sortCriteria];

      if (sortCriteria === 'vph') {
        const numberA = typeof valueA === 'string' ? parseFloat(valueA) : valueA as number;
        const numberB = typeof valueB === 'string' ? parseFloat(valueB) : valueB as number;

        if (!isNaN(numberA) && !isNaN(numberB)) {
          return isAscending ? numberA - numberB : numberB - numberA;
        }
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return isAscending ? valueA - valueB : valueB - valueA;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return isAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      return 0; // Fallback for unhandled cases
    });
  }

  return (
    <table id="tiktok-table" className="table">
      <thead>
        <tr>
          <th></th>
          <th onClick={() => sortData('views')}>
            Views {getSortIndicator('views')}
          </th>
          <th onClick={() => sortData('likes')}>
            Likes {getSortIndicator('likes')}
          </th>
          <th onClick={() => sortData('comments')}>
            Comments {getSortIndicator('comments')}
          </th>
          <th onClick={() => sortData('engagement')}>
            Engagement {getSortIndicator('engagement')}
          </th>
          <th onClick={() => sortData('created_at')}>
            Publication Date {getSortIndicator('created_at')}
          </th>
          <th onClick={() => sortData('vph')}>
            VPH {getSortIndicator('vph')}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, index) => {
        const getRotation = (vph: number | string) => {
          const parsedVph = typeof vph === 'string' ? parseFloat(vph) : vph;
          const normalizedVph = parsedVph > 1000 ? 1000 : parsedVph;
          
          if (normalizedVph === 0) {
            return '-135deg';
          } else if (normalizedVph === 1000) {
            return '45deg';
          } else {
            const mappedRotation = (normalizedVph / 1000) * 180 - 135;
            return `${mappedRotation}deg`;
          }
        };

          return (
            <tr key={index}>
              <td id="poster"><img src={row.poster} alt={`Poster ${index}`} /></td>
              <td>{row.views} <i className="fa-solid fa-eye"></i></td>
              <td>{row.likes} <i className="fa-solid fa-heart"></i></td>
              <td>{row.comments} <i className="fa-solid fa-comment"></i></td>
              <td>
                <div className="rich-text">
                  <p className="badge bg-primary-500">{row.engagement}%</p>
                </div>
              </td>
              <td>{row.created_at}</td>
              <td>
                <div className="progress">
                  <div className="barOverflow">
                    <div className="bar"style={{ transform: `rotate(${getRotation(row.vph)})` }}></div>
                  </div>
                  <span>{row.vph}</span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TiktokTable;
