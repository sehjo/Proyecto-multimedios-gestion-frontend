interface BackToLoginLinkProps {
  onClick: () => void;
}

// "Volver a Iniciar Sesión" link shown under the reset card.
export default function BackToLoginLink({ onClick }: BackToLoginLinkProps) {
  return (
    <button onClick={onClick} className="text-sm text-blue-600 hover:underline">
      Volver a Iniciar Sesión
    </button>
  );
}
