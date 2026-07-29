export default function About() {
  return (
    <div className="container section about-page">
      <span className="eyebrow">Our formulation policy</span>
      <h1>We publish the ledger, not just the label.</h1>
      <p className="about-lead">
        Bloomora started in Karachi in 2024 with one rule: if an ingredient is doing something
        to your skin, it gets named and its share of the formula gets printed — on the box and on
        this website. No "proprietary complex," no "active botanicals" standing in for an actual list.
      </p>

      <div className="about-grid">
        <div>
          <h3>Small batches, dated</h3>
          <p>Every product carries a batch code. We rarely make more than a few hundred units of any one formula at a time, which is also why some things sell out.</p>
        </div>
        <div>
          <h3>Sourced regionally</h3>
          <p>Saffron from Kashmir, sandalwood from Mysore, neem and turmeric grown across Pakistan and India — botanicals we grew up around, reformulated with modern actives like niacinamide and ceramides.</p>
        </div>
        <div>
          <h3>Tested, not just trending</h3>
          <p>Every formula is patch-tested and pH-balanced before it ships, and that pH is printed on the ticket, not hidden in a lab file.</p>
        </div>
      </div>

      <div className="about-cta card">
        <h3>Have a question about a formula?</h3>
        <p>Our contact page goes straight to the two people who make these — not a support queue.</p>
        <a href="/contact" className="btn btn-primary btn-sm">Get in touch</a>
      </div>
    </div>
  );
}
