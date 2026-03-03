const TipSection = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/6">
      <p className="font-bold text-white text-base mb-2.5 flex items-center gap-2.5">
        <span className="text-xl">{icon}</span> {title}
      </p>
      <ul className="list-none pl-0 flex flex-col gap-2 text-[13px] text-white/70 leading-relaxed">
        {children}
      </ul>
    </div>
  );
};

export default TipSection;
