export default function PollItem({ option, vote, totalVotes, bgcolor, isSelected, setIsSelected }) {
  const percentage = totalVotes ==0 ? 0 : (vote / totalVotes) * 100;

  let styles = {};
  if (isSelected === option) {
    styles = {
      boxShadow: `0 0 2px ${bgcolor}, 0 0 10px ${bgcolor}, 0 0 14px ${bgcolor}`
    };
  }

  return (
    <div className="poll--option d-flex flex-column gap-1 mt-3 pt-2 ps-3 pe-3" onClick={() => setIsSelected(option)} style={styles}>
      <div className="d-flex justify-content-between">
        <h4 className="fw-semibold">{option}</h4>
        <h4 className="fw-semibold">{percentage.toFixed(1)}%</h4>
      </div>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${percentage}%`, backgroundColor: `${bgcolor}` }}></div>
      </div>
      <p>{vote} votes</p>
    </div>
  );
}
