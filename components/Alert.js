export const AlertDanger = ({ message }) => {
  return (
    <div className="bg-red-400 text-white p-4 mt-4 rounded">
      <p>{message}</p>
    </div>
  );
};
