import './style.css';

const LoadingSpinner = () => {
    return (
      <>
        <div className='flex flex-row justify-center items-center'>
          <div className={`loading-spinner w-fit`}></div>
        </div>
      </>
    );
  };
  export default LoadingSpinner;