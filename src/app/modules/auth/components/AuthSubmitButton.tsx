interface AuthSubmitButtonProps {
  loading: boolean;
  // Label when idle.
  label: string;
  // Label while the request is in flight.
  loadingLabel: string;
}

// Full-width primary submit button used by the auth forms.
export default function AuthSubmitButton({ loading, label, loadingLabel }: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
