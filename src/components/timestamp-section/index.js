import React from 'react';
import SectionHeader from '../section-header';
import IconButtonBar from '../icon-button-bar';
import './style.scss';

function TimeStampSection({ timestamps }) {
  if (!timestamps || timestamps.length < 2) return null;
  let prevCategory = timestamps[0].category;
  const timestampItems = timestamps.map((timestamp, index) => {
    if (index === 0) return null;
    const showHeader = timestamp.category !== prevCategory;
    if (showHeader) {
      prevCategory = timestamp.category;
    }
    return (
      <div className="body" key={index}>
        {showHeader && (
          <div>
            <SectionHeader title={timestamp.category} />
          </div>
        )}
        <div className="timestamp">
          <div className="date">{timestamp.date}</div>
          <div className="activity">
            <div className="title-row">
              <span className="title">{timestamp.title}</span>
              <span className="sub-title">{timestamp.subTitle}</span>
            </div>
            <div className="title-row">
              <span className="activity-content">{timestamp.content}</span>
            </div>
            {timestamp.links && <IconButtonBar links={timestamp.links} />}
          </div>
        </div>
      </div>
    );
  });
  return <div className="timestamp-section">{timestampItems}</div>;
}


export default TimeStampSection;
