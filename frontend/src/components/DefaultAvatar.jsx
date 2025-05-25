const DefaultAvatar = ({ name, profilePicture }) => {
    console.log('DefaultAvatar props:', { name, profilePicture });
    console.log('Profile picture type:', typeof profilePicture);
    console.log('Profile picture length:', profilePicture?.length || 0);
  
    if (profilePicture && typeof profilePicture === 'string' && profilePicture.trim() !== '') {
      return (
        <div className="h-full w-full relative">
          <img
            src={profilePicture}
            alt={name}
            className="h-full w-full object-cover"
            onError={(e) => {
              console.error('Error loading profile picture:', e);
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('bg-gradient-to-br', 'from-fuchsia-500', 'to-purple-600');
              e.target.parentElement.innerHTML = `<span class="text-3xl font-bold text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">${name.charAt(0).toUpperCase()}</span>`;
            }}
          />
        </div>
      );
    }
  
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    
    return (
      <div className="h-full w-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
        <span className="text-3xl font-bold text-white">
          {initial}
        </span>
      </div>
    );
  };
  
  export default DefaultAvatar; 