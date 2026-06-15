import {
  FiCopy,
  FiMail,
  FiMessageCircle,
  FiSend,
  FiLinkedin
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const openShare = (url) => window.open(url, '_blank', 'noopener,noreferrer');

const ShareButtons = ({ shortUrl }) => {
  const encoded = encodeURIComponent(shortUrl);

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => {
          navigator.clipboard.writeText(shortUrl);
          toast.success('Link copied');
        }}
        className="action-btn"
      >
        <FiCopy /> Copy
      </button>
      <button
        onClick={() => openShare(`https://wa.me/?text=${encoded}`)}
        className="action-btn"
      >
        <FiMessageCircle /> WhatsApp
      </button>
      <button
        onClick={() => openShare(`https://t.me/share/url?url=${encoded}`)}
        className="action-btn"
      >
        <FiSend /> Telegram
      </button>
      <button
        onClick={() => openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`)}
        className="action-btn"
      >
        <FiLinkedin /> LinkedIn
      </button>
      <button
        onClick={() => openShare(`mailto:?subject=Check this link&body=${encoded}`)}
        className="action-btn"
      >
        <FiMail /> Email
      </button>
    </div>
  );
};

export default ShareButtons;
