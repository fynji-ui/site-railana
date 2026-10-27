import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  nome,
  mensagemInicial,
  cartaPrincipal,
  mensagensDoTarot,
  lembrancas,
  mensagemSobreADistancia,
  mensagemFinal,
  assinatura,
} from "@/content/textos";
import { Divider, MoonSeal, PhotoSlot, Reveal } from "@/components/carta/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `Para ${nome} — feliz aniversário` },
      { name: "description", content: `Uma carta de aniversário escrita para ${nome}.` },
      { property: "og:title", content: `Para ${nome}` },
      { property: "og:description", content: "Uma carta de aniversário, com algumas coisas para descobrir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [aberta, setAberta] = useState(false);
  const [viradas, setViradas] = useState<boolean[]>(mensagensDoTarot.cartas.map(() => false));

  const abrir = () => {
    setAberta(true);
    requestAnimationFrame(() => document.getElementById("carta")?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <main className="overflow-x-hidden">
      <Abertura onAbrir={abrir} aberta={aberta} />
      {aberta && (
        <>
          <Carta />
          <Tarot viradas={viradas} setViradas={setViradas} />
          <Lembrancas />
          <Distancia />
          <Final liberada={viradas.every(Boolean)} />
        </>
      )}
    </main>
  );
}

function Abertura({ onAbrir, aberta }: { onAbrir: () => void; aberta: boolean }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <div className="fade-up flex flex-col items-center">
        <MoonSeal className="mb-8 h-7 w-7 text-primary" />
        <p className="eyebrow">{mensagemInicial.data}</p>
        <h1 className="mt-4 text-7xl leading-none text-ink sm:text-8xl md:text-9xl">{nome}</h1>
        <p className="mt-6 max-w-sm font-display text-xl italic text-muted-foreground sm:text-2xl">{mensagemInicial.frase}</p>
        {!aberta && (
          <button
            onClick={onAbrir}
            className="group mt-12 inline-flex items-center gap-3 border-b border-primary/40 pb-1 text-sm tracking-[0.2em] text-primary uppercase transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {mensagemInicial.botao}
            <span className="transition-transform group-hover:translate-y-0.5" aria-hidden>↓</span>
          </button>
        )}
      </div>
    </section>
  );
}

function Carta() {
  const [segredo, setSegredo] = useState(false);
  return (
    <section id="carta" className="mx-auto grid max-w-5xl scroll-mt-8 gap-10 px-6 py-24 md:grid-cols-[1.4fr_1fr] md:items-start">
      <Reveal>
        <article className="paper relative px-7 py-10 sm:px-12 sm:py-14">
          <p className="font-display text-3xl italic text-primary">{cartaPrincipal.saudacao}</p>
          <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed">
            {cartaPrincipal.paragrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <button
            onClick={() => setSegredo((s) => !s)}
            aria-expanded={segredo}
            aria-label="Um recado escondido"
            className="absolute -right-3 -bottom-4 rounded-full bg-background p-2 text-accent shadow-sm transition-transform hover:rotate-12 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
              <path d="M12 21V11M12 11c-3-1-5-4-4-7 3 0 5 3 4 7zm0 0c3-1 5-4 4-7-3 0-5 3-4 7zm0 4c-2-2-5-2-7-1 2 2 5 2 7 1zm0 0c2-2 5-2 7-1-2 2-5 2-7 1z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          {segredo && (
            <p className="fade-up mt-8 border-t border-dashed pt-5 font-display text-lg italic text-accent">{cartaPrincipal.segredo}</p>
          )}
        </article>
      </Reveal>
      <Reveal className="md:mt-16">
        <PhotoSlot src={cartaPrincipal.foto} caption={cartaPrincipal.legendaFoto} className="mx-auto max-w-xs rotate-2" />
      </Reveal>
    </section>
  );
}

function Tarot({ viradas, setViradas }: { viradas: boolean[]; setViradas: (v: boolean[]) => void }) {
  return (
    <section className="px-6 py-24">
      <Reveal className="text-center">
        <Divider />
        <h2 className="mt-8 text-4xl text-ink sm:text-5xl">{mensagensDoTarot.titulo}</h2>
        <p className="mt-3 text-muted-foreground">{mensagensDoTarot.instrucao}</p>
      </Reveal>
      <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
        {mensagensDoTarot.cartas.map((c, i) => (
          <Reveal key={c.nome}>
            <button
              className="flip block w-full max-w-[240px] mx-auto text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              data-flipped={viradas[i]}
              aria-pressed={viradas[i]}
              aria-label={`${c.nome}${viradas[i] ? "" : " — virar carta"}`}
              onClick={() => setViradas(viradas.map((v, j) => (j === i ? !v : v)))}
            >
              <div className="flip-inner relative aspect-[7/12]">
                <div className="flip-face paper absolute inset-0 flex flex-col items-center justify-center gap-4 bg-night text-night-foreground">
                  <div className="absolute inset-3 border border-night-foreground/25" />
                  <MoonSeal className="h-8 w-8 opacity-80" />
                  <span className="eyebrow text-night-foreground/70">{["I", "II", "III"][i]}</span>
                </div>
                <div className="flip-face flip-back paper absolute inset-0 flex flex-col p-2">
                  <img src={c.imagem} alt={`Carta de tarô ${c.nome}, Rider-Waite-Smith`} loading="lazy" className="h-3/5 w-full object-cover object-top" onError={(e) => (e.currentTarget.style.display = "none")} />
                  <div className="flex flex-1 flex-col justify-center px-2 py-3">
                    <p className="eyebrow">{c.nome}</p>
                    <p className="mt-2 font-display text-[0.98rem] leading-snug italic">{c.mensagem}</p>
                  </div>
                </div>
              </div>
            </button>
          </Reveal>
        ))}
      </div>
      <p className="mt-10 text-center text-xs text-muted-foreground">Cartas do tarô Rider-Waite-Smith (1909), domínio público.</p>
    </section>
  );
}

function Lembrancas() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <Reveal className="text-center">
        <Divider />
        <h2 className="mt-8 text-4xl text-ink sm:text-5xl">{lembrancas.titulo}</h2>
        <p className="mt-3 text-muted-foreground">{lembrancas.subtitulo}</p>
      </Reveal>
      <ol className="relative mt-16 space-y-16 border-l border-border pl-8 sm:pl-12">
        {lembrancas.itens.map((m, i) => (
          <li key={i}>
            <Reveal className="relative">
              <span className="absolute top-2 -left-[calc(2rem+5px)] h-2.5 w-2.5 rounded-full bg-primary sm:-left-[calc(3rem+5px)]" aria-hidden />
              <p className="eyebrow">{m.data}</p>
              <h3 className="mt-2 text-2xl text-ink sm:text-3xl">{m.titulo}</h3>
              <p className="mt-3 leading-relaxed">{m.texto}</p>
              {m.foto && <PhotoSlot src={m.foto} className="mt-6 max-w-[220px]" />}
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Distancia() {
  const d = mensagemSobreADistancia;
  return (
    <section className="bg-night px-6 py-28 text-night-foreground">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-night-foreground/60">{d.distancia}</p>
        <h2 className="mt-4 text-4xl sm:text-5xl">{d.titulo}</h2>
        <div className="mt-14 flex items-center justify-between gap-3 sm:gap-6">
          <span className="font-display text-base italic sm:text-xl">{d.cidadeDele}</span>
          <span className="h-px flex-1 border-t border-dashed border-night-foreground/30" />
          <img src="/images/lua-cheia.jpg" alt="Fotografia da lua cheia" loading="lazy" className="h-24 w-24 rounded-full object-cover sm:h-36 sm:w-36" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
          <span className="h-px flex-1 border-t border-dashed border-night-foreground/30" />
          <span className="font-display text-base italic sm:text-xl">{d.cidadeDela}</span>
        </div>
        <div className="mx-auto mt-14 max-w-xl space-y-5 text-lg leading-relaxed text-night-foreground/85">
          {d.texto.map((t, i) => (
            <p key={i} className={i === 0 ? "font-display text-2xl italic text-night-foreground" : ""}>{t}</p>
          ))}
        </div>
        <p className="mt-10 text-xs text-night-foreground/40">Foto da lua: Gregory H. Revera, Wikimedia Commons (CC BY-SA 3.0).</p>
      </Reveal>
    </section>
  );
}

function Final({ liberada }: { liberada: boolean }) {
  const [lida, setLida] = useState(false);
  return (
    <section className="mx-auto max-w-2xl px-6 py-28">
      {!lida ? (
        <Reveal className="text-center">
          <MoonSeal className="mx-auto h-6 w-6 text-primary" />
          {liberada ? (
            <button onClick={() => setLida(true)} className="mt-8 border-b border-primary/40 pb-1 text-sm tracking-[0.2em] text-primary uppercase hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
              {mensagemFinal.botao}
            </button>
          ) : (
            <p className="mt-6 font-display text-xl italic text-muted-foreground">{mensagemFinal.bloqueada}</p>
          )}
        </Reveal>
      ) : (
        <article className="fade-up paper px-7 py-12 sm:px-14">
          <p className="eyebrow">Feliz aniversário, {nome}</p>
          <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed">
            {mensagemFinal.paragrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="mt-10 font-display text-xl italic">{mensagemFinal.despedida}</p>
          <p className="font-display text-4xl text-primary">{assinatura}</p>
          <MoonSeal className="mt-8 ml-auto h-6 w-6 text-primary/70" />
        </article>
      )}
    </section>
  );
}
