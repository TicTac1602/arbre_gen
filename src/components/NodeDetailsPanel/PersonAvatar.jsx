function PersonAvatar({ name }) {
  const bgColor = 'bg-gradient-to-br from-blue-500 to-indigo-600';

  return (
    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 ${bgColor}`}>
      {name ? name.charAt(0).toUpperCase() : '?'}
    </div>
  );
}

export default PersonAvatar;
