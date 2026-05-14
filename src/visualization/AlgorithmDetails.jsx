import { ALGORITHM_DETAILS } from '../config/algorithmCatalog';

const AlgorithmDetails = () => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-4">ðŸ”¬ Algorithm Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALGORITHM_DETAILS.map(({ title, cardClass, description, detail }) => (
          <div key={title} className={`${cardClass} p-4 rounded-xl`}>
            <h4 className="text-white font-bold mb-2">{title}</h4>
            <p className="text-white/70 text-sm mb-2">{description}</p>
            <p className="text-yellow-400 text-xs">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmDetails;
