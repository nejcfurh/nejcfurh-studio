import { Flower } from 'lucide-react';

interface ManifestoCardProps {
  name: string;
  color: string;
  titleColor: string;
  content: string;
  commitments: string[];
  index?: number;
}

const ManifestoCard = ({
  name,
  color,
  titleColor,
  content,
  commitments,
  index = 0
}: ManifestoCardProps): React.ReactNode => {
  return (
    <div className="w-full rounded-3xl p-6" style={{ backgroundColor: color }}>
      <h2
        className="mb-4 font-decoy text-2xl font-bold md:text-3xl"
        style={{ color: titleColor }}
      >
        {index + 1}. {name}
      </h2>

      <p className="mb-6 font-archivo text-[#1e1e1e]/75 md:text-lg ">
        {content}
      </p>

      <div>
        <h3
          className="mb-3 font-decoy text-xl font-semibold md:text-2xl"
          style={{ color: titleColor }}
        >
          Our commitment
        </h3>

        <ul className="space-y-3">
          {commitments.map((commitment) => (
            <li
              key={commitment.length}
              className="flex items-start gap-2 text-[#1e1e1e]/75 md:text-lg"
            >
              <span className="min-w-[1.5rem] text-lg">
                <Flower className="opacity-50" size={20} />
              </span>
              <span>{commitment}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManifestoCard;
