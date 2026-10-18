import { Download } from 'lucide-react';

export function Header({
  onInstall,
  installLabel,
  installed,
}: {
  onInstall: () => void;
  installLabel: string;
  installed: boolean;
}) {
  return (
    <header className="header">
      <a className="brand" href="/" aria-label="Little Maths home">
        <span className="brand-icon">✳</span> little maths
        <span className="brand-dot">.</span>
      </a>
      {!installed && (
        <button className="install" onClick={onInstall}>
          <Download size={17} />
          <span>{installLabel}</span>
        </button>
      )}
    </header>
  );
}
