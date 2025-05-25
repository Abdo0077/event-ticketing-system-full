const HighlightText = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <span key={index} className="bg-yellow-200">{part}</span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export default HighlightText; 