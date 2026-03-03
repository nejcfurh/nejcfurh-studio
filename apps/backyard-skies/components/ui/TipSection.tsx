const TipSection = ({
  title,
  icon,
  children
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-2xl border border-white/6 bg-black/40 p-4 backdrop-blur-xl">
      <p className="mb-2.5 flex items-center gap-2.5 text-base font-bold text-white">
        <span className="text-xl">{icon}</span> {title}
      </p>
      <ul className="flex list-none flex-col gap-2 pl-0 text-[13px] leading-relaxed text-white/70">
        {children}
      </ul>
    </div>
  );
};

export default TipSection;
