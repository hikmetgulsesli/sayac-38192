import { useCounter } from './hooks/useCounter';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggle } = useTheme();
  const { value, history, increment, decrement, reset } = useCounter();

  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center gap-8 bg-background text-on-background px-6 py-10"
      aria-labelledby="sayac-baslik"
    >
      <h1
        id="sayac-baslik"
        className="font-headline text-4xl font-bold text-primary"
      >
        Sayaç-38192
      </h1>
      <section
        aria-labelledby="sayac-deger-baslik"
        className="flex flex-col items-center gap-3"
      >
        <h2
          id="sayac-deger-baslik"
          className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant"
        >
          Mevcut Değer
        </h2>
        <p
          aria-live="polite"
          aria-atomic="true"
          className="font-headline text-7xl md:text-8xl font-black leading-none text-primary tracking-tighter"
        >
          {value.toLocaleString('tr-TR')}
        </p>
      </section>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => decrement()}
          aria-label="Sayaç değerini azalt"
          className="w-14 h-14 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest focus-visible:outline-primary transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            remove
          </span>
        </button>
        <button
          type="button"
          onClick={() => reset()}
          aria-label="Sayaç değerini sıfırla"
          className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary focus-visible:outline-primary transition-colors px-3 py-2"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            restart_alt
          </span>
          <span className="text-[0.65rem] font-label font-bold uppercase tracking-wider">
            Sıfırla
          </span>
        </button>
        <button
          type="button"
          onClick={() => increment()}
          aria-label="Sayaç değerini artır"
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary hover:brightness-110 focus-visible:outline-primary transition-colors flex items-center justify-center shadow-[0_12px_40px_rgba(252,83,109,0.3)]"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            add
          </span>
        </button>
      </div>
      <section
        aria-labelledby="gecmis-baslik"
        className="w-full max-w-sm flex flex-col items-center gap-2"
      >
        <h2
          id="gecmis-baslik"
          className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant"
        >
          Son 5 Değer
        </h2>
        {history.length === 0 ? (
          <p className="font-body text-sm text-on-surface-variant">
            Henüz değişiklik yok.
          </p>
        ) : (
          <ol
            className="flex flex-wrap justify-center gap-2"
            aria-label="Geçmiş değerler"
          >
            {history.map((entry) => (
              <li
                key={`${entry.at}-${entry.value}`}
                className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-label font-medium"
              >
                {entry.value.toLocaleString('tr-TR')}
              </li>
            ))}
          </ol>
        )}
      </section>
      <button
        type="button"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
        className="inline-flex items-center gap-2 rounded-xl bg-surface-container-high px-5 py-3 font-label font-semibold text-on-surface hover:bg-surface-container-highest focus-visible:outline-primary transition-colors"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
        {theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
      </button>
    </main>
  );
}
