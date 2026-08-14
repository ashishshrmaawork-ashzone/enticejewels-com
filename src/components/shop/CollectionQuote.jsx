export default function CollectionQuote({ quote }) {
  return (
    <section className="px-5 sm:px-6 md:px-8 pb-14 md:pb-20 text-center">
      <p
        className="max-w-5xl mx-auto text-center font-body text-2xl sm:text-3xl md:text-[40px] font-semibold leading-snug md:leading-[normal] not-italic"
        style={{ color: "#A6A4A4" }}
      >
        &ldquo;{quote}&rdquo;
      </p>
    </section>
  );
}
