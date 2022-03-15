export const LoadingMessage = ({ isLoading }: { isLoading: boolean }) =>
  isLoading ? (
    <div
      style={{
        color: "white",
        backgroundColor: "black",
        position: "fixed",
        bottom: "0",
        right: "0",
        zIndex: 100,
        padding: "1em",
      }}
    >
      Loading...
    </div>
  ) : null;

const DEFAULT = { LoadingMessage };
export default DEFAULT;
