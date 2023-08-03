import logo from 'mastodon/../images/logo.svg';

export const WordmarkLogo = () => (
  <svg viewBox='0 0 261 66' className='logo logo--wordmark' role='img'>
    <title>Ruffy</title>
    <use xlinkHref='#logo-symbol-wordmark' />
  </svg>
);

export const SymbolLogo = () => (
  <img src={logo} alt='Ruffy' className='logo logo--icon' />
);

export default WordmarkLogo;
