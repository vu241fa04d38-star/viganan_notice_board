import { useState } from "react";

export default function NoticeMedia({ notice, onVotePoll, isModal = false }) {
  const { photos, attachments, googleLinks, poll, id } = notice;
  const [voting, setVoting] = useState(false);

  const handleVote = async (optionIndex) => {
    if (!onVotePoll) return;
    setVoting(true);
    try {
      await onVotePoll(id, optionIndex);
    } finally {
      setVoting(false);
    }
  };

  const hasPhotos = Array.isArray(photos) && photos.length > 0;
  const hasFiles = Array.isArray(attachments) && attachments.length > 0;
  const hasLinks = Array.isArray(googleLinks) && googleLinks.length > 0;
  const hasPoll = poll && poll.question && Array.isArray(poll.options);

  if (!hasPhotos && !hasFiles && !hasLinks && !hasPoll) return null;

  return (
    <div className="notice-media-block">
      {/* Photos */}
      {hasPhotos && (
        <div className={`media-photos ${isModal ? "media-photos--modal" : ""}`}>
          {photos.map((src, i) => (
            <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="photo-card-link">
              <img src={src} alt="Notice attachment" className="media-photo" />
            </a>
          ))}
        </div>
      )}

      {/* Google Links */}
      {hasLinks && (
        <div className="google-links-container">
          {googleLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="google-link-pill"
            >
              <span className="google-icon">📑</span>
              <span className="google-link-title">{link.title}</span>
              <span className="google-arrow">↗</span>
            </a>
          ))}
        </div>
      )}

      {/* File Attachments */}
      {hasFiles && (
        <div className="attachments-list">
          {attachments.map((file, i) => (
            <a
              key={i}
              href={file.dataUrl}
              download={file.name}
              className="attachment-download-chip"
              title={`Download ${file.name}`}
            >
              <span>📎</span>
              <span className="att-name">{file.name}</span>
              {file.size > 0 && <span className="att-size">({Math.round(file.size / 1024)} KB)</span>}
              <span className="att-dl">⬇</span>
            </a>
          ))}
        </div>
      )}

      {/* Interactive Poll */}
      {hasPoll && (
        <div className="poll-box">
          <div className="poll-head">
            <span className="poll-badge">📊 Poll</span>
            <span className="poll-question">{poll.question}</span>
            <span className="poll-total-votes">{poll.totalVotes} vote{poll.totalVotes === 1 ? "" : "s"}</span>
          </div>

          <div className="poll-options">
            {poll.options.map((opt) => {
              const isSelected = poll.userVotedIndex === opt.index;
              const hasVoted = poll.userVotedIndex !== -1;

              return (
                <div
                  key={opt.index}
                  className={`poll-option ${isSelected ? "poll-option--selected" : ""}`}
                >
                  <div
                    className="poll-option__bar"
                    style={{ width: `${opt.percentage}%` }}
                  />
                  <div className="poll-option__content">
                    <span className="poll-option__text">
                      {isSelected && "✓ "}
                      {opt.text}
                    </span>
                    <span className="poll-option__meta">
                      {hasVoted ? `${opt.percentage}% (${opt.votesCount})` : ""}
                    </span>
                  </div>
                  {onVotePoll && (
                    <button
                      type="button"
                      className={`btn btn--sm poll-vote-btn ${isSelected ? "btn--primary" : ""}`}
                      disabled={voting}
                      onClick={() => handleVote(opt.index)}
                    >
                      {isSelected ? "Voted" : "Vote"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
