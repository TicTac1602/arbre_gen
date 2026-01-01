function PersonAvatar({ name, gender }) {
  const bgColor = gender === 'male' 
    ? 'bg-gradient-to-br from-blue-400 to-blue-600'
    : gender === 'female' 
    ? 'bg-gradient-to-br from-pink-400 to-pink-600'
    : 'bg-gradient-to-br from-purple-400 to-purple-600';

  return (
    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 ${bgColor}`}>
      {name ? name.charAt(0).toUpperCase() : '?'}
    </div>
  );
}

export default PersonAvatar;
