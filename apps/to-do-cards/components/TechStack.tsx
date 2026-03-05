export default function TechStack() {
  const icons = [
    'devicon-html5-plain-wordmark colored',
    'devicon-css3-plain-wordmark colored',
    'devicon-tailwindcss-original-wordmark colored',
    'devicon-bootstrap-plain-wordmark colored',
    'devicon-jquery-plain-wordmark colored',
    'devicon-nodejs-plain colored',
    'devicon-express-original-wordmark colored',
    'devicon-mongodb-plain-wordmark colored',
    'devicon-postgresql-plain-wordmark colored',
    'devicon-react-original-wordmark colored',
    'devicon-redux-original colored',
    'devicon-webflow-original colored'
  ];

  return (
    <div className="tech-stack-icons">
      <div className="slide-track">
        {/* Original slides */}
        {icons.map((icon, i) => (
          <div key={`a-${i}`} className="slide">
            <i className={icon}></i>
          </div>
        ))}
        {/* Duplicate slides for seamless scroll */}
        {icons.map((icon, i) => (
          <div key={`b-${i}`} className="slide">
            <i className={icon}></i>
          </div>
        ))}
      </div>
    </div>
  );
}
