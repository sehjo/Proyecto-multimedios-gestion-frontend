// Copyright footer shown at the bottom of the auth screens.
export default function AuthFooter() {
  return (
    <p className="mt-10 text-center text-xs text-gray-400">
      © {new Date().getFullYear()} CCSS Consultory · Sistema de gestión médica
    </p>
  );
}
