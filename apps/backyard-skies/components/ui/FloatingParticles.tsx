const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/40"
          style={{
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
            animation: `float-particle ${3 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.3) % 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
