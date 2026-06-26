import { CONTINENTS } from '../constants';
import ContinentRow from './ContinentRow';

const Projects = () => {
  return (
    <div className="absolute z-1 w-full border-t border-[#b7ab98]/25">
      {CONTINENTS.map((continent, i) => (
        <ContinentRow key={i} continent={continent} />
      ))}
    </div>
  );
};

export default Projects;
