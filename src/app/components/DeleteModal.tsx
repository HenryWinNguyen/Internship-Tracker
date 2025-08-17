type Props = {
  deleteApplication: () => void;
  cancelDelete: () => void;
};

export default function DeleteModal({ deleteApplication, cancelDelete }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-zinc-800 p-6 rounded shadow-lg max-w-md text-center text-white">
        <p className="text-lg mb-4">
          Are you sure you want to delete this Internship Application?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={deleteApplication}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Yes
          </button>
          <button
            onClick={cancelDelete}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
