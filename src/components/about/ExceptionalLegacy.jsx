export default function ExceptionalLegacy({ title, content }) {
  return (
    <section id="exceptional-legacy" className="bg-white pb-12 md:pb-16">
      <div className="container mx-auto px-5 sm:px-6 md:px-8 text-center">
        <h2 className="font-heading text-maroon text-3xl md:text-5xl mb-5">
          {title || "An Exceptional Legacy"}
        </h2>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: "#232020" }}>
          {content || <>Upholding a legacy of the finest craftsmanship for over a century, &lsquo;Entice,
          KGK 1905&rsquo; is a fine jewellery flagship brand by KGK Group that was
          launched in 2004. Group&rsquo;s robust presence across the value chain,
          covering the entire spectrum of mines to brands that includes mining,
          sourcing, manufacturing and distributing colored stones, diamonds and
          jewellery plays a vital role in strengthening the brand value of Entice. As
          a result, Entice offers an unforgettable experience to its patrons.</>}
        </p>
      </div>
    </section>
  );
}
