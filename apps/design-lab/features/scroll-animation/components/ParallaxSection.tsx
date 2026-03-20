import ExampleTextComponent from './ExampleTextComponent';
import TextParallaxContent from './TextParallaxContent';

const ParallaxSection = () => {
  return (
    <div className="bg-white">
      {/* APPLE DEVICES */}
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1658933161439-bbc61172d86b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="Ecosystem"
        heading="Meant for all of us."
      >
        <ExampleTextComponent />
      </TextParallaxContent>
      {/* APPLE DEVICES + GAMING */}
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1630168567476-cb79a02d3f9d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="Fun, Fast, Powerful"
        heading="Made for the pros, by the pros."
      >
        <ExampleTextComponent />
      </TextParallaxContent>
      {/* WORKING TOGETHER */}
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1630168567476-cb79a02d3f9d?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="Working Together"
        heading="It's better when we're all in it together."
      >
        <ExampleTextComponent />
      </TextParallaxContent>
    </div>
  );
};

export default ParallaxSection;
