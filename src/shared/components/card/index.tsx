import { Link } from 'react-router-dom';

interface CardProps {
  link: string;
  text: string;
  count?: number;
  value?: number;
  description: string;
}

const Card = ({ link, text, count, value, description }: CardProps) => {
  return (
    <div className="group relative cursor-pointer overflow-hidden bg-white px-6 pt-4 pb-4 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 w-[300px] md:w-full hover:-translate-y-1 rounded-lg hover:shadow-2xl ">
      <span className="absolute top-4 z-0 h-12 w-12 rounded-full bg-amber-500 transition-all duration-300 group-hover:scale-[15]"></span>
      <div className="relative z-10 mx-auto max-w-md">
        <p className="absolute top-0 right-0 md:top-0 md:right-8 text-4xl font-bold ">
          {count}
        </p>
        {value !== undefined && value !== null ? (
          <p className="absolute top-0 right-0 md:top-0 md:right-8 text-4xl font-bold">
            R${value}
          </p>
        ) : null}
        <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
          <p>{description}</p>
        </div>
        <div className="pt-5 text-base font-semibold leading-7">
          <p className="hover:translate-x-3 duration-200">
            <Link
              to={link}
              className="text-amber-500 transition-all duration-300 group-hover:text-white"
            >
              {text}
              &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
