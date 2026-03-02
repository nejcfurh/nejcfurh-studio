import { FiArrowUpRight } from 'react-icons/fi';

const ExampleTextComponent = () => {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
      <h2 className="col-span-1 text-3xl font-bold md:col-span-4 text-black">
        Additional content explaining the above card here.
      </h2>
      <div className="col-span-1 md:col-span-8">
        <p className="mb-4 text-xl text-neutral-600 md:text-2xl">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat quia
          ab dolores illum sapiente! In aperiam temporibus odio illo quasi
          doloremque, accusamus iure et vero perspiciatis dignissimos ab autem
          ad. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Excepturi, consequuntur aliquam eveniet voluptates adipisci impedit
          vero animi porro, alias, nam accusamus possimus debitis voluptatem
          consectetur et quas! Facere, exercitationem impedit!
        </p>
        <p className="mb-8 text-xl text-neutral-600 md:text-2xl">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat quia
          ab dolores illum sapiente! In aperiam temporibus odio illo quasi
          doloremque.
        </p>
        <button className="w-full rounded-3xl bg-neutral-900 px-9 py-3 text-xl text-white transition-colors hover:bg-neutral-700 md:w-fit">
          Learn more <FiArrowUpRight className="inline" />
        </button>
      </div>
    </div>
  );
};

export default ExampleTextComponent;
