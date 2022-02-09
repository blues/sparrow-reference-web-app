import { BallTriangle } from "react-loading-icons";

export const LoadingSpinner = ({
  isLoading,
}: {
  isLoading: boolean;
}): JSX.Element => {
  const speed = isLoading ? 0.75 : 0.001;
  const opacity = isLoading ? 1 : 0.2;
  return (
    <>
      <div className="loadingSpinner">
        <BallTriangle speed={speed} height="40px" opacity={opacity} />
      </div>
      <style jsx>{`
        .loadingSpinner {
          position: absolute;
          top: 32px;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </>
  );
};

const de = { LoadingSpinner };
export default de;
