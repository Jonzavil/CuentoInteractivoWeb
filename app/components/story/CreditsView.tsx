import Image from "next/image";

const AUTHORS = [
  { name: "Ana Paula Jara", image: "ana.png", portfolio: "www.behance.net/anapaula449" },
  { name: "Nicole Holguin", image: "nicole.png", portfolio: "www.behance.net/nicoleholguin" },
];

const TUTORS = [
  { name: "PhD ROBERTO ZURITA", image: "ROBERTO .png" },
  { name: "PhD LOURDES PILAY", image: "lourdes.png" },
];

export function CreditsView() {
  return (
    <section className="credits-view" aria-label="Créditos de Guardianes de la Fauna">
      <section className="credits-view__section" aria-labelledby="authors-title">
        <h2 id="authors-title" className="credits-view__title">AUTORAS</h2>
        <p className="credits-view__roles">DISEÑO | ILUSTRACIÓN | ANIMACIÓN</p>
        <div className="credits-view__people">
          {AUTHORS.map((author) => (
            <figure className="credits-view__person" key={author.name}>
              <Image src={`/assets/CREDITOS/${author.image}`} alt={`Retrato de ${author.name}`} width={2940} height={3492} sizes="(max-width: 600px) 75vw, 282px" />
              <figcaption>
                <h3>{author.name}</h3>
                <a href={`https://${author.portfolio}`} target="_blank" rel="noopener noreferrer">{author.portfolio}</a>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="credits-view__section credits-view__section--tutors" aria-labelledby="tutors-title">
        <h2 id="tutors-title" className="credits-view__title">TUTORÍA</h2>
        <div className="credits-view__people">
          {TUTORS.map((tutor) => (
            <figure className="credits-view__person" key={tutor.name}>
              <Image src={`/assets/CREDITOS/${tutor.image}`} alt={`Retrato de ${tutor.name}`} width={2940} height={3492} sizes="(max-width: 600px) 75vw, 302px" />
              <figcaption><h3>{tutor.name}</h3></figcaption>
            </figure>
          ))}
        </div>
      </section>
    </section>
  );
}
